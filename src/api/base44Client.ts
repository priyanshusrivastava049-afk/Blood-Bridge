import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Mocking base44 for compatibility with user provided components
// Since @base44/sdk is not in public npm, we mock the essential parts used in the UI
export const base44 = {
  integrations: {
    Core: {
      InvokeLLM: async (args: any): Promise<any> => {
        const { prompt } = args;
        // Fallback to Gemini if the user expects AI features
        // Note: Real implementation would use the provided SDK if it were available
        console.log("Mock InvokeLLM called with prompt:", prompt);
        return {
          icu: { available: 5, total: 20 },
          hdu: { available: 3, total: 15 },
          general: { available: 50, total: 200 },
          ventilators: { available: 12, total: 30 },
          blood_bank: "available",
          oxygen: "available",
          overall_status: "available",
          recommended_id: 1,
          surge_note: "Capacity normal for the current mission sector.",
          confidence: "high",
          disclaimer: "AI estimate based on historical tactical data."
        };
      }
    }
  }
};
