import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../api/firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';
import { BloodRequest, Donor, Alert } from '../types';
import { Hospital } from '../lib/constants';

// Test connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// --- Hospitals ---
export const subscribeHospitals = (callback: (hospitals: Hospital[]) => void) => {
  const q = query(collection(db, 'hospitals'));
  return onSnapshot(q, (snapshot) => {
    const hospitals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hospital));
    callback(hospitals);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'hospitals');
  });
};

// --- Blood Requests ---
export const createBloodRequest = async (request: Omit<BloodRequest, 'id'>) => {
  const path = 'bloodRequests';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...request,
      userId: auth.currentUser?.uid,
      time: serverTimestamp(),
      status: 'waiting'
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const subscribeBloodRequests = (callback: (requests: BloodRequest[]) => void) => {
  const path = 'bloodRequests';
  const q = query(collection(db, path), orderBy('time', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        ...data, 
        id: doc.id,
        time: data.time?.toDate?.()?.toISOString() || new Date().toISOString()
      } as BloodRequest;
    });
    callback(requests);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

// --- Donors ---
export const subscribeDonors = (callback: (donors: Donor[]) => void) => {
  const path = 'donors';
  const q = query(collection(db, path));
  return onSnapshot(q, (snapshot) => {
    const donors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donor));
    callback(donors);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

// --- Alerts ---
export const subscribeAlerts = (callback: (alerts: Alert[]) => void) => {
  const path = 'alerts';
  const q = query(collection(db, path), orderBy('time', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        ...data, 
        id: doc.id,
        time: data.time?.toDate?.()?.toISOString() || 'Just now'
      } as Alert;
    });
    callback(alerts);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};
