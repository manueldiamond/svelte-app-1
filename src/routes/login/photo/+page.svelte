<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import {storage, userData,user, DB, type UserData} from '$lib/firebase'
    import { doc, updateDoc } from "firebase/firestore";
    import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

    let previewURL:string|null=null;
    let fileInput:HTMLInputElement;
    let uploading=false;
    async function upload(e:Event){
        uploading=true;
        const file:File|undefined = (e.target as HTMLInputElement).files?.[0]
        if(!file) return
        previewURL=URL.createObjectURL(file)
        const storageRef=ref(storage,`users/${$user!.uid}/profile.png`)
        const result = await uploadBytes(storageRef,file)
        const url = await getDownloadURL(result.ref)
        updateDoc(doc(DB,'users',$user!.uid),{photoURL:url} satisfies Partial<UserData>);
        uploading=false;
        fileInput.value=''
    }
</script>
<AuthCheck>
    <h1>Edit Profile Photo</h1>
    <form class="form-control gap-5">

        <button class="" on:click={()=>fileInput.click()}> 
            <img 
                class="avatar rounded-xl w-80" 
                class:animate-pulse={uploading}
                src={previewURL??$userData?.photoURL??'/user.png'} 
                alt={`${$userData?.username} photo`}
            >
        </button>
        {#if uploading}
            <progress class="progress progress-primary"/>
        {/if}
        <input  bind:this={fileInput} disabled={uploading} on:change={upload} class="file-input" type="file" accept="image/* "/>
    </form>
    <a class="btn btn-primary w-full">Done</a>
</AuthCheck>