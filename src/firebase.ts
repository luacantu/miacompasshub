import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp, getDocFromServer, initializeFirestore, DocumentReference, WithFieldValue, CollectionReference } from 'firebase/firestore';

// Import the Firebase configuration
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, 'ai-studio-1466c577-ef71-4482-87fc-485ccce9fbd3');
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create/Update user profile in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'user',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        if (err instanceof Error && err.message.includes('resource-exhausted')) {
          console.warn("Firestore write quota exceeded. User profile not created in cloud.");
        } else {
          throw err;
        }
      }
    }
    
    return user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const logout = () => auth.signOut();

// Firestore Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

// Quota error listener
type QuotaErrorListener = () => void;
const quotaErrorListeners: QuotaErrorListener[] = [];

export const onQuotaExceeded = (listener: QuotaErrorListener) => {
  quotaErrorListeners.push(listener);
  return () => {
    const index = quotaErrorListeners.indexOf(listener);
    if (index > -1) quotaErrorListeners.splice(index, 1);
  };
};

const notifyQuotaExceeded = () => {
  quotaErrorListeners.forEach(l => l());
};

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  if (error instanceof Error && (error.message.includes('resource-exhausted') || error.message.includes('Quota limit exceeded'))) {
    console.warn(`Firestore quota exceeded during ${operationType} on ${path}. Falling back to local state.`);
    notifyQuotaExceeded();
    return; // Silently fail for quota errors to prevent crashing
  }
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const safeSetDoc = async (ref: DocumentReference, data: WithFieldValue<any>, options?: any) => {
  try {
    await setDoc(ref, data, options);
  } catch (err) {
    if (err instanceof Error && (err.message.includes('resource-exhausted') || err.message.includes('Quota limit exceeded'))) {
      console.warn("Firestore write quota exceeded. Changes saved locally only.");
      notifyQuotaExceeded();
    } else {
      handleFirestoreError(err, OperationType.WRITE, ref.path);
    }
  }
};

export const safeAddDoc = async (ref: CollectionReference, data: WithFieldValue<any>) => {
  try {
    return await addDoc(ref, data);
  } catch (err) {
    if (err instanceof Error && (err.message.includes('resource-exhausted') || err.message.includes('Quota limit exceeded'))) {
      console.warn("Firestore write quota exceeded. Document not added to cloud.");
      notifyQuotaExceeded();
      return null;
    } else {
      handleFirestoreError(err, OperationType.WRITE, ref.path);
      return null;
    }
  }
};

// Connection Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();
