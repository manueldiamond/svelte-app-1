<script lang="ts">
    import { doc, updateDoc } from 'firebase/firestore';
    import type { PageData } from './$types';
    import { DB, user, userData } from '$lib/firebase';
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import { PUBLIC_PROD_URL } from '$env/static/public';
    
</script>
<main class="flex flex-col gap-4 py-10 items-center max-w-[20rem] mx-auto">
  
    <h1 class="font-bold text-xl">Editing<span class="text-primary text-2xl">@{$userData?.username}</span>'s Bio</h1>

</main>
