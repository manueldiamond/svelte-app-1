import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/server/admin';

export const load = (async ({params,locals}) => {
    
    const usersRef = adminDB.collection('users')
    const q = usersRef.where('username',"==",params.username).limit(1)
    
    const snapshot = await q.get();
    const exists = snapshot.docs[0]?.exists
    const data = snapshot.docs[0]?.data();
    
    if(!exists) throw error(400,`User @${data.username} not found`)
    
    if(!data.published){
        const docID = snapshot.docs[0]?.id
        if(docID===locals.userID) 
            redirect(301,`/${params.username}/edit`)
        else   
            throw error(403,`@${data.username} is private`)
    }
    return ({
        username: data.username,
        photoURL: data.photoURL,
        links:data.links??[],
        bio:data.bio
    })
}) satisfies PageServerLoad;