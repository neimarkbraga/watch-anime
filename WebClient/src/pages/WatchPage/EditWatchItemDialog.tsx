import { useLayoutEffect, useState } from 'react';
import { useMutation } from 'react-query';
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
import { IWatchItem } from '../../models/WatchItem';
import { watchItemQueries } from '../../queries/watchItemQueries';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { useWatchStore } from './useWatchStore';

export interface IEditWatchItemDialogProps {
	itemId: string;
	onClose: () => void;
	onUpdated: (watchItem: IWatchItem) => void;
}

export const EditWatchItemDialog = (props: IEditWatchItemDialogProps) => {
	const { itemId, onClose, onUpdated } = props;

	const [code, setCode] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	const item = useWatchStore((s) => s.items.find((i) => i.id === itemId) ?? null);

	const { key: updateItemKey, fn: updateItemFn } = watchItemQueries.updateWatchItem({ id: itemId });
	const updateItemMutation = useMutation(updateItemKey, updateItemFn, {
		onSuccess: (result, args) => {
			if (item) onUpdated({ ...item, ...args.data });
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
