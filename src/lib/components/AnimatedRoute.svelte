<script>
    import { page } from '$app/stores';
    import {fly} from 'svelte/transition'

    let left=true
    $: {
        $page.url;
        left = !left;
    }

</script>
{#key $page.url}
<div in:fly={{x:`${left?"":"-"}100%`, opacity:0, duration:500}}>
    <slot/>
</div>
{/key}