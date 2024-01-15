import { create } from 'zustand';
import { IWatchItem } from '../../models/WatchItem';

export interface IWatchStore {
	items: IWatchItem[];
	getItems: () => IWatchItem[];
	setItems: (items: IWatchItem[]) => void;
}

export const useWatchStore = create<IWatchStore>((setState, getState) => ({
	items: [],
	getItems: () => {
		const { items } = getState();
		return items;
	},
	setItems: (items) => {
		setState({ items });
	}
}));
