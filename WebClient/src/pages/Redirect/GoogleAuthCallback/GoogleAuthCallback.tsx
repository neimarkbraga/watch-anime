import { Fragment, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Stack, Box, CircularProgress, Typography, Alert } from '@mui/material';
import { getErrorMessage } from '../../../libs/utils/getErrorMessage';
import { authQueries } from '../../../queries/authQueries';
import { useSessionStore } from '../../../stores/useSessionStore';

export const GoogleAuthCallback = () => {
	const [searchParams] = useSearchParams();

	const navigate = useNavigate();
	const setToken = useSessionStore((s) => s.setToken);

	const query = authQueries.loginWithGoogleAuthCode();
	const mutation = useMutation(query.fn, {
		onSuccess: (data) => {
			setToken(data.accessToken);
			navigate('/', { replace: true });
		},
		onError: () => {
			navigate('/', { replace: true });
		}
	});

	useEffect(() => {
		const authCode = searchParams.get('code') ?? '';
		if (authCode) mutation.mutate({ authCode });
		else navigate('/', { replace: true });
	}, []);

	return (
		<Stack flex={1} alignItems="center" justifyContent="center">
			<Box textAlign="center">
				{(() => {
					if (mutation.isLoading)
						return (
							<Fragment>
								<CircularProgress />
								<Typography>Logging in with Google</Typography>
							</Fragment>
						);

					if (mutation.error)
						return <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>;
				})()}
			</Box>
		</Stack>
	);
};
