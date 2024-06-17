import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import type { PageLoad } from './$types';
import { DB, type UserData } from '$lib/firebase';
import { error } from '@sveltejs/kit';

export const load = (async ({params}) => {
    const collectionRef = collection(DB,'users')
    const q = query(
        collectionRef,
        where('username',"==",params.username),
        limit(1),    
    );
    const snapshot = await getDocs(q);
    const exists = snapshot.docs[0]?.exists
    const data = snapshot.docs[0]?.data() as UserData;
    
    if(!exists) throw error(400,"User not found")
    if(!data.published) throw error(403,`@${data.username} is private`)

    return ({
        username: data.username,
        photoURL: data.photoURL,
        links:data.links??[],
        bio:data.bio
    } as UserData)
}) satisfies PageLoad;