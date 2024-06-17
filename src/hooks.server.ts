import { adminAuth } from "$lib/server/admin";
import type { Handle } from "@sveltejs/kit";

export const handle=(async ({event,resolve}) => {
    const cookie = event.cookies.get('__session',)
    console.log("cookie,",cookie)
    try{
        const decodedCook = adminAuth.verifySessionCookie(cookie!)
        event.locals.userID = (await decodedCook).uid;
    }catch(e){
        event.locals.userID = null
    }
    return resolve(event)
}) satisfies Handle