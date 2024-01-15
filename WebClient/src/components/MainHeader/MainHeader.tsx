import { Fragment, useState } from 'react';
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Menu,
	MenuItem,
	Stack,
	Toolbar,
	Typography,
	useMediaQuery,
	useTheme
} from '@mui/material';
import { useSessionStore } from '../../stores/useSessionStore';
import { useSession } from '../../providers/SessionProvider/useSession';
import { useDialog } from '../../providers/DialogProvider';

export const MainHeader = () => {
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

	const { logout } = useSession();
	const { confirm } = useDialog();
	const { breakpoints } = useTheme();
	const isBigScreen = useMediaQuery(breakpoints.up('sm'));

	const user = useSessionStore((s) => s.user);

	return (
		<Fragment>
			<AppBar position="sticky">
				<Toolbar>
					<Stack direction="row" width="100%" alignItems="center" spacing={2}>
						<Stack direction="row" alignItems="center" spacing={0.5}>
							<img src="/images/watch-anime-logo.png" alt="Watch Anime" height={35} />
							{isBigScreen && <Typography variant="h6">Watch Anime</Typography>}
						</Stack>
						<Box flex={1} />
						{!!user && (
							<Button
								sx={{ textTransform: 'inherit' }}
								variant="text"
								color="inherit"
								onClick={(e) => setMenuAnchor(e.currentTarget)}
							>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Avatar src={user.pictureUrl} sx={{ width: 35, height: 35 }} />
									{isBigScreen && (
										<Typography>
											{user.firstName} {user.lastName}
										</Typography>
									)}
								</Stack>
							</Button>
						)}
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
