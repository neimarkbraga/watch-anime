import { api } from '../libs/api/api';
import { IUserAccount } from '../models/UserAccount';

export const userAccountQueries = {
	createAccount: () => ({
		key: ['userAccount', 'createAccount'],
		fn: async (args: {
			email: string;
			password: string;
			firstName: string;
			lastName: string;
			pictureUrl: string;
			captcha: string;
		}) => {
			const { data } = await api.post<IUserAccount>('/api/UserAccount/CreateAccount', args);
			return data;
		}
	}),
	updateAccount: () => ({
		key: ['userAccount', 'updateAccount'],
		fn: async (args: { firstName: string; lastName: string; pictureUrl: string }) => {
			const { data } = await api.post<IUserAccount>('/api/UserAccount/UpdateAccount', args);
			return data;
		}
	}),
	changePassword: () => ({
		key: ['userAccount', 'changePassword'],
		fn: async (args: { oldPassword: string; newPassword: string }) => {
			const { data } = await api.post<{ message: string }>('/api/UserAccount/ChangePassword', args);
			return data;
		}
	})
};
