import { Fragment, PropsWithChildren, useCallback, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { DialogContext, IDialogContext } from './DialogContext';
import { useDialogStore } from './useDialogStore';
import { AlertDialog } from './Dialogs/AlertDialog';
import { ConfirmDialog } from './Dialogs/ConfirmDialog';
import { PromptDialog } from './Dialogs/PromptDialog';

const DialogItems = () => {
	const entries = useDialogStore((s) => Array.from(s.dialogs.entries()));
	return (
		<Fragment>
			{entries.map(([id, dialog]) => {
				if (dialog.alert) return <AlertDialog key={id} context={dialog.alert} />;
				if (dialog.confirm) return <ConfirmDialog key={id} context={dialog.confirm} />;
				if (dialog.prompt) return <PromptDialog key={id} context={dialog.prompt} />;
				return <Fragment key={id} />;
			})}
		</Fragment>
	);
};

export const DialogProvider = (props: PropsWithChildren) => {
	const { children } = props;

	const openDialog = useDialogStore((s) => s.openDialog);
	const closeDialog = useDialogStore((s) => s.closeDialog);
	const removeDialog = useDialogStore((s) => s.removeDialog);

	const disposeDialog = useCallback(
		(id: string) => {
			closeDialog(id);
			setTimeout(() => removeDialog(id), 500);
		},
		[closeDialog, removeDialog]
	);

	const alert = useCallback<IDialogContext['alert']>(
		(message, options = {}) =>
			new Promise((resolve) => {
				const id = uuid();
				openDialog('alert', {
					id,
					open: true,
					title: 'Alert',
					message,
					okLabel: 'Ok',
					dialogProps: {},
					...options,

					callback: () => {
						resolve();
						disposeDialog(id);
					}
				});
			}),
		[openDialog, disposeDialog]
	);

	const confirm = useCallback<IDialogContext['confirm']>(
		(message, options = {}) =>
			new Promise((resolve) => {
				const id = uuid();
				openDialog('confirm', {
					id,
					open: true,
					title: 'Confirm',
					message,
					confirmLabel: 'Confirm',
					cancelLabel: 'Cancel',
					dialogProps: {},
					...options,

					callback: (...params) => {
						resolve(...params);
						disposeDialog(id);
					}
				});
			}),
		[openDialog, disposeDialog]
	);

	const prompt = useCallback<IDialogContext['prompt']>(
		(message, options = {}) =>
			new Promise((resolve) => {
				const id = uuid();
				openDialog('prompt', {
					id,
					open: true,
					title: 'Prompt',
					message,
					submitLabel: 'Submit',
					cancelLabel: 'Cancel',
					placeholder: '',
					dialogProps: {},
					textFieldProps: {},
					...options,

					callback: (...params) => {
						resolve(...params);
						disposeDialog(id);
					}
				});
			}),
		[openDialog, disposeDialog]
	);

	return (
		<DialogContext.Provider value={{ alert, confirm, prompt }}>
			{children}
			<DialogItems />
		</DialogContext.Provider>
	);
};

export const useDialog = () => {
	const state = useContext(DialogContext);
	if (!state) throw new Error('useDialog must be inside DialogProvider');
	return state;
};
