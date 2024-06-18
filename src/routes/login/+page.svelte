<script lang="ts">  
    import { auth, user, userData} from "$lib/firebase";
    import {
        GoogleAuthProvider,
        signInWithPopup,
        signOut,
        FacebookAuthProvider,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword

    } from 'firebase/auth'

    import type {UserCredential} from 'firebase/auth'
    import {goto} from '$app/navigation'
    import { name } from "$lib";
    import { writable } from "svelte/store";
    import ProfileImage from "$lib/components/ProfileImage.svelte";

    
    function signIn(signInFuntion:()=>Promise<UserCredential>){
        return async()=>{
            try{
                const userCredential = await signInFuntion()
                const idToken=await userCredential.user.getIdToken()
                const res = await fetch('/api/signin',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                        //svelte handles CORS
                    },
                    body:JSON.stringify({idToken})
                })
            }catch(e){
                $formStore.error=(e as Error).message
            }
                if($user)
                    goto('/login/username')
        }
    }
    const signInWithGoogle=signIn(async ()=>{
        const provider = new GoogleAuthProvider();
        const credentials =  await signInWithPopup(auth,provider)
        return credentials;
    })
    const signInWithEmail=signIn(async ()=>{
        
        if (registering){
            if($formStore.pass!==$formStore.confirmpass) throw new Error("Passwords don't match")
            
            return await createUserWithEmailAndPassword(auth,$formStore.email,$formStore.pass)

        }else{
            return await signInWithEmailAndPassword(auth,$formStore.email,$formStore.pass)
        }    
    })
    
    async function sigOutUser() {
        const res = await fetch('/api/signin',{method:'DELETE'});
        await signOut(auth)
    }
    let registering=false
    const formStore = writable({email:"",pass:"",error:'',confirmpass:''})
    $:canSignIn = $formStore.pass.length>=6&&registering?$formStore.confirmpass===$formStore.pass:true
</script>

{#if !$user}
    <h2 class="text-xl font-bold">Sign-in to continue</h2>
    <p class="text-error">{$formStore.error}</p>
    <form class="mt-4 form-control gap-3" on:submit|preventDefault={signInWithEmail}>
        <input bind:value={$formStore.email} placeholder="Email" name="email" type="email" class="input"/>
        <input bind:value={$formStore.pass} placeholder="Password" name='pass' type="password" class="input password"/>
        {#if registering}
            <input bind:value={$formStore.confirmpass} placeholder="Confirm password" name='confirmpass' type="password" class="input password"/>
        {/if}
        <button disabled={!canSignIn} type="submit" class="btn my-4">{registering?"Register":"Sign in"}</button>
    </form>
    <p>New to {name}? <button on:click={()=>registering=true} class="text-primary link">Register</button></p>
    <div class="flex w-full items-center px-5">
        <hr class="flex-1">
        <span class="px-4">or</span>
        <hr class="flex-1">
    </div>
    <button on:click={signInWithGoogle}  class="btn btn-primary  w-full gap-3 py-2 px-5">
        Sign In with Google 
        <img class="flex h-full grayscale" alt="google_Svg" src="/google-icon-logo.svg" >
    </button> 
{:else}
    <ProfileImage className=' w-28 ' />
    <h1>Hi, {$user.displayName??$userData?.username??$user.email}</h1>
    <p class="text-green-400">You are logged in as {$user.email}</p>
    <div class="flex gap-2 w-full">

        <button on:click={sigOutUser}  class="btn flex-1 gap-3 py-2 px-5">
            Sign Out
        </button>
        {#if !$userData?.username}
            <a href="/login/username" class="btn btn-primary">proceed</a>
        {/if}
        
    </div>
{/if}