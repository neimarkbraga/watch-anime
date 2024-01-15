import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@mui/material';
import { IConfirmDialogContext } from '../Dialog.types';

export const ConfirmDialog = (props: { context: IConfirmDialogContext }) => {
	const { context } = props;
	return (
		<Dialog fullWidth={true} maxWidth="xs" {...context.dialogProps} open={context.open}>
			{!!context.title && <DialogTitle>{context.title}</DialogTitle>}
			<DialogContent>
				<DialogContentText>{context.message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => context.callback(false)}>{context.cancelLabel}</Button>
				<Button variant="contained" onClick={() => context.callback(true)}>
					{context.confirmLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
