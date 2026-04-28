import { useState, useEffect, createContext, useContext } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../api/firebase';
import { BloodRequest } from '../types';
import { subscribeBloodRequests } from '../services/firebaseService';

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'donor' | 'hospital_admin' | 'super_admin';
  hospitalId?: string;
}

interface FirebaseContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isSigningIn: boolean;
  bloodRequests: BloodRequest[];
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          const newUser: AppUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            role: 'donor',
          };
          await setDoc(userRef, newUser);
          setAppUser(newUser);
        } else {
          setAppUser(userDoc.data() as AppUser);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    const unsubRequests = subscribeBloodRequests(setBloodRequests);

    return () => {
      unsubAuth();
      unsubRequests();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (isSigningIn) return;
    
    const provider = new GoogleAuthProvider();
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        alert('Authentication popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log("Popup request was cancelled.");
      } else {
        console.error("Error signing in with Google:", error);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <FirebaseContext.Provider value={{ user, appUser, loading, isSigningIn, bloodRequests, signInWithGoogle, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
