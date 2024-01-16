import { Fragment, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ReCaptcha from 'react-google-recaptcha';
import { useMutation, useQuery } from 'react-query';
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { TextDivider } from '../../components/TextDivider/TextDivider';
import { authQueries } from '../../queries/authQueries';
import { useSessionStore } from '../../stores/useSessionStore';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';

export const LoginPage = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [captcha, setCaptcha] = useState<string>('');

	const recaptchaRef = useRef<ReCaptcha>(null);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');

	const navigate = useNavigate();

	const isLoggedIn = useSessionStore((s) => !!s.user);
	const setToken = useSessionStore((s) => s.setToken);
	const captchaSiteKey = useSessionStore((s) => s.config.googleRecaptchaSiteKey);

	const { key: getGoogleAuthURIKey, fn: getGoogleAuthURIFn } = authQueries.getGoogleAuthURI();
	const getGoogleAuthURIQuery = useQuery(getGoogleAuthURIKey, getGoogleAuthURIFn);

	const { fn: loginWithEmailFn } = authQueries.loginWithEmailAndPassword();
	const loginWithEmailMutation = useMutation(loginWithEmailFn, {
		onMutate: () => {
			setIsLoading(true);
			setErrorMessage('');
		},
		onSuccess: (data) => setToken(data.accessToken),
		onSettled: () => {
			setIsLoading(false);
			setCaptcha('');
			recaptchaRef.current?.reset();
		},
		onError: (error) => setErrorMessage(getErrorMessage(error))
	});

	if (isLoggedIn) return <Navigate to="/" replace={true} />;

	return (
		<Box display="flex" flex={1} alignItems="center" justifyContent="center" overflow="hidden">
			<Box width="100%" maxWidth="400px" p={3}>
				<Stack spacing={2}>
					<Box textAlign="center">
						<img
							src="/images/watch-anime-logo.png"
							alt="watch-anime-logo.png"
							style={{ width: 75 }}
						/>
					</Box>

					{!!getGoogleAuthURIQuery.data && (
						<Fragment>
							<Button
								component="a"
								variant="outlined"
								href={getGoogleAuthURIQuery.data}
								startIcon={<GoogleIcon />}
							>
								Sign In With Google
							</Button>
							<TextDivider>
								<Typography>or Sign in with</Typography>
							</TextDivider>
						</Fragment>
					)}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							loginWithEmailMutation.mutate({ email, password, captcha });
						}}
					>
						<fieldset disabled={isLoading}>
							<Stack spacing={2}>
								<TextField
									type="email"
									label="Email"
									size="small"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>

								<TextField
									type="password"
									label="Password"
									size="small"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>

								{!!errorMessage && (
									<Alert severity="error" onClose={() => setErrorMessage('')}>
										{errorMessage}
									</Alert>
								)}

								<Stack direction="row" justifyContent="center">
									<ReCaptcha
										ref={recaptchaRef}
										sitekey={captchaSiteKey || '1234'}
										onChange={(token) => setCaptcha(token ?? '')}
									/>
								</Stack>

								<Button
									type="submit"
									variant="contained"
									size="large"
									disabled={isLoading}
									startIcon={isLoading && <CircularProgress size="1em" color="inherit" />}
								>
									Login
								</Button>

								<Button onClick={() => navigate('/sign-up')}>Create an Account</Button>
							</Stack>
						</fieldset>
					</form>
				</Stack>
			</Box>
		</Box>
	);
};
