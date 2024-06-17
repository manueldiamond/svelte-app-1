<script lang="ts">
    import type { PageData } from './$types';
    import {user, userData, type UserData} from '$lib/firebase'
    import UserLink from '$lib/components/UserLink.svelte';
    export let data: PageData;
</script>

<svelte:head>
    <title>@{data.username} Links</title>
    <meta name='description' content={data.bio} />
</svelte:head>
<main class="flex-col flex gap-3 items-center mx-auto">
    <h1 class="text-primary text-4xl">@{data.username}</h1>
    <img 
        class="avatar rounded-xl w-80" 
        src={$userData?.photoURL??'/user.png'} 
        alt={`${$userData?.username} photo`}
    />
    <p>{data.bio??"no  bio yet.."}</p>
    <ul class="list-none flex flex-col gap-4 w-full">
        {#each  data.links as item}
            <li class="list-item">
                <UserLink {...item} />
            </li>
        {/each}
    </ul>
    {#if ($user&&data.username===$userData?.username)}
        <a href={`/${$userData.username}/edit`} class="btn btn-outline w-full">Edit Your Profile</a>
    {/if}
</main>