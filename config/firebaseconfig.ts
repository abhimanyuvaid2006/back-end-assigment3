import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// You'll need to replace this with your actual service account file name
import serviceAccount from "../backend-assignment4-ff171-firebase-adminsdk-fbsvc-2d75315942.json";

// initialize the Firebase app with our service account key
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

// get a reference to the firestore database
const db: Firestore = getFirestore();

export { db };
