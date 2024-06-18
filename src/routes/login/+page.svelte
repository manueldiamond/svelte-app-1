<script lang="ts">  
    import { auth, user, userData} from "$lib/firebase";
    import {GoogleAuthProvider,signInWithPopup,signOut} from 'firebase/auth'
    import {goto} from '$app/navigation'
    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth,provider)

        const idToken=await userCredential.user.getIdToken()
        const res = await fetch('/api/signin',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
                //svelte handles CORS
            },
            body:JSON.stringify({idToken})
        })
        if($user)
            goto('/login/username')
    }
    async function sigOutUser() {
        const res = await fetch('/api/signin',{method:'DELETE'});
        await signOut(auth)
    }
    
</script>

{#if !$user}
    <h2>sign-in</h2>
    <button on:click={signInWithGoogle}  class="btn btn-primary  w-full gap-3 py-2 px-5">
        Sign In with Google 
        <img class="flex h-full grayscale" alt="google_Svg" src="/google-icon-logo.svg" >
    </button> 
{:else}
    <div class="avatar online">
        <div class="ring rounded-full w-28">
            <img  src={$userData?.photoURL} alt={`${$user.displayName}'s profile photo'`}>
        </div>
    </div>
    <h1>Hi, {$user.displayName}</h1>
    <p class="text-green-400">You are logged in as {$user.email}</p>
    <button on:click={sigOutUser}  class="btn w-full gap-3 py-2 px-5">
        Sign Out
    </button>
{/if}