import { api } from '../libs/api/api';
import { IWatchItem } from '../models/WatchItem';

export const watchItemQueries = {
	getWatchItems: () => ({
		key: ['watchItem', 'getWatchItems'],
		fn: async () => {
			const { data } = await api.get<IWatchItem[]>('/api/WatchItem');
			return data;
		}
	}),
	createWatchItem: () => ({
		key: ['watchItem', 'createWatchItem'],
		fn: async (args: {
			data: Pick<IWatchItem, 'code' | 'title' | 'description' | 'lastSeenEpisode'>;
		}) => {
			const { data } = await api.post<IWatchItem>('/api/WatchItem', args.data);
			return data;
		}
	}),
	updateWatchItem: (params: { id: string }) => ({
		key: ['watchItem', 'updateWatchItem', params.id],
		fn: async (args: {
			data: Pick<IWatchItem, 'code' | 'title' | 'description' | 'lastSeenEpisode'>;
		}) => {
			await api.put<void>(`/api/WatchItem/${params.id}`, args.data);
			return true;
		}
	}),
	deleteWatchItem: (params: { id: string }) => ({
		key: ['watchItem', 'deleteWatchItem', params.id],
		fn: async () => {
			await api.delete<void>(`/api/WatchItem/${params.id}`);
			return true;
		}
	})
};
