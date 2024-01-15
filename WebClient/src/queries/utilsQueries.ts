import { api } from '../libs/api/api';

export const utilsQueries = {
	getHtmlContent: (params: { url: string }) => ({
		key: ['util', 'getHtmlContent', params.url],
		fn: async () => {
			const { data } = await api.get<string>('/api/Util/GetHtmlContent', { params });
			return data;
		}
	})
};
