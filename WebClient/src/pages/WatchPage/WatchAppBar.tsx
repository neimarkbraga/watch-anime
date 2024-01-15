import { Fragment, useState } from 'react';
import { useStore } from 'zustand';
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
import { Menu as MenuIcon } from '@mui/icons-material';
import { sessionStore } from '../../stores/useSessionStore';

export interface IWatchAppBarProps {
	isDrawerOpen: boolean;
	setIsDrawerOpen: (value: boolean) => void;
}

export const WatchAppBar = (props: IWatchAppBarProps) => {
	const { isDrawerOpen, setIsDrawerOpen } = props;

	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

	const { breakpoints } = useTheme();
	const isBigScreen = useMediaQuery(breakpoints.up('md'));

	const user = useStore(sessionStore, (s) => s.user);
	const setToken = useStore(sessionStore, (s) => s.setToken);

	return (
		<Fragment>
			<AppBar position="static">
				<Toolbar>
					<Stack direction="row" width="100%" alignItems="center" spacing={2}>
						{!isBigScreen && (
							<Box>
								<IconButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
									<MenuIcon />
								</IconButton>
							</Box>
						)}
						<Box>
							<Typography>Watch Anime</Typography>
						</Box>
						<Box flex={1}></Box>
						{!!user && (
							<Box>
								{(() => {
									if (isBigScreen)
										return (
											<Button
												variant="text"
												startIcon={<Avatar src={user.pictureUrl} />}
												onClick={(e) => setMenuAnchor(e.currentTarget)}
											>
												{user.firstName} {user.lastName}
											</Button>
										);

									return (
										<IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
											<Avatar src={user.pictureUrl} />
										</IconButton>
									);
								})()}
							</Box>
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
					onClick={() => {
						const confirmed = window.confirm('Are you sure to logout?');
						if (confirmed) setToken('');
						setMenuAnchor(null);
					}}
				>
					Logout
				</MenuItem>
			</Menu>
		</Fragment>
	);
};
