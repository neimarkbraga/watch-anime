import { Fragment, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useStore } from 'zustand';
import {
	IconButton,
	List,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
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
	useQuery(getItemsKey, getItemsFn, {
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
			</List>
			<AddWatchItemDialog open={isAddItemOpen} onClose={() => setIsAddItemOpen(false)} />
			<EditWatchItemDialog itemId={editItemId} onClose={() => setEditItemId('')} />
		</Fragment>
	);
};
