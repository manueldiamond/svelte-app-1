<script lang="ts">
    import { arrayUnion,arrayRemove , doc, setDoc, updateDoc,} from 'firebase/firestore';
    import type { PageData } from './$types';
    import { DB, user, userData } from '$lib/firebase';
    import { writable } from 'svelte/store';
    import SortableList from '$lib/components/SortableList.svelte';
    import {env} from '$env/dynamic/public'
    import { dev } from '$app/environment';
    import type { ChangeEventHandler } from 'svelte/elements';
    import UserLink from '$lib/components/UserLink.svelte';
  
    let showForm = false;
    
    
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

        showForm=false;
    }
    function deleteLink(e:CustomEvent){
        const url = e.detail
        const userRef=doc(DB,'users',$user!.uid);
        updateDoc(userRef,{
            links:arrayRemove()
        })
    }
    function sortList(e:CustomEvent){
        const newList = e.detail;
        const userRef = doc(DB,'users',$user!.uid);
        setDoc(userRef,{links:newList },{merge:true})
    }
</script>

<main class="flex flex-col gap-4 items-center w-90 my-5 mb-20">

    <h1 class="text-2xl font-bold">Edit your Profile</h1>
    <p>Profile Link: <a class="link text-secondary" href={profileUrl} target='_blank'>{profileUrl}</a></p>

    <div class="card w-96 bg-base-100 shadow-xl image-full">
        <figure>
            <img src={$userData?.photoURL} alt="profile" />
        </figure>
        <div class="card-body">
            <a class="btn btn-outline" href={"/login/photo"}>Change Photo</a>
        </div>
    </div>

    <div class="flex gap-2">
        <label for="public-checkbox" >Public</label>
        <input 
            id='public-checkbox' 
            class:toggle-success={$userData?.published} 
            bind:checked={isProfilePublic} 
            type="checkbox" 
            class="toggle"
            on:change={setPublished}
        />
    </div>

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
    {#if showForm}
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
            <input  class:text-error={!urlValid}  name="url" type="text" class="input" placeholder={`${$formData.icon} Link`} bind:value={$formData.url}/>
            <p class="text-error"></p>
            <div class="flex justify-end">
                <button 
                on:click={()=>showForm=false} 
                class="btn btn-ghost uppercase"
                >
                    Cancel
                </button>
                <button type="submit" disabled={!(urlValid&&titleValid)} class="btn btn-primary uppercase">Add</button>
            </div>
        </form>
    {:else}
        <button 
            on:click={()=>showForm=true}  
            class="btn"
        >Add Link</button>
    {/if}
</main>
