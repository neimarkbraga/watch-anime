import { Navigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Box, Button, Stack, Typography } from '@mui/material';
import { authQueries } from '../../queries/authQueries';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { useSessionStore } from '../../stores/useSessionStore';

export const LoginPage = () => {
	const isLoggedIn = useSessionStore((s) => !!s.user);

	const { key: getGoogleAuthURIKey, fn: getGoogleAuthURIFn } = authQueries.getGoogleAuthURI();
	const getGoogleAuthURIQuery = useQuery(getGoogleAuthURIKey, getGoogleAuthURIFn);

	if (isLoggedIn) return <Navigate to="/" replace={true} />;

	return (
		<Box>
			{(() => {
				if (getGoogleAuthURIQuery.isLoading) return 'Loading';
				if (getGoogleAuthURIQuery.error) return getErrorMessage(getGoogleAuthURIQuery.error);
				return (
					<Box display="flex" height="100vh" alignItems="center" justifyContent="center">
						<Stack textAlign="center" spacing={1}>
							<Typography variant="h4">Watch Anime</Typography>
							<Button sx={{ p: 0 }} component="a" href={getGoogleAuthURIQuery.data}>
								<img
									src="/sign-in-with-google.png"
									alt="sign-in-with-google.png"
									style={{ width: '90vw', maxWidth: '200px' }}
								/>
							</Button>
						</Stack>
					</Box>
				);
			})()}
		</Box>
	);
};
