import React, { useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

export function useFirestoreSync<T extends { id: string }>(
  collectionName: string,
  initialData: T[],
  setState: React.Dispatch<React.SetStateAction<T[]>>
) {
  useEffect(() => {
    const colRef = collection(db, collectionName);

    // Initial check to seed if collection is completely empty
    const checkAndSeed = async () => {
      try {
        const snapshot = await getDocs(colRef);
        if (snapshot.empty && initialData.length > 0) {
          // Seed initial data to Firestore
          for (const item of initialData) {
            await setDoc(doc(colRef, item.id), item);
          }
        }
      } catch (err) {
        console.warn(`Firestore seed error for ${collectionName}:`, err);
      }
    };

    checkAndSeed();

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: T[] = snapshot.docs.map((docSnap) => ({
            ...(docSnap.data() as T),
            id: docSnap.id
          }));
          setState(items);
        } else {
          setState([]);
        }
      },
      (error) => {
        console.warn(`Firestore snapshot error for ${collectionName}:`, error);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);
}

// Helper function to clear all documents in a Firestore collection
export async function clearCollectionInFirestore(collectionName: string) {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const promises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, collectionName, docSnap.id)));
    await Promise.all(promises);
  } catch (err) {
    console.error(`Error clearing Firestore collection (${collectionName}):`, err);
  }
}

// Helper function to remove undefined properties from objects before saving to Firestore
function cleanUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanUndefined) as unknown as T;
  const cleaned: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      cleaned[key] = cleanUndefined(val);
    }
  }
  return cleaned as T;
}

// Helper function to persist changes to Firestore
export async function saveToFirestore<T extends { id: string }>(
  collectionName: string,
  item: T
) {
  try {
    const cleanedItem = cleanUndefined(item);
    await setDoc(doc(db, collectionName, item.id), cleanedItem as any, { merge: true });
  } catch (err) {
    console.error(`Error saving to Firestore (${collectionName}):`, err);
  }
}

// Helper function to delete item from Firestore
export async function deleteFromFirestore(
  collectionName: string,
  itemId: string
) {
  try {
    await deleteDoc(doc(db, collectionName, itemId));
  } catch (err) {
    console.error(`Error deleting from Firestore (${collectionName}):`, err);
  }
}
