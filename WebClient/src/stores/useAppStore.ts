import { create } from 'zustand';
import { SetStateAction } from 'react';

export interface IAppStore {
	isDrawerOpen: boolean;
	setIsDrawerOpen: (value: SetStateAction<boolean>) => void;

	isDrawerEnabled: boolean;
	setIsDrawerEnabled: (value: SetStateAction<boolean>) => void;
}

export const useAppStore = create<IAppStore>((setState, getState) => ({
	isDrawerOpen: false,
	setIsDrawerOpen: (value) => {
		const { isDrawerOpen } = getState();
		setState({ isDrawerOpen: typeof value === 'function' ? value(isDrawerOpen) : value });
	},

	isDrawerEnabled: false,
	setIsDrawerEnabled: (value) => {
		const { isDrawerEnabled } = getState();
		setState({ isDrawerEnabled: typeof value === 'function' ? value(isDrawerEnabled) : value });
	}
}));
