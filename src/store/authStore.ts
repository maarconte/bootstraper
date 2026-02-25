import { create } from 'zustand';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthState {
	user: User | null;
	isReady: boolean;
	initListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isReady: false,
	initListener: () => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			set({ user: currentUser, isReady: true });
		});
		return unsubscribe;
	}
}));
