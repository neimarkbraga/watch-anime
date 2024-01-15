import { Fragment, useState } from 'react';
import { useQuery } from 'react-query';
import { useStore } from 'zustand';
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
import { watchStore } from './watchStore';
import { watchItemQueries } from '../../queries/watchItemQueries';
import { AddWatchItemDialog } from './AddWatchItemDialog';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { useWatchPageContext } from './WatchPageContext';

export const WatchList = () => {
	const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);

	const { watchId, setWatchId } = useWatchPageContext();

	const items = useStore(watchStore, (s) => s.items);
	const getItems = useStore(watchStore, (s) => s.getItems);
	const setItems = useStore(watchStore, (s) => s.setItems);

	const { key: getItemsKey, fn: getItemsFn } = watchItemQueries.getWatchItems();
	const getItemsQuery = useQuery(getItemsKey, getItemsFn, {
		onSuccess: (data) => setItems(data)
	});

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
									selected={item.id === watchId}
									disableRipple
								>
									<ListItemAvatar>
										<AnimeIcon />
									</ListItemAvatar>
									<ListItemText primary={item.title} secondary={item.description} />
								</ListItemButton>
							))}

							<ListItemButton onClick={() => setIsAddItemOpen(true)}>
								<ListItemAvatar>
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
