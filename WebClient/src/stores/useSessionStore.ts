import { SetStateAction } from 'react';
import { create } from 'zustand';
import { IUserAccount } from '../models/UserAccount';
import { ISessionConfig } from '../models/SessionConfig';

export const SESSION_TOKEN_STORAGE_KEY = 'SESSION_TOKEN';

export interface ISessionStore {
	token: string;
	setToken: (token: string) => void;

	user: IUserAccount | null;
	setUser: (user: IUserAccount | null) => void;

	config: ISessionConfig;
	setConfig: (value: SetStateAction<ISessionConfig>) => void;
}

export const useSessionStore = create<ISessionStore>((setState, getState) => ({
	token: localStorage.getItem(SESSION_TOKEN_STORAGE_KEY) ?? '',
	setToken: (token) => {
		localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token);
		setState({ token });
	},

	user: null,
	setUser: (user) => {
		setState({ user });
	},

	config: {
		googleClientId: '',
		googleRecaptchaSiteKey: ''
	},
	setConfig: (value) => {
		const { config } = getState();
		setState({ config: typeof value === 'function' ? value(config) : value });
	}
}));
