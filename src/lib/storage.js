import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFile = async (file, folder = "general") => {
  if (!file) return null;
  
  const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  return downloadURL;
};

export const uploadProfilePic = (file) => uploadFile(file, "profile");
export const uploadPortfolioImage = (file) => uploadFile(file, "portfolio");
export const uploadCVFile = (file) => uploadFile(file, "cv");
