import { useLayoutEffect, useState } from 'react';
import { useMutation } from 'react-query';
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Grid,
	Stack,
	TextField,
	Typography
} from '@mui/material';
import { userAccountQueries } from '../../queries/userAccountQueries';
import { useSessionStore } from '../../stores/useSessionStore';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { useDialog } from '../../providers/DialogProvider';

export const AccountSettingsPage = () => {
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [pictureUrl, setPictureUrl] = useState<string>('');

	const [oldPassword, setOldPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

	const user = useSessionStore((s) => s.user);
	const setUser = useSessionStore((s) => s.setUser);

	const { alert } = useDialog();

	const { fn: updateAccountFn } = userAccountQueries.updateAccount();
	const updateAccountMutation = useMutation(updateAccountFn, {
		onSuccess: (updatedUser) => setUser({ ...user, ...updatedUser })
	});

	const { fn: changePasswordFn } = userAccountQueries.changePassword();
	const changePasswordMutation = useMutation(changePasswordFn, {
		onSuccess: () => {
			setOldPassword('');
			setNewPassword('');
			alert('Password changed');
		}
	});

	useLayoutEffect(() => {
		setFirstName(user?.firstName ?? '');
		setLastName(user?.lastName ?? '');
		setPictureUrl(user?.pictureUrl ?? '');
	}, [user]);

	return (
		<Container>
			<Box py={2}>
				<Typography variant="h5">Account Settings</Typography>

				<Grid container spacing={3} py={4}>
					<Grid item xs={12} md={6}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								updateAccountMutation.mutate({ firstName, lastName, pictureUrl });
							}}
						>
							<fieldset>
								<Stack spacing={2.5}>
									<Box>
										<TextField
											label="First Name"
											size="small"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											fullWidth
											required
										/>
									</Box>
									<Box>
										<TextField
											label="Last Name"
											size="small"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											fullWidth
											required
										/>
									</Box>
									<Box>
										<TextField
											label="Picture Url"
											size="small"
											value={pictureUrl}
											onChange={(e) => setPictureUrl(e.target.value)}
											fullWidth
										/>
									</Box>
									{!!updateAccountMutation.error && (
										<Box>
											<Alert severity="error" onClose={() => updateAccountMutation.reset()}>
												{getErrorMessage(updateAccountMutation.error)}
											</Alert>
										</Box>
									)}
									<Box textAlign="right">
										<Button
											type="submit"
											variant="contained"
											disabled={updateAccountMutation.isLoading}
											startIcon={
												updateAccountMutation.isLoading && (
													<CircularProgress size="1em" color="inherit" />
												)
											}
										>
											Update Account
										</Button>
									</Box>
								</Stack>
							</fieldset>
						</form>
					</Grid>

					<Grid item xs={12} md={6}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								changePasswordMutation.mutate({ oldPassword, newPassword });
							}}
						>
							<fieldset>
								<Stack spacing={2.5}>
									<Box>
										<TextField
											type="password"
											label="Old Password"
											size="small"
											value={oldPassword}
											onChange={(e) => setOldPassword(e.target.value)}
											fullWidth
										/>
									</Box>
									<Box>
										<TextField
											type="password"
											label="New Passord"
											size="small"
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											fullWidth
											required
										/>
									</Box>
									{!!newPassword && (
										<Box>
											<TextField
												type="password"
												label="Confirm New Passord"
												size="small"
												value={confirmNewPassword}
												onChange={(e) => setConfirmNewPassword(e.target.value)}
												fullWidth
												required
											/>
										</Box>
									)}
									{!!changePasswordMutation.error && (
										<Box>
											<Alert severity="error" onClose={() => changePasswordMutation.reset()}>
												{getErrorMessage(changePasswordMutation.error)}
											</Alert>
										</Box>
									)}
									<Box textAlign="right">
										<Button
											type="submit"
											variant="contained"
											disabled={
												changePasswordMutation.isLoading ||
												!newPassword ||
												newPassword !== confirmNewPassword
											}
											startIcon={
												changePasswordMutation.isLoading && (
													<CircularProgress size="1em" color="inherit" />
												)
											}
										>
											Change Password
										</Button>
									</Box>
								</Stack>
							</fieldset>
						</form>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};
