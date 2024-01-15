import { createContext } from 'react';

export interface ISessionContext {
	logout: () => void;
	reload: () => void;
}

export const SessionContext = createContext<ISessionContext | null>(null);
