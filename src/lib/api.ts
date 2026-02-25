import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Code, Rating, Profile, UserStats } from '../types';

// ==================== CODES API ====================

export const fetchCodes = async (params: {
  category?: string;
  search?: string;
  sortBy?: string;
  showExpired?: boolean;
}): Promise<Code[]> => {
  const codesRef = collection(db, 'codes');
  const qArgs: any[] = [];

  if (params.category && params.category !== 'ALL') {
    qArgs.push(where('category', '==', params.category));
  }

  // Note: Firebase requires composite indexes for orderBy + where on different fields.
  // To avoid immediate complex indexing for the initial migration, we will fetch and filter complex parts client-side if needed,
  // or just rely on simple queries.
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'recent': qArgs.push(orderBy('created_at', 'desc')); break;
      case 'popular': qArgs.push(orderBy('views', 'desc')); break;
      case 'top-rated': qArgs.push(orderBy('average_rating', 'desc')); break;
    }
  }

  const q = query(codesRef, ...qArgs);
  const snapshot = await getDocs(q);

  let results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Code));

  // Client-side filtering for text search and expiration
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    results = results.filter(code =>
      code.title.toLowerCase().includes(searchLower) ||
      code.description.toLowerCase().includes(searchLower) ||
      code.provider.toLowerCase().includes(searchLower)
    );
  }

  if (params.showExpired === false) {
    const now = new Date().toISOString();
    results = results.filter(code => !code.expiry_date || code.expiry_date >= now);
  }

  return results;
};

export const fetchCode = async (id: string): Promise<Code> => {
  const docRef = doc(db, 'codes', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error('Code not found');
  }
  return { id: docSnap.id, ...docSnap.data() } as Code;
};

export const createCode = async (codeData: Omit<Code, 'id' | 'views' | 'copies' | 'confirmations' | 'created_at'>): Promise<Code> => {
  const newCodeData = {
    ...codeData,
    views: 0,
    copies: 0,
    confirmations: 0,
    created_at: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, 'codes'), newCodeData);
  return { id: docRef.id, ...newCodeData } as Code;
};

export const incrementCodeViews = async (id: string): Promise<void> => {
  const docRef = doc(db, 'codes', id);
  await updateDoc(docRef, { views: increment(1) });
};

export const incrementCodeCopies = async (id: string): Promise<void> => {
  const docRef = doc(db, 'codes', id);
  await updateDoc(docRef, { copies: increment(1) });
};

export const incrementCodeConfirmations = async (id: string): Promise<void> => {
  const docRef = doc(db, 'codes', id);
  await updateDoc(docRef, { confirmations: increment(1) });
};

// ==================== RATINGS API ====================

export const fetchRatings = async (codeId: string): Promise<Rating[]> => {
  const q = query(collection(db, 'ratings'), where('code_id', '==', codeId), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Rating));
};

export const createRating = async (ratingData: Omit<Rating, 'id' | 'created_at'>): Promise<Rating> => {
  const newRating = {
    ...ratingData,
    created_at: new Date().toISOString()
  };
  const docRef = await addDoc(collection(db, 'ratings'), newRating);
  return { id: docRef.id, ...newRating } as Rating;
};

// ==================== PROFILES API ====================

export const fetchProfile = async (userId: string): Promise<Profile> => {
  const docRef = doc(db, 'profiles', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error('Profile not found');
  }
  return { id: docSnap.id, ...docSnap.data() } as Profile;
};

export const createOrUpdateProfile = async (profileData: Partial<Profile> & { id: string }): Promise<Profile> => {
  const docRef = doc(db, 'profiles', profileData.id);
  await setDoc(docRef, { ...profileData, updated_at: new Date().toISOString() }, { merge: true });
  const docSnap = await getDoc(docRef);
  return { id: docSnap.id, ...docSnap.data() } as Profile;
};

export const fetchUserStats = async (userId: string): Promise<UserStats> => {
  const docRef = doc(db, 'user_stats', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return { total_codes: 0, total_views: 0, total_copies: 0, total_confirmations: 0 };
  }
  return docSnap.data() as UserStats;
};
