import admin from "firebase-admin";
// import serviceAccount from "./serviceAccountKey.json";

const serviceAccount = {
  type: "service_account",
  project_id: "professor-game",
  private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(
    /\\n/g,
    "\n"
  ),
  client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fdrni%40professor-game.iam.gserviceaccount.com",
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

const db = admin.firestore();

export default db;

export const getIds = async () => {
  const querySnapshot = await db.collection("boards").select().get();
  return querySnapshot.docs.map((doc) => doc.id);
};

export const getBoard = async (id) => {
  const snapshot = await db.collection("boards").doc(id).get();
  return snapshot.data();
};

export const getLikes = async () => {
  const querySnapshot = await db.collection("likes").get();
  return querySnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data();
    return acc;
  }, {});
};
