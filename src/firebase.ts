import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, updateDoc, getDocs, getDoc, query, where, increment } from 'firebase/firestore';

// Tratamos de obtener la configuración del archivo local (AI Studio) o de las variables de entorno (Vercel)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const authorizedBootstrappers = ['cinside.info@gmail.com', 'holasolonet@gmail.com', 'caballerovazquezrafael@gmail.com', 'taquilla@cuevas.com', 'taquilla@cuevasdealajar.com', 'cuevasdealajar@gmail.com', 'admin@cuevasdealajar.com'];
    if (result.user.email && authorizedBootstrappers.includes(result.user.email)) {
      const adminRef = doc(db, 'admins', result.user.uid);
      const adminSnap = await getDoc(adminRef);
      if (!adminSnap.exists()) {
        await setDoc(adminRef, { email: result.user.email });
      }
    }
    return result.user;
  } catch (error) {
    console.error("Error logging in with email", error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    
    // Check if admin, if email is authorized, auto-add to admins
    const authorizedBootstrappers = ['cinside.info@gmail.com', 'holasolonet@gmail.com', 'caballerovazquezrafael@gmail.com', 'taquilla@cuevas.com', 'taquilla@cuevasdealajar.com', 'cuevasdealajar@gmail.com', 'admin@cuevasdealajar.com'];
    if (result.user.email && authorizedBootstrappers.includes(result.user.email)) {
      const adminRef = doc(db, 'admins', result.user.uid);
      const adminSnap = await getDoc(adminRef);
      if (!adminSnap.exists()) {
        await setDoc(adminRef, { email: result.user.email });
      }
    }
    
    return result.user;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};

export const logout = () => signOut(auth);
