import { Fragment, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useStore } from 'zustand';
import {
	Alert,
	Box,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Skeleton,
	Stack
} from '@mui/material';
import {
	Movie as AnimeIcon,
	AddCircle as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon
} from '@mui/icons-material';
import { watchStore } from './watchStore';
import { watchItemQueries } from '../../queries/watchItemQueries';
import { AddWatchItemDialog } from './AddWatchItemDialog';
import { EditWatchItemDialog } from './EditWatchItemDialog';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';

export const WatchList = () => {
	const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
	const [editItemId, setEditItemId] = useState<string>('');

	const items = useStore(watchStore, (s) => s.items);
	const getItems = useStore(watchStore, (s) => s.getItems);
	const setItems = useStore(watchStore, (s) => s.setItems);
	const activeItemId = useStore(watchStore, (s) => s.activeItemId);
	const setActiveItemId = useStore(watchStore, (s) => s.setActiveItemId);

	const { key: getItemsKey, fn: getItemsFn } = watchItemQueries.getWatchItems();
	const getItemsQuery = useQuery(getItemsKey, getItemsFn, {
		onSuccess: (data) => setItems(data)
	});

	const deleteItemMutation = useMutation(
		(id: string) => watchItemQueries.deleteWatchItem({ id }).fn(),
		{
			onSuccess: (data, id) => setItems(getItems().filter((v) => v.id !== id)),
			onError: (error) => alert(`Error Deleting: ${getErrorMessage(error)}`)
		}
	);

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
									onClick={() => setActiveItemId(item.id)}
									selected={item.id === activeItemId}
									disableRipple
								>
									<ListItemAvatar>
										<AnimeIcon />
									</ListItemAvatar>
									<ListItemText primary={item.title} secondary={item.description} />
									<Stack direction="row">
										<IconButton
											onClick={(e) => {
												e.stopPropagation();
												setEditItemId(item.id);
											}}
										>
											<EditIcon fontSize="small" />
										</IconButton>
										<IconButton
											onClick={(e) => {
												e.stopPropagation();
												const confirmed = window.confirm(`Do you want to delete ${item.title}?`);
												if (confirmed) deleteItemMutation.mutate(item.id);
											}}
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Stack>
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
			<AddWatchItemDialog open={isAddItemOpen} onClose={() => setIsAddItemOpen(false)} />
			<EditWatchItemDialog itemId={editItemId} onClose={() => setEditItemId('')} />
		</Fragment>
	);
};
