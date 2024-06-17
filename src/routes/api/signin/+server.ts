import { adminAuth } from '$lib/server/admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({request,cookies}) => {
    const {idToken} = await request.json();
    const expires = 1000*60*60*24*7
    const decodedIdToken=await adminAuth.verifyIdToken(idToken)
    
    if(new Date().getTime()/1000-decodedIdToken.auth_time<5*60){
        
    }
    return new Response();
};
export const DELETE: RequestHandler = async ({cookies}) => {
    return new Response();
};