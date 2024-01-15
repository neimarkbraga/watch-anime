import { api } from '../libs/api/api';
import { IUserAccount } from '../models/UserAccount';
import { ISessionConfig } from '../models/SessionConfig';

export const sessionQueries = {
	getSession: () => ({
		key: ['session', 'getSession'],
		fn: async () => {
			const { data } = await api.get<{ user: IUserAccount | null; config: ISessionConfig }>(
				'/api/Session/GetSession'
			);
			return data;
		}
	})
};
