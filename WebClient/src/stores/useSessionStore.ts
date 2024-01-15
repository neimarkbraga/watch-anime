import { create } from 'zustand';
import { IUserAccount } from '../models/UserAccount';

export const SESSION_TOKEN_STORAGE_KEY = 'SESSION_TOKEN';

export interface ISessionStore {
	token: string;
	setToken: (token: string) => void;

	user: IUserAccount | null;
	setUser: (user: IUserAccount | null) => void;
}

export const useSessionStore = create<ISessionStore>((setState) => ({
	token: localStorage.getItem(SESSION_TOKEN_STORAGE_KEY) ?? '',
	setToken: (token) => {
		localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
		setState({ token });
	},

	user: null,
	setUser: (user) => {
		setState({ user });
	}
}));
