import { adminAuth } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

export const handle=(async ({event,resolve}) => {
    const cookie = event.cookies.get('__session',)
    try{
        const decodedCook = adminAuth.verifySessionCookie(cookie!)
        event.locals.userID = (await decodedCook).uid;
        // event.locals.username = 
    }catch(e){
        event.locals.userID = null
    }
    return resolve(event)
}) satisfies Handle