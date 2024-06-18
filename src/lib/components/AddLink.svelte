<script lang="ts">
    import { DB, user, userData } from "$lib/firebase";
    import { arrayUnion, doc, updateDoc } from "firebase/firestore";
    import { createEventDispatcher } from "svelte";
    import { writable } from "svelte/store";

    export let demo = false
    let showAddLinkForm = false;
    let icons = ['Youtube','Facebook','Whatsapp','Twitter','GitHub','Custom']
    const defaultFormData={
        icon:'custom',
        title:'',
        url:''
    }

    const dispatch = createEventDispatcher();
    
    const addLink:any=async()=>{
        dispatch('add',$formData)
        if (!demo){

            const ref = doc(DB,"users",$user!.uid);
            
            await updateDoc(ref,{
                links:arrayUnion({
                    ...$formData,
                    id: Date.now().toString(),
                }),
            }); 

        }
        formData.set({
            icon:'custom',
            title:'',
            url:''
        })
        showAddLinkForm=false;
    }
    
    const formData = writable(defaultFormData)
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    $: urlValid = $formData.url && $formData.url.match(urlRegex);
    $: titleValid = $formData.title.length<20;
    
</script>

{#if showAddLinkForm}
<form 
    on:submit|preventDefault={addLink} 
    class="border-neutral mx-auto bg-neutral border-2 border-dashed rounded-xl"    
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
    class="btn mx-auto "
>Add Link</button>
{/if}