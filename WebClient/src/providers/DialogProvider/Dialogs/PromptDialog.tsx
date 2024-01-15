import { useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
	TextField
} from '@mui/material';
import { IPromptDialogContext } from '../Dialog.types';

export const PromptDialog = (props: { context: IPromptDialogContext }) => {
	const { context } = props;
	const [value, setValue] = useState<string>('');

	return (
		<Dialog fullWidth={true} maxWidth="xs" {...context.dialogProps} open={context.open}>
			{!!context.title && <DialogTitle>{context.title}</DialogTitle>}
			<DialogContent>
				<Stack direction="column" spacing={1}>
					<DialogContentText>{context.message}</DialogContentText>
					<TextField
						size="medium"
						fullWidth
						{...context.textFieldProps}
						placeholder={context.placeholder}
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => context.callback(undefined)}>{context.cancelLabel}</Button>
				<Button variant="contained" onClick={() => context.callback(value)}>
					{context.submitLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
