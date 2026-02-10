import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { type ScoutEntry } from "../types";

const SCOUTS_COLLECTION = "scouts";

/**
 * Adds a new scout entry to Firestore
 */
export const addScoutEntry = async (entry: Omit<ScoutEntry, "id">) => {
  const docRef = await addDoc(collection(db, SCOUTS_COLLECTION), {
    ...entry,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

/**
 * Fetches all scout entries from Firestore
 */
export const getAllScoutEntries = async () => {
  try {
    const q = query(
      collection(db, SCOUTS_COLLECTION),
      // orderBy("createdAt", "desc"), // Temporarily removed for debugging
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as ScoutEntry[];
  } catch (error) {
    console.error("Error in getAllScoutEntries:", error);
    throw error;
  }
};

/**
 * Fetches scout entries for a specific scout/user
 */
export const getScoutEntriesByUser = async (scoutName: string) => {
  const q = query(
    collection(db, SCOUTS_COLLECTION),
    where("scoutName", "==", scoutName),
    orderBy("createdAt", "desc"),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as unknown as ScoutEntry[];
};

/**
 * Updates an existing scout entry
 */
export const updateScoutEntry = async (
  id: string,
  entry: Partial<ScoutEntry>,
) => {
  const docRef = doc(db, SCOUTS_COLLECTION, id);
  await updateDoc(docRef, entry);
};

/**
 * Deletes a scout entry
 */
export const deleteScoutEntry = async (id: string) => {
  const docRef = doc(db, SCOUTS_COLLECTION, id);
  await deleteDoc(docRef);
};
