import axios from 'axios';
import { useSessionStore } from '../../stores/useSessionStore';
import { getApiUrlOrigin } from '../utils/getApiUrlOrigin';

export const api = axios.create({
	baseURL: getApiUrlOrigin()
});

api.interceptors.request.use((config) => {
	const { token } = useSessionStore.getState();
	if (token) config.headers['Authorization'] = `Bearer ${token}`;
	return config;
});
