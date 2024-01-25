import { createContext } from 'react';
import { HubConnection } from '@microsoft/signalr';
import { IWatchItem } from '../../models/WatchItem';

export type TSignalREventMap = {
	WatchItemUpdate: IWatchItem;
	WatchItemDeleted: string;
};

export type TSignalREventListenerMap = {
	[Name in keyof TSignalREventMap]: (payload: TSignalREventMap[Name]) => void;
};

export interface ISignalRContext {
	connection: HubConnection;
	addListener: <Name extends keyof TSignalREventListenerMap>(
		name: Name,
		handler: TSignalREventListenerMap[Name]
	) => string;
	removeListener: (id: string) => void;
}

export const SignalRContext = createContext<ISignalRContext | null>(null);
