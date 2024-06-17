<script lang="ts">
    import { doc, updateDoc } from 'firebase/firestore';
    import type { PageData } from './$types';
    import { DB, user, userData } from '$lib/firebase';
    import { page } from '$app/stores';
    
    export let data: PageData;
    let status = ''

   
</script>
<main class="flex flex-col gap-4 py-10 items-center max-w-[20rem] mx-auto">
  
    <h1 class="font-bold text-xl">Editing<span class="text-primary text-2xl">@{$userData?.username}</span>'s Bio</h1>
   
    <form class="form-control gap-2" method="POST">
        <textarea class="textarea-bordered w-80 textarea" name='bio' bind:value={data.bio}/>
        <p>{$page.form?.problem??''}</p>
        <div class="flex justify-end gap-2">
            <a class="btn btn-ghost uppercase" href={`${data.username}`}>back</a>
            <button class="btn uppercase" type="submit">save</button>
        </div>
    </form>

</main>
