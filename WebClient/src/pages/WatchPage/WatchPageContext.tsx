import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface IWatchPageContext {
	watchId: string;
	setWatchId: Dispatch<SetStateAction<string>>;
}

export const WatchPageContext = createContext<IWatchPageContext | null>(null);

export const useWatchPageContext = () => {
	const context = useContext(WatchPageContext);
	if (!context) throw new Error('useWatchPageContext should be called under provider');
	return context;
};
