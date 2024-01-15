import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Stack, Box, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';
import { WatchList } from './WatchList';
import { WatchAppBar } from './WatchAppBar';
import { WatchView } from './WatchView';
import { WatchPageContext } from './WatchPageContext';

const drawerWidth = 350;

export const WatchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [watchId, _setWatchId] = useState<string>(searchParams.get('id') ?? '');
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

	const { breakpoints } = useTheme();
	const isBigScreen = useMediaQuery(breakpoints.up('md'));

	const setWatchId = useCallback<Dispatch<SetStateAction<string>>>(
		(value) => {
			const newWatchId = typeof value === 'function' ? value(watchId) : value;
			_setWatchId(newWatchId);
			searchParams.set('id', newWatchId);
			setSearchParams(searchParams, { replace: true });
		},
		[watchId, searchParams]
	);

	return (
		<WatchPageContext.Provider
			value={{
				watchId,
				setWatchId
			}}
		>
			<Stack flex={1}>
				<WatchAppBar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
				<Stack flex={1} direction="row">
					{isBigScreen && (
						<Box
							sx={({ palette }) => ({
								width: '90vw',
								maxWidth: `${drawerWidth}px`,
								borderRight: `1px solid ${palette.divider}`
							})}
						>
							<WatchList />
						</Box>
					)}
					<Box flex={1} overflow="hidden">
						<WatchView />
					</Box>
				</Stack>
			</Stack>
			{!isBigScreen && (
				<SwipeableDrawer
					open={isDrawerOpen}
					onOpen={() => setIsDrawerOpen(true)}
					onClose={() => setIsDrawerOpen(false)}
					PaperProps={{ sx: { width: '90vw', maxWidth: `${drawerWidth}px` } }}
				>
					<WatchList />
				</SwipeableDrawer>
			)}
		</WatchPageContext.Provider>
	);
};
