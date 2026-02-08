import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const registerAuth = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginAuth = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAuth = () => {
  return signOut(auth);
};
