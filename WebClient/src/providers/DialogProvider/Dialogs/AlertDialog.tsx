import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@mui/material';
import { IAlertDialogContext } from '../Dialog.types';

export const AlertDialog = (props: { context: IAlertDialogContext }) => {
	const { context } = props;
	return (
		<Dialog
			fullWidth={true}
			maxWidth="xs"
			{...context.dialogProps}
			open={context.open}
			onClose={() => context.callback()}
		>
			{!!context.title && <DialogTitle>{context.title}</DialogTitle>}
			<DialogContent>
				<DialogContentText>{context.message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => context.callback()}>{context.okLabel}</Button>
			</DialogActions>
		</Dialog>
	);
};
