import { api } from '../libs/api/api';
import { IUserAccount } from '../models/UserAccount';

const getGoogleRedirectUri = () => {
	return `${window.location.origin}/redirect/google/auth-callback`;
};

export const authQueries = {
	getGoogleAuthURI: () => ({
		key: ['auth', 'getGoogleAuthURI'],
		fn: async () => {
			const { data } = await api.get<string>('/api/Auth/GetGoogleAuthURI', {
				params: { redirectUri: getGoogleRedirectUri() }
			});
			return data;
		}
	}),
	loginWithGoogleAuthCode: () => ({
		key: ['auth', 'loginWithGoogleAuthCode'],
		fn: async (args: { authCode: string }) => {
			const { authCode } = args;
			const { data } = await api.post<{ accessToken: string }>(
				'/api/Auth/LoginWithGoogleAuthToken',
				{
					code: authCode,
					redirectUri: getGoogleRedirectUri()
				}
			);
			return data;
		}
	}),
	getSession: () => ({
		key: ['auth', 'getSession'],
		fn: async () => {
			const { data } = await api.get<IUserAccount | null>('/api/Auth/GetSession');
			return data;
		}
	})
};
