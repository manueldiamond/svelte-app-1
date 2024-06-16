<script lang="ts">  
    import { auth } from "$lib/firebase";
    import {GoogleAuthProvider,signInWithPopup } from 'firebase/auth'
    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth,provider)
        
    }
</script>
<h2>sign-in</h2>
<button on:click={signInWithGoogle}  class="btn btn-primary  w-full gap-3 py-2 px-5">
    Sign In with Google 
    <img class="flex h-full grayscale" alt="google_Svg" src="/google-icon-logo.svg" >
</button> 