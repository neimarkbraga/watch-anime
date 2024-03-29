import { Fragment, useState } from 'react';
import { useMutation } from 'react-query';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MenuIcon } from '@mui/icons-material';
import { IWatchItem } from '../../models/WatchItem';
import { EditWatchItemDialog } from './EditWatchItemDialog';
import { useWatchStore } from './useWatchStore';
import { watchItemQueries } from '../../queries/watchItemQueries';
import { getErrorMessage } from '../../libs/utils/getErrorMessage';
import { useDialog } from '../../providers/DialogProvider';

export interface IWatchItemMenuProps {
	watchItem: IWatchItem;
}

export const WatchItemMenu = (props: IWatchItemMenuProps) => {
	const { watchItem } = props;
	const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
	const [isEditActive, setIsEditActive] = useState<boolean>(false);

	const { confirm } = useDialog();
	const getItems = useWatchStore((s) => s.getItems);
	const setItems = useWatchStore((s) => s.setItems);

	const { key: deleteKey, fn: deleteFn } = watchItemQueries.deleteWatchItem({ id: watchItem.id });
	const deleteItemMutation = useMutation(deleteKey, deleteFn, {
		onSuccess: () => setItems(getItems().filter((v) => v.id !== watchItem.id)),
		onError: (error) => alert(`Error Deleting: ${getErrorMessage(error)}`)
	});

	return (
		<Fragment>
			<IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
				<MenuIcon />
			</IconButton>

			<Menu
				open={!!menuAnchor}
				anchorEl={menuAnchor}
				onClose={() => setMenuAnchor(null)}
				MenuListProps={{ sx: { minWidth: '175px' } }}
			>
				<MenuItem
					onClick={() => {
						setMenuAnchor(null);
						setIsEditActive(true);
					}}
				>
					Edit
				</MenuItem>

				<MenuItem
					sx={({ palette }) => ({ color: palette.error.main })}
					disabled={deleteItemMutation.isLoading}
					onClick={async () => {
						setMenuAnchor(null);
						const confirmed = await confirm(`Do you want to delete ${watchItem.title}?`, {
							confirmLabel: 'Delete'
						});
						if (confirmed) deleteItemMutation.mutate();
					}}
				>
					{deleteItemMutation.isLoading ? 'Deleting' : 'Delete'}
				</MenuItem>
			</Menu>

			<EditWatchItemDialog
				itemId={isEditActive && watchItem ? watchItem.id : ''}
				onClose={() => setIsEditActive(false)}
				onUpdated={(updatedWatchItem) => {
					setIsEditActive(false);
					setItems(
						getItems().map((item) => (item.id === updatedWatchItem.id ? updatedWatchItem : item))
					);
				}}
			/>
		</Fragment>
	);
};
