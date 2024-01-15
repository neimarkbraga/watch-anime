import { api } from '../libs/api/api';

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
	loginWithEmailAndPassword: () => ({
		key: ['auth', 'loginWithEmailAndPassword'],
		fn: async (args: { email: string; password: string; captcha: string }) => {
			const { email, password, captcha } = args;
			const { data } = await api.post<{ accessToken: string }>(
				'/api/Auth/LoginWithEmailAndPassword',
				{ email, password, captcha }
			);
			return data;
		}
	})
};
