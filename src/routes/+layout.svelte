<script lang="ts">
    import '../app.css'
    import { user, userData } from '$lib/firebase';
    import {page} from '$app/stores'
    import { getDisplayName, name,ProfileImage } from '$lib';
    $user;
    $userData;
    $:isOnLoginPage=$page.url.pathname.includes('/login')
    
</script>

<div class="min-h-screen flex flex-col">
    {#if $user && !isOnLoginPage}
        <nav class="w-full py-5 shadow-xl flex justify-between items-center px-4">
            <h1 class="text-primary font-extrabold uppercase text-2xl">{name}</h1>
            <a href="/login" class="text-sm flex gap-3 items-center">
                <span>{getDisplayName()}</span>
                <ProfileImage className={'h-8'}/>
            </a>
        </nav>
    {/if}
    <slot/>
</div>