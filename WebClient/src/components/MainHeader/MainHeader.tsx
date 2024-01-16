import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	AppBar,
	Avatar,
	Box,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Stack,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import { MenuOpen as DrawerIcon } from '@mui/icons-material';
import { useSessionStore } from '../../stores/useSessionStore';
import { useAppStore } from '../../stores/useAppStore';
import { useSession } from '../../providers/SessionProvider/useSession';
import { useDialog } from '../../providers/DialogProvider';

export const MainHeader = () => {
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

	const { logout } = useSession();
	const { confirm } = useDialog();
	const { breakpoints } = useTheme();
	const isBigScreen = useMediaQuery(breakpoints.up('sm'));

	const navigate = useNavigate();

	const isDrawerOpen = useAppStore((s) => s.isDrawerOpen);
	const setIsDrawerOpen = useAppStore((s) => s.setIsDrawerOpen);
	const isDrawerEnabled = useAppStore((s) => s.isDrawerEnabled);
	const user = useSessionStore((s) => s.user);

	return (
		<Fragment>
			<AppBar position="sticky">
				<Toolbar>
					<Stack direction="row" width="100%" alignItems="center" spacing={2}>
						{isDrawerEnabled && (
							<IconButton onClick={() => setIsDrawerOpen((v) => !v)}>
								<DrawerIcon
									sx={{
										transform: isDrawerOpen ? '' : 'rotate(180deg)',
										transition: 'transform 100ms ease-in-out'
									}}
								/>
							</IconButton>
						)}
						{!isBigScreen && <Box flex={1} />}
						<Stack direction="row" alignItems="center" spacing={0.5}>
							<img
								src="/images/watch-anime-logo.png"
								alt="Watch Anime"
								height={35}
								style={{ cursor: 'pointer' }}
								onClick={() => navigate('/')}
							/>
							{isBigScreen && <Typography variant="h6">Watch Anime</Typography>}
						</Stack>
						<Box flex={1} />
						{!!user &&
							(() => {
								if (isBigScreen)
									return (
										<Button
											sx={{ textTransform: 'inherit' }}
											variant="text"
											color="inherit"
											onClick={(e) => setMenuAnchor(e.currentTarget)}
											startIcon={<Avatar src={user.pictureUrl} sx={{ width: 35, height: 35 }} />}
										>
											{user.firstName} {user.lastName}
										</Button>
									);
								return (
									<IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
										<Avatar src={user.pictureUrl} sx={{ width: 24, height: 24 }} />
									</IconButton>
								);
							})()}
					</Stack>
				</Toolbar>
			</AppBar>

			<Menu
				open={!!menuAnchor}
				anchorEl={menuAnchor}
				MenuListProps={{ sx: { minWidth: '200px' } }}
				onClose={() => setMenuAnchor(null)}
			>
				<MenuItem
					onClick={() => {
						setMenuAnchor(null);
						navigate('/account-settings');
					}}
				>
					Account Settings
				</MenuItem>

				<MenuItem
					onClick={async () => {
						const confirmed = await confirm('Are you sure to logout?', { confirmLabel: 'Logout' });
						if (confirmed) logout();
						setMenuAnchor(null);
					}}
				>
					Logout
				</MenuItem>
			</Menu>
		</Fragment>
	);
};
