import { Dispatch, SetStateAction, useCallback, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import {
	Stack,
	Box,
	SwipeableDrawer,
	useMediaQuery,
	useTheme,
	Container,
	Divider,
	Typography,
	Toolbar
} from '@mui/material';
import { WatchList } from './WatchList';
import { WatchView } from './WatchView';
import { WatchPageContext } from './WatchPageContext';
import { useAppStore } from '../../stores/useAppStore';
import { watchItemQueries } from '../../queries/watchItemQueries';

const drawerWidth = 300;

export const WatchPage = () => {
	const { breakpoints } = useTheme();
	const isBigScreen = useMediaQuery(breakpoints.up('md'));

	const { watchId = '' } = useParams<{ watchId: string }>();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const isDrawerOpen = useAppStore((s) => s.isDrawerOpen);
	const setIsDrawerOpen = useAppStore((s) => s.setIsDrawerOpen);
	const setIsDrawerEnabled = useAppStore((s) => s.setIsDrawerEnabled);

	const setWatchId = useCallback<Dispatch<SetStateAction<string>>>(
		(value) => {
			const newWatchId = typeof value === 'function' ? value(watchId) : value;
			navigate(`/watch/${newWatchId}`, { replace: true });
		},
		[watchId]
	);

	useLayoutEffect(() => {
		if (!isBigScreen) {
			setIsDrawerEnabled(true);
			return () => setIsDrawerEnabled(false);
		}
	}, [isBigScreen, setIsDrawerEnabled]);

	useLayoutEffect(() => {
		queryClient.removeQueries({
			queryKey: watchItemQueries.getWatchItems().key
		});
	}, []);

	return (
		<WatchPageContext.Provider value={{ watchId, setWatchId }}>
			<Container
				sx={{ display: 'flex', flex: 1, overflow: 'hidden', p: 0 }}
				maxWidth={isBigScreen ? undefined : false}
			>
				<Stack flex={1} direction="row" overflow="hidden">
					{isBigScreen && (
						<Box sx={{ width: '90vw', maxWidth: `${drawerWidth}px` }}>
							<Stack spacing={2} py={2}>
								<Typography variant="h6">Watch List</Typography>
								<WatchList />
							</Stack>
						</Box>
					)}
					<Divider orientation="vertical" flexItem />
					<Box flex={1} overflow="hidden">
						<WatchView />
					</Box>
					<Divider orientation="vertical" flexItem />
				</Stack>
			</Container>

			{!isBigScreen && (
				<SwipeableDrawer
					open={isDrawerOpen}
					onOpen={() => setIsDrawerOpen(true)}
					onClose={() => setIsDrawerOpen(false)}
					sx={({ zIndex }) => ({ zIndex: zIndex.appBar - 1 })}
					PaperProps={{
						sx: { width: '90vw', maxWidth: `${drawerWidth}px`, backgroundImage: 'none' }
					}}
				>
					<Toolbar />
					<WatchList />
				</SwipeableDrawer>
			)}
		</WatchPageContext.Provider>
	);
};
