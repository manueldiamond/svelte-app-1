<script lang="ts">
    import { getDisplayName } from '$lib';
    import{userData,user} from '$lib/firebase'
    export let className = ''
</script>

<div class={"avatar"}>
    <div class={"ring rounded-full "+className}>
        <img  src={$userData?.photoURL?$userData.photoURL:'/profile.png'} alt={`${getDisplayName()}'s profile photo'`}>
    </div>
</div>