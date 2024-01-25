import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { v4 as uuidV4 } from 'uuid';
import { getApiUrlOrigin } from '../../libs/utils/getApiUrlOrigin';
import { useSessionStore } from '../../stores/useSessionStore';
import { SignalRContext, TSignalREventListenerMap } from './SignalRContext';

export const SignalRProvider = (props: PropsWithChildren) => {
	const { children } = props;

	const listenersRef = useRef<Record<string, Partial<TSignalREventListenerMap>>>({});

	const [, setIsConnected] = useState<boolean>(false);

	const accessToken = useSessionStore((s) => s.token);

	const connection = useMemo(() => {
		return new HubConnectionBuilder()
			.withUrl(`${getApiUrlOrigin()}/update-feed-hub`, {
				transport: HttpTransportType.LongPolling,
				accessTokenFactory: () => useSessionStore.getState().token
			})
			.build();
	}, [accessToken]);

	const addListener = useCallback(function <Name extends keyof TSignalREventListenerMap>(
		name: Name,
		handler: TSignalREventListenerMap[Name]
	) {
		const id = uuidV4();
		listenersRef.current[id] = { [name]: handler };
		return id;
	}, []);

	const removeListener = useCallback((id: string) => {
		delete listenersRef.current[id];
	}, []);

	useEffect(() => {
		connection
			.start()
			.then(() => setIsConnected(true))
			.catch(() => setIsConnected(false));

		const eventNames: (keyof TSignalREventListenerMap)[] = ['WatchItemUpdate', 'WatchItemDeleted'];

		for (const eventName of eventNames) {
			connection.on(eventName, (payload) => {
				for (const listeners of Object.values(listenersRef.current)) {
					const listener = listeners[eventName];
					if (listener) listener(payload);
				}
			});
		}

		return () => {
			connection.stop().catch();
		};
	}, []);

	return (
		<SignalRContext.Provider value={{ connection, addListener, removeListener }}>
			{children}
		</SignalRContext.Provider>
	);
};
