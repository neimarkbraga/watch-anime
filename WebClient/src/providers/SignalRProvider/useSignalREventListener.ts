import { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import { SignalRContext, TSignalREventListenerMap } from './SignalRContext';

export const useSignalREventListener = <Name extends keyof TSignalREventListenerMap>(
	name: Name,
	handler: TSignalREventListenerMap[Name]
) => {
	const context = useContext(SignalRContext);
	if (!context) throw new Error('useSignalREventListener should be called inside Provider');

	const { addListener, removeListener } = context;

	const handlerRef = useRef(handler);
	handlerRef.current = handler;

	const internalHandler = useCallback<TSignalREventListenerMap[Name]>((payload: any) => {
		return handlerRef.current(payload);
	}, []);

	useLayoutEffect(() => {
		const id = addListener(name, internalHandler);
		return () => removeListener(id);
	}, [name]);
};
