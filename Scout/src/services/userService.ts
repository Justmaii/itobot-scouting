import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { type UserProfile } from "../types/index";

const usersRef = "users";

export const createUserProfile = async (profile: UserProfile) => {
  await setDoc(doc(db, usersRef, profile.uid), profile);
};

export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, usersRef, uid));

  if (!snap.exists()) return null;

  return snap.data() as UserProfile;
};
