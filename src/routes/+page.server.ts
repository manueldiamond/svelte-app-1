import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/server/admin';

export const load = (async ({locals}) => {
    if (locals.userID){
        console.log("hahaha haaa haaaaarrrh")
        const usernameRef = await adminDB.doc(`users/${locals.userID}`).get()
        const username = usernameRef.data()?.username
        console.log("username",locals.userID,username)
        if(username)
            redirect(307,`/${username}`)
    }
    
    
}) satisfies PageServerLoad;