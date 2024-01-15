import { PropsWithChildren, useCallback, useLayoutEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { sessionQueries } from '../../queries/sessionQueries';
import { useSessionStore } from '../../stores/useSessionStore';
import { SessionContext } from './SessionContext';

export const SessionProvider = (props: PropsWithChildren) => {
	const { children } = props;

	const initializedRef = useRef(false);

	const token = useSessionStore((s) => s.token);
	const setToken = useSessionStore((s) => s.setToken);
	const setUser = useSessionStore((s) => s.setUser);
	const setConfig = useSessionStore((s) => s.setConfig);

	const { key: getSessionKey, fn: getSessionFn } = sessionQueries.getSession();
	const getSessionQuery = useQuery(getSessionKey, getSessionFn, {
		cacheTime: 0,
		staleTime: Infinity,
		onSuccess: ({ user, config }) => {
			setUser(user);
			setConfig(config);
		},
		onError: () => setUser(null)
	});

	const logout = useCallback(() => {
		setToken('');
		setUser(null);
	}, []);

	const reload = useCallback(() => {
		getSessionQuery.refetch().catch();
	}, []);

	useLayoutEffect(() => {
		if (initializedRef.current) getSessionQuery.refetch().catch();
		else initializedRef.current = true;
	}, [token]);

	if (getSessionQuery.isLoading)
		return (
			<Stack flex={1} alignItems="center" justifyContent="center">
				<Box p={2} textAlign="center">
					<CircularProgress />
					<Typography>Loading Session</Typography>
				</Box>
			</Stack>
		);

	return <SessionContext.Provider value={{ reload, logout }}>{children}</SessionContext.Provider>;
};
