import { create } from 'zustand';
import {
	onAuthStateChanged,
	User,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut as firebaseSignOut,
	updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
	user: User | null;
	isReady: boolean;
	initListener: () => () => void;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, username: string) => Promise<void>;
	signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isReady: false,
	initListener: () => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			set({ user: currentUser, isReady: true });
		});
		return unsubscribe;
	},
	signIn: async (email, password) => {
		await signInWithEmailAndPassword(auth, email, password);
	},
	signUp: async (email, password, username) => {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		if (userCredential.user) {
			await updateProfile(userCredential.user, { displayName: username });
		}
	},
	signOut: async () => {
		await firebaseSignOut(auth);
	}
}));
