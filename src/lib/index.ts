// place files you want to import through the `$lib` alias in this folder.
import SortableList from "./components/SortableList.svelte"
import UserLink from "./components/UserLink.svelte"
import AuthCheck from "./components/AuthCheck.svelte"
import AddLink from "./components/AddLink.svelte"
import ProfileImage from "./components/ProfileImage.svelte"
import { user, userData } from "./firebase"
import { get } from "svelte/store"

const name="LinkFlow"

export{
    SortableList,UserLink,AuthCheck,AddLink,ProfileImage,
    name,
}

export const getDisplayName=()=>{
    const $user = get(user)
    const $userData = get(userData)
    const email = $user?.email
    const emailname = email?.slice(0,email.indexOf("@"))
    return $user?.displayName??$userData?.username??emailname
}