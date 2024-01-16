import { useRef, useState } from 'react';
import ReCaptcha from 'react-google-recaptcha';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useSessionStore } from '../../stores/useSessionStore';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { userAccountQueries } from '../../queries/userAccountQueries';
import { useDialog } from '../../providers/DialogProvider';

export const SignUpPage = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [pictureUrl] = useState<string>('');
	const [captcha, setCaptcha] = useState<string>('');

	const recaptchaRef = useRef<ReCaptcha>(null);
	const navigate = useNavigate();
	const { alert } = useDialog();

	const captchaSiteKey = useSessionStore((s) => s.config.googleRecaptchaSiteKey);

	const { fn: createAccountFn } = userAccountQueries.createAccount();
	const createAccountMutation = useMutation(createAccountFn, {
		onSuccess: async () => {
			await alert('Account created successfully. You will be redirected to login page.');
			navigate('/login');
		},
		onSettled: () => {
			recaptchaRef.current?.reset();
		}
	});

	const passwordMismatch = !!password && password !== confirmPassword;

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

					<form
						onSubmit={(e) => {
							e.preventDefault();
							createAccountMutation.mutate({
								email,
								password,
								firstName,
								lastName,
								pictureUrl,
								captcha
							});
						}}
					>
						<fieldset disabled={createAccountMutation.isLoading}>
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

								{!!password && (
									<TextField
										type="password"
										label="Confirm Password"
										size="small"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										error={passwordMismatch}
										helperText={passwordMismatch ? "Password don't match" : ''}
										required
									/>
								)}

								<TextField
									label="First Name"
									size="small"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
								/>

								<TextField
									label="Last Name"
									size="small"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									required
								/>

								{!!createAccountMutation.error && (
									<Alert severity="error" onClose={() => createAccountMutation.reset()}>
										{getErrorMessage(createAccountMutation.error)}
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
									disabled={createAccountMutation.isLoading || passwordMismatch}
									startIcon={
										createAccountMutation.isLoading && (
											<CircularProgress size="1em" color="inherit" />
										)
									}
								>
									Sign Up
								</Button>

								<Button onClick={() => navigate('/login')}>Go to Login</Button>
							</Stack>
						</fieldset>
					</form>
				</Stack>
			</Box>
		</Box>
	);
};
