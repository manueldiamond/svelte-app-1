<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let 
     url='https://www.youtube.com/watch?v=t_FQ26XU930',
     icon='youtube',
     title='Cool!',
     editing=false;

     const dispatch = createEventDispatcher()
     const del=()=>{
        dispatch('delete',url)
     }
</script>

<a href={editing?"":url} class="glass group relative btn py-5 px-8 h-max flex w-full gap-2">
    <img src={`/${icon}.png`} alt={icon} width="32" height="32" class="icon"/>
    <span class="flex-1">{title?title:`My ${icon[0].toLocaleUpperCase()}${icon.slice(1).toLowerCase()} Page`}</span>
    {#if editing}
        <div class="absolute hidden group-hover:flex justify-end gap-2">
            <a href={url} class="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </a>
            <button on:click={del} class="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>                  
            </button>
        </div>
    {/if}
</a>