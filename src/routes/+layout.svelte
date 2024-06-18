<script lang="ts">
    import '../app.css'
    import { user, userData } from '$lib/firebase';
    import {page} from '$app/stores'
    $user;
    $userData;
    $:isOnLoginPage=$page.url.pathname.includes('/login')
</script>

<div class="min-h-screen flex flex-col">
    {#if $user && !isOnLoginPage}
        <nav class="w-full py-5 shadow-xl flex justify-between items-center px-4">
            <h1 class="text-primary font-extrabold uppercase text-2xl">Linkr</h1>
            <a href="/login" class="text-sm flex gap-3 items-center">
                <span>{$user.displayName}</span>
                <div class="avatar">
                    <div class=" ring rounded-full aspect-square h-8">
                        <img  src={$userData?.photoURL} alt={`${$user.displayName}'s profile photo'`}>
                    </div>
                </div>
            </a>
        </nav>
    {/if}
    <slot/>
</div>