import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

export const loginAdmin = (email, password) => {
  if (!auth?.app) throw new Error("Auth not initialized");
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = () => {
  if (!auth?.app) return;
  return signOut(auth);
};

export const subscribeToAuthChanges = (callback) => {
  if (!auth?.app) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
