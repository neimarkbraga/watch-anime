import { createStore } from 'zustand';
import { IWatchItem } from '../../models/WatchItem';

export interface IWatchStore {
	items: IWatchItem[];
	getItems: () => IWatchItem[];
	setItems: (items: IWatchItem[]) => void;
}

export const watchStore = createStore<IWatchStore>((setState, getState) => ({
	items: [],
	getItems: () => {
		const { items } = getState();
		return items;
	},
	setItems: (items) => {
		setState({ items });
	}
}));
