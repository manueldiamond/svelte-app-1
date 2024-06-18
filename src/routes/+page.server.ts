import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminAuth, adminDB } from '$lib/server/admin';

export const load = (async ({locals}) => {
    if (locals.userID){
        console.log("hahaha haaa haaaaarrrh")
        const usernameRef = (await adminDB.doc(`usernames/${locals.userID}`).get())
        const username = usernameRef.data()
        console.log("username",username)
        redirect(307,`/${username}`)
    }
    
    
}) satisfies PageServerLoad;