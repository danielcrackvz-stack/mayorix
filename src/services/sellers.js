import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function verifySellerLocation(uid, { lat, lng }, storePhotoUrl) {
  await updateDoc(doc(db, "users", uid), {
    location: { lat, lng },
    storePhotoUrl,
    hasVerifiedLocation: true,
  });
}

export async function getSellerProfile(uid) {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? docSnap.data() : null;
}