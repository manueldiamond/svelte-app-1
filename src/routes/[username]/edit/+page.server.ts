import { adminAuth, adminDB } from '$lib/server/admin';
import { error, redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { UserData } from '$lib/types';

export const load = (async ({locals,params}) => {
    const uid = locals.userID;
    if(!uid)
      redirect(301,'/login')

    try{
        const userDoc = await adminDB.collection('users').doc(uid).get();
        const userData = userDoc.data() as UserData;
        if(userData.username!==params.username)
            throw error(401)
        return {
            bio:userData?.bio as string,
            username:params.username
        };
    }catch(e){
        throw error(401, 'Access Denied!')
    }
}) satisfies PageServerLoad; 


export const actions={
    default: async function({locals,request,params}) {
        const uid=locals.userID
        const data = await request.formData();
        const bio = data.get('bio') as string
        const userDoc = await adminDB.collection('users').doc(uid!)
        const {username} = (await userDoc.get()).data()!
        
        //validate
        if(params.username!==username){
            throw error(401,'Access DENIED!!')
        }
        if(bio.length>260){
            return fail(400,{message:'Bio must be less than 260 chars'});
        }
        try{
            await userDoc.update({bio})
            return {
                success:true,
                message:'Bio updated successfully'
            }
        }catch{
            return fail(400,{ message:'unknown error'})
        }
    }
} satisfies Actions