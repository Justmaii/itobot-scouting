import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { type UserProfile } from "../types/index";

const USERS_COLLECTION = "users";

export const createUserProfile = async (profile: UserProfile) => {
  await setDoc(doc(db, USERS_COLLECTION, profile.uid), profile);
};

export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));

  if (!snap.exists()) return null;

  return snap.data() as UserProfile | null;
};
