import { db, storage } from "./firebase";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { mockData } from "./mockData";

// Collections names
const COLLECTIONS = {
  CONTENT: "content",
  PORTFOLIO: "portfolio",
  MESSAGES: "messages",
  SKILLS: "skills",
  EXPERIENCE: "experience"
};

// Helper to check if Firebase is configured
const isFirebaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
};

// GET ALL CONTENT
export const getCVContent = async () => {
  if (!isFirebaseConfigured()) {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('cv_content');
      if (local) return JSON.parse(local);
    }
    return mockData;
  }

  try {
    const contentRef = doc(db, COLLECTIONS.CONTENT, "main");
    const contentSnap = await getDoc(contentRef);
    
    if (!contentSnap.exists()) {
      return mockData;
    }
    
    return contentSnap.data();
  } catch (error) {
    console.error("Error fetching CV content:", error);
    return mockData;
  }
};

// UPDATE MAIN CONTENT
export const updateCVContent = async (data) => {
  if (!isFirebaseConfigured()) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cv_content', JSON.stringify(data));
      console.log("Demo Mode: Saved to localStorage", data);
    }
    return;
  }
  const contentRef = doc(db, COLLECTIONS.CONTENT, "main");
  await setDoc(contentRef, data, { merge: true });
};

// GET PORTFOLIO
export const getPortfolio = async () => {
  if (!isFirebaseConfigured()) {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('cv_portfolio');
      if (local) return JSON.parse(local);
    }
    return mockData.portfolio;
  }

  try {
    const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO);
    const q = query(portfolioRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return mockData.portfolio;
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return mockData.portfolio;
  }
};

// ADD PORTFOLIO ITEM
export const addPortfolioItem = async (item) => {
  if (!isFirebaseConfigured()) {
    if (typeof window !== 'undefined') {
      const current = await getPortfolio();
      const newItem = { ...item, id: Date.now().toString(), createdAt: new Date() };
      localStorage.setItem('cv_portfolio', JSON.stringify([newItem, ...current]));
      console.log("Demo Mode: Project saved to localStorage");
    }
    return;
  }
  const portfolioRef = collection(db, COLLECTIONS.PORTFOLIO);
  await addDoc(portfolioRef, {
    ...item,
    createdAt: serverTimestamp()
  });
};

// UPDATE PORTFOLIO ITEM
export const updatePortfolioItem = async (id, item) => {
  if (!isFirebaseConfigured()) {
    if (typeof window !== 'undefined') {
      const current = await getPortfolio();
      const updated = current.map(p => p.id === id ? { ...p, ...item } : p);
      localStorage.setItem('cv_portfolio', JSON.stringify(updated));
      console.log("Demo Mode: Project updated in localStorage");
    }
    return;
  }
  const itemRef = doc(db, COLLECTIONS.PORTFOLIO, id);
  await updateDoc(itemRef, item);
};

// DELETE PORTFOLIO ITEM
export const deletePortfolioItem = async (id) => {
  if (!isFirebaseConfigured()) {
    if (typeof window !== 'undefined') {
      const current = await getPortfolio();
      const updated = current.filter(p => p.id !== id);
      localStorage.setItem('cv_portfolio', JSON.stringify(updated));
      console.log("Demo Mode: Project deleted from localStorage");
    }
    return;
  }
  const itemRef = doc(db, COLLECTIONS.PORTFOLIO, id);
  await deleteDoc(itemRef);
};

// CONTACT FORM - SAVE MESSAGE
export const saveMessage = async (message) => {
  if (!isFirebaseConfigured()) {
    console.log("Mock: Saving message", message);
    return;
  }
  
  const messagesRef = collection(db, COLLECTIONS.MESSAGES);
  await addDoc(messagesRef, {
    ...message,
    createdAt: serverTimestamp()
  });
};

// GET MESSAGES (for Admin)
export const getMessages = async () => {
  const messagesRef = collection(db, COLLECTIONS.MESSAGES);
  const q = query(messagesRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const uploadImage = async (file, path) => {
  if (!storage || !storage.app) {
    console.warn("Storage not configured or running in mock mode.");
    return null;
  }
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
