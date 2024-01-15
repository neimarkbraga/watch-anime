import { useLayoutEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useStore } from 'zustand';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { watchItemQueries } from '../../queries/watchItemQueries';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { watchStore } from './watchStore';

export interface IEditWatchItemDialogProps {
	itemId: string;
	onClose: () => void;
}

export const EditWatchItemDialog = (props: IEditWatchItemDialogProps) => {
	const { itemId, onClose } = props;

	const [code, setCode] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	const item = useStore(watchStore, (s) => s.items.find((i) => i.id === itemId) ?? null);
	const getItems = useStore(watchStore, (s) => s.getItems);
	const setItems = useStore(watchStore, (s) => s.setItems);

	const id = item?.id ?? '';
	const { key: updateItemKey, fn: updateItemFn } = watchItemQueries.updateWatchItem({ id });
	const updateItemMutation = useMutation(updateItemKey, updateItemFn, {
		onSuccess: () => {
			setItems(
				getItems().map((v) => {
					return v.id === id ? { ...v, code, title, description } : v;
				})
			);
			onClose();
		},
		onError: (error) => {
			alert(`Error Updating: ${getErrorMessage(error)}`);
		}
	});

	useLayoutEffect(() => {
		setCode(item?.code ?? '');
		setTitle(item?.title ?? '');
		setDescription(item?.description ?? '');
	}, [item]);

	return (
		<Dialog open={!!item} fullWidth maxWidth="sm" onClose={onClose}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					updateItemMutation.mutate({ data: { code, title, description, lastSeenEpisode: 1 } });
				}}
			>
				<DialogTitle>Edit {item?.title ?? 'Watch Item'}</DialogTitle>
				<DialogContent>
					<Stack pt={1} spacing={2}>
						<TextField
							required
							label="Anime Code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							fullWidth
						/>
						<TextField
							required
							label="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							fullWidth
						/>
						<TextField
							label="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							multiline
							minRows={3}
							fullWidth
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={onClose}>
						Cancel
					</Button>
					<LoadingButton loading={updateItemMutation.isLoading} type="submit" variant="contained">
						Update Watch Item
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
};
