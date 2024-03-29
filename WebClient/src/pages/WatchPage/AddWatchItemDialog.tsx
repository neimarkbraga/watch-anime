import { useState } from 'react';
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

export interface IAddWatchItemDialogProps {
	open: boolean;
	onClose: () => void;
	onCreated: (watchItem: IWatchItem) => void;
}

export const AddWatchItemDialog = (props: IAddWatchItemDialogProps) => {
	const { open, onClose, onCreated } = props;

	const [code, setCode] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	const { key: createItemKey, fn: createItemFn } = watchItemQueries.createWatchItem();
	const createItemMutation = useMutation(createItemKey, createItemFn, {
		onSuccess: (data) => {
			onCreated(data);
			setCode('');
			setTitle('');
			setDescription('');
		},
		onError: (error) => alert(`Error Creating: ${getErrorMessage(error)}`)
	});

	return (
		<Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					createItemMutation.mutate({ data: { code, title, description, lastSeenEpisode: 1 } });
				}}
			>
				<DialogTitle>Add Watch Item</DialogTitle>
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
					<LoadingButton loading={createItemMutation.isLoading} type="submit" variant="contained">
						Add Watch Item
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
};
