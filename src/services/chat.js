import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Genera un ID determinístico para que la misma conversación no se duplique
function buildChatId(buyerId, sellerId, productId) {
  return `${productId}_${buyerId}_${sellerId}`;
}

export async function getOrCreateChat(buyerId, sellerId, productId, productTitle) {
  const chatId = buildChatId(buyerId, sellerId, productId);
  const chatRef = doc(db, "chats", chatId);

  await setDoc(
    chatRef,
    {
      buyerId,
      sellerId,
      productId,
      productTitle,
      updatedAt: serverTimestamp(),
    },
    { merge: true } // no sobreescribe si ya existía
  );

  return chatId;
}

export function listenToMessages(chatId, callback) {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(messages);
  });
}

export async function sendMessage(chatId, senderId, text) {
  const messagesRef = collection(db, "chats", chatId, "messages");

  await addDoc(messagesRef, {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });

  // Actualiza el resumen de la conversación (útil para la bandeja de mensajes)
  await setDoc(
    doc(db, "chats", chatId),
    { lastMessage: text, lastMessageAt: serverTimestamp() },
    { merge: true }
  );
}

export function listenToUserChats(userId, callback) {
  const chatsRef = collection(db, "chats");
  // Necesitamos dos listeners porque el usuario puede ser comprador o vendedor
  const qBuyer = query(chatsRef, where("buyerId", "==", userId));
  const qSeller = query(chatsRef, where("sellerId", "==", userId));

  let buyerChats = [];
  let sellerChats = [];

  function merge() {
    const all = [...buyerChats, ...sellerChats];
    all.sort((a, b) => (b.lastMessageAt?.seconds || 0) - (a.lastMessageAt?.seconds || 0));
    callback(all);
  }

  const unsub1 = onSnapshot(qBuyer, (snap) => {
    buyerChats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    merge();
  });

  const unsub2 = onSnapshot(qSeller, (snap) => {
    sellerChats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    merge();
  });

  return () => {
    unsub1();
    unsub2();
  };
}