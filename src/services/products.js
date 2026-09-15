import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const productsRef = collection(db, "products");

export async function createProduct(data) {
  return addDoc(productsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getAllProducts() {
  const q = query(productsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductById(id) {
  const docSnap = await getDoc(doc(db, "products", id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function getProductsBySeller(sellerId) {
  const q = query(productsRef, where("sellerId", "==", sellerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}