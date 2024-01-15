import { Fragment, PropsWithChildren, useLayoutEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useStore } from 'zustand';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { authQueries } from '../../queries/authQueries';
import { sessionStore } from '../../stores/useSessionStore';

export const SessionLoader = (props: PropsWithChildren) => {
	const { children } = props;
	const [initialized, setInitialized] = useState<boolean>(false);

	const token = useStore(sessionStore, (s) => s.token);
	const setUser = useStore(sessionStore, (s) => s.setUser);

	const { key: getSessionKey, fn: getSessionFn } = authQueries.getSession();
	const getSessionMutation = useMutation(getSessionKey, getSessionFn, {
		onSuccess: (data) => setUser(data),
		onError: () => setUser(null),
		onSettled: () => setInitialized(true)
	});

	useLayoutEffect(() => {
		if (token) getSessionMutation.mutate();
		else {
			setUser(null);
			setInitialized(true);
		}
	}, [token]);

	if (!initialized && getSessionMutation.isLoading)
		return (
			<Stack flex={1} alignItems="center" justifyContent="center">
				<Box p={2} textAlign="center">
					<CircularProgress />
					<Typography>Loading Session</Typography>
				</Box>
			</Stack>
		);

	return <Fragment>{children}</Fragment>;
};
