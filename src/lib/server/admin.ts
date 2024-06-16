import {
    FB_PROJECT_ID as projectId,
    FB_PRIVATE_KEY as privateKey,
    FB_CLIENT_EMAIL as clientEmail
} from '$env/static/private'

import pkg from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

try {
    pkg.initializeApp({
        credential:pkg.credential.cert({
            privateKey,
            clientEmail,
            projectId
        })
    })
} catch (err:any) {
    if(!/already exists/u.test(err.message))
        console.error("Firebase Admin Error: ", err.stack)
}

export const adminDB = getFirestore()
export const adminAuth = getAuth()