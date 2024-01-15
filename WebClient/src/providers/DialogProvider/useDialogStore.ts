import { create } from 'zustand';
import produce from 'immer';
import { IDialogTypes } from './Dialog.types';

export interface IDialogStore {
	dialogs: Map<string, Partial<IDialogTypes>>;
	openDialog<ItemType extends keyof IDialogTypes>(
		type: ItemType,
		context: IDialogTypes[ItemType]
	): void;
	closeDialog(id: string): void;
	removeDialog(id: string): void;
}

export const useDialogStore = create<IDialogStore>((setState, getState) => ({
	dialogs: new Map(),
	openDialog: (type, context) => {
		const { dialogs } = getState();
		dialogs.set(context.id, { [type]: context });
		setState({ dialogs: new Map(dialogs) });
	},
	closeDialog: (id: string) => {
		const { dialogs } = getState();
		const dialog = dialogs.get(id);
		if (dialog) {
			dialogs.set(
				id,
				produce(dialog, (draft) => {
					for (const [, context] of Object.entries(draft)) {
						if (!context) continue;
						context.open = false;
					}
				})
			);
			setState({ dialogs: new Map(dialogs) });
		}
	},
	removeDialog: (id) => {
		const { dialogs } = getState();
		dialogs.delete(id);
		setState({ dialogs: new Map(dialogs) });
	}
}));
