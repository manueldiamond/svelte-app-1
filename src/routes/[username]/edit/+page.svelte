<script lang="ts">
    import { arrayUnion,arrayRemove , doc, setDoc, updateDoc,} from 'firebase/firestore';
    import type { PageData } from './$types';
    import { DB, user, userData } from '$lib/firebase';
    import { writable } from 'svelte/store';
    import SortableList from '$lib/components/SortableList.svelte';
    import {env} from '$env/dynamic/public'
    import { dev } from '$app/environment';
    import UserLink from '$lib/components/UserLink.svelte';
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
  
    export let data: PageData;
    
    
    let showAddLinkForm = false;
    let showEditBioForm = false;
    
    $: bioFormVisible = showEditBioForm&&($page.form.message??true)

    let icons = ['Youtube','Facebook','Whatsapp','Twitter','GitHub','Custom']
    const defaultFormData={
        icon:'custom',
        title:'',
        url:''
    }
    
    const formData = writable(defaultFormData)
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    $: isProfilePublic = $userData?.published;
    $: urlValid = $formData.url && $formData.url.match(urlRegex);
    $: titleValid = $formData.title.length<20 && $formData.title.length>0;
    $: profileUrl = `http${dev?"":"s"}://${dev?env.PUBLIC_DEV_URL:env.PUBLIC_PROD_URL}/${$userData?.username}` 
    
    async function setPublished(e:Event) {
        const input = e.target as HTMLInputElement;
        console.log("Setting to ",!isProfilePublic)
        const ref = doc(DB,"users",$user!.uid);
        await updateDoc(ref,{published:!isProfilePublic})
    }        
    
    async function addLink() {
        
        const ref = doc(DB,"users",$user!.uid);

        await updateDoc(ref,{
            links:arrayUnion({
                ...$formData,
                id: Date.now().toString(),
            }),
        }); 

        formData.set({
            icon:'custom',
            title:'',
            url:''
         })

        showAddLinkForm=false;
    }
    function deleteLink(e:CustomEvent){
        const url = e.detail
        const userRef=doc(DB,'users',$user!.uid);
        updateDoc(userRef,{
            links:$userData?.links.filter(item=>item.url!=url)
        })
    }
    function sortList(e:CustomEvent){
        const newList = e.detail;
        const userRef = doc(DB,'users',$user!.uid);
        setDoc(userRef,{links:newList },{merge:true})
    }
</script>

<main class="flex flex-col gap-4 items-center w-90 my-5 mb-20">

    <h1 class="text-2xl font-bold">{$user?.displayName} Edit your Profile</h1>
    <p>Profile Link: <a class:text-primary={isProfilePublic} class="link" href={profileUrl} target='_blank'>{profileUrl}</a></p>
    <p class="text-sm text-slate-500 -mt-4">({isProfilePublic?"visible to all":"only visible to you"})</p>
    <div class="flex gap-2">
        <label for="public-checkbox" >Public</label>
        <input 
            name='public-checkbox' 
            class:toggle-success={$userData?.published} 
            checked={isProfilePublic} 
            type="checkbox" 
            class="toggle"
            on:change={setPublished}
        />
    </div>

    <div class="card w-96 bg-base-100 shadow-xl image-full">
        <figure>
            <img src={$userData?.photoURL} alt="profile" />
        </figure>
        <div class="card-body">
            <a class="btn btn-outline" href={"/login/photo"}>Change Photo</a>
        </div>
    </div>
    

    {#if bioFormVisible}
    <form class="form-control form-bordered gap-2" method="POST" use:enhance >
        <textarea class="textarea-bordered w-80 textarea" name='bio' bind:value={data.bio}/>
        <p>{$page.form?.message??''}</p>
        <div class="flex justify-end gap-2">
            <button on:click={()=>showEditBioForm=false} class="btn btn-ghost uppercase">cancel</button>
            <button class="btn uppercase" type="submit">save</button>
        </div>
    </form>
    {:else}
        <p class="text-justify">
            {$userData?.bio} 
            [<button on:click={()=>showEditBioForm=true} class="link text-primary">edit</button>] 
        </p>
    {/if}

    <hr class="w-40 mt-5 text-slate-500"/>
    <h1 class="text-xl font-semibold text-primary ">Edit Links</h1>
    <div class="px-4 w-80"> 
        <SortableList 
            
            list={$userData?.links}
            on:sort={sortList}
            let:item
        >
            <div>
                <UserLink editing on:delete={deleteLink} {...item}/>
            </div>
        </SortableList>
    </div>
    {#if showAddLinkForm}
        <form 
            on:submit|preventDefault={addLink} 
            class="border-neutral bg-neutral border-2 border-dashed rounded-xl"    
        >
            <select name='icon' class="select select-bordered" bind:value={$formData.icon}>
                {#each  icons as icon }
                    <option value={icon.toLocaleLowerCase()}>{icon}</option>
                {/each}
            </select>
            <input class:text-error={!titleValid} name="title" type="text" class="input" placeholder={$formData.icon?`My ${$formData.icon} Page`:"Title"} bind:value={$formData.title}/>
            <input class:text-error={!urlValid}  name="url" type="text" class="input" placeholder={`${$formData.icon} Link`} bind:value={$formData.url}/>
            <p class="text-error"></p>
            <div class="flex justify-end">
                <button 
                on:click={()=>showAddLinkForm=false} 
                class="btn btn-ghost uppercase"
                >
                    Cancel
                </button>
                <button type="submit" disabled={!(urlValid&&titleValid)} class="btn btn-primary uppercase">Add</button>
            </div>
        </form>
    {:else}
        <button 
            on:click={()=>showAddLinkForm=true}  
            class="btn"
        >Add Link</button>
    {/if}
</main>
