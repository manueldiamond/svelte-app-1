<script lang="ts">
    import AuthCheck from "$lib/components/AuthCheck.svelte";
    import { DB, user, userData} from "$lib/firebase";
    import type { UserData } from "$lib/types";
    
    import { deleteDoc, doc, getDoc, writeBatch } from "firebase/firestore";
    
    let username=""
    let editing=false
    let loading=false;
    let isAvailable = false;
    let debounceTimer:NodeJS.Timeout;

    const usernameRegEx=/^[a-zA-Z0-9_]{3,19}$/

    $:isValid = usernameRegEx.test(username)

    async function confirmUsername() {
        const batch = writeBatch(DB);
        if($userData?.username)
            batch.delete(doc(DB,'usernames',$userData.username))
        batch.set(doc(DB,'usernames',username),{uid:$user?.uid});
        batch.set(doc(DB,'users',$user!.uid),{
            username,
            photoURL:$userData?.photoURL??$user?.photoURL,
            published:true,
            bio:'',
            links:[
                {
                    title:"So Cool",
                    url:'https://www.youtube.com/watch?v=t_FQ26XU930',
                    icon:'youtube'
                }
            ]
        }satisfies UserData);

        await batch.commit()
        editing=false
    }
    async function checkAvailability() {
        isAvailable=false;
        clearTimeout(debounceTimer)
        loading=true;
        debounceTimer = setTimeout(async ()=>{
            const ref = doc(DB,'usernames',username)
            const exists = await getDoc(ref).then(doc=>doc.exists())

            isAvailable=!exists
            loading=false
        },500)
    }
    
</script>
<AuthCheck>
    {#if $userData && !editing}
        <p>
            Your username is <span class="text-success font-extrabold">@{$userData.username}</span> 
             <button on:click={()=>{editing=true}} class="italic link">(edit)</button>
        </p>
        <a href="photo" class="btn btn-primary">Upload Profile Image</a>
    {:else}
        <h2>Setup Username</h2>
        <form on:submit|preventDefault={confirmUsername} class="form-control gap-4">
            <input 
                type="text"
                bind:value={username}
                on:input={checkAvailability}
                placeholder="John Doe"
                class="input"
                class:input-error={username&&!isValid}
                class:input-warning={username&&!isAvailable}
                class:input-success={isAvailable&&isValid&&!loading}
            />    
            {#if username && !loading}
                {#if isValid}
                    <p class={`${isAvailable?"text-success":"text-warning"}`}>
                        @{username} is {isAvailable?"available":"not available"}
                    </p>
                {:else}
                    <p class="text-error">username is invalid</p>
                {/if}
            {/if}
            <button class="btn btn-success" disabled={!isAvailable&&isValid}>Conrim Username</button>

        </form>
    {/if}
</AuthCheck>