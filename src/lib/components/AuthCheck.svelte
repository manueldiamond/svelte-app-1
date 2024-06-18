<script lang="ts">
    import {user, userData} from '$lib/firebase'
</script>
{#if $user}
    <slot/>
{:else}
    <div>
        <p class="italic">
            You must login first
            <a href="/login" class="btn ">Sign in</a>
        </p>
    </div>
{/if}