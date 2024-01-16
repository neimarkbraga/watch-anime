import { Fragment, useLayoutEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
	Alert,
	Box,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Skeleton
} from '@mui/material';
import { Movie as AnimeIcon, AddCircle as AddIcon } from '@mui/icons-material';
import { useWatchStore } from './useWatchStore';
import { watchItemQueries } from '../../queries/watchItemQueries';
import { AddWatchItemDialog } from './AddWatchItemDialog';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { useWatchPageContext } from './WatchPageContext';

export const WatchList = () => {
	const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);

	const { watchId, setWatchId } = useWatchPageContext();

	const items = useWatchStore((s) => s.items);
	const getItems = useWatchStore((s) => s.getItems);
	const setItems = useWatchStore((s) => s.setItems);

	const { key: getItemsKey, fn: getItemsFn } = watchItemQueries.getWatchItems();
	const getItemsQuery = useQuery(getItemsKey, getItemsFn, {
		cacheTime: Infinity,
		staleTime: Infinity,
		onSuccess: (data) => setItems(data)
	});

	useLayoutEffect(() => {
		if (items.length && !watchId) setWatchId(items[0].id);
	}, [items.length, watchId]);

	return (
		<Fragment>
			<List disablePadding>
				{(() => {
					if (getItemsQuery.isLoading)
						return [...new Array(5)].map((n, i) => (
							<ListItem key={i}>
								<ListItemAvatar>
									<Skeleton variant="rounded" width={24} height={24} />
								</ListItemAvatar>
								<ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
							</ListItem>
						));

					if (getItemsQuery.error)
						return (
							<Box p={2}>
								<Alert severity="error">{getErrorMessage(getItemsQuery.error)}</Alert>
							</Box>
						);

					return (
						<Fragment>
							{items.map((item) => (
								<ListItemButton
									key={item.id}
									onClick={() => setWatchId(item.id)}
									sx={({ palette }) => ({
										'&:after': {
											content: '""',
											display: 'block',
											position: 'absolute',
											backgroundColor: item.id === watchId ? palette.primary.main : 'none',
											width: '2.5px',
											bottom: 0,
											right: 0,
											top: 0
										}
									})}
									disableRipple
								>
									<ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
										<AnimeIcon />
									</ListItemAvatar>
									<ListItemText primary={item.title} secondary={item.description} />
								</ListItemButton>
							))}
							<ListItemButton onClick={() => setIsAddItemOpen(true)}>
								<ListItemAvatar sx={{ minWidth: 0, mr: 2 }}>
									<AddIcon />
								</ListItemAvatar>
								<ListItemText primary="Add Anime" secondary="Add new anime to watch list" />
							</ListItemButton>
						</Fragment>
					);
				})()}
			</List>
			<AddWatchItemDialog
				open={isAddItemOpen}
				onClose={() => setIsAddItemOpen(false)}
				onCreated={(createdWatchItem) => {
					setIsAddItemOpen(false);
					setItems([...getItems(), createdWatchItem]);
				}}
			/>
		</Fragment>
	);
};
