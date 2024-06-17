<script lang="ts">
    import { page } from "$app/stores";
    import AnimatedRoute from "$lib/components/AnimatedRoute.svelte";

  

</script>
<main class="items-center flex-col flex py-5">
    <nav class="pb-10">
        <ul class="steps">
            <a 
                class="step step-primary" 
                href="/login" 
            >Sign In</a>
            <a 
                class="step" 
                href="/login/username" 
                class:step-primary={$page.route.id?.match(/username|photo/g)}
            >Choose Username</a>
            <a 
                class="step"
                href="/login/photo"
                class:step-primary={$page.route.id?.includes("photo")}
            >Upload Photo</a>
        </ul>
    </nav>
    <AnimatedRoute>
        <div class="card bg-neutral">
            <div class="card-body items-center flex flex-col">
                <slot/>
            </div>
        </div>
    </AnimatedRoute>
</main>