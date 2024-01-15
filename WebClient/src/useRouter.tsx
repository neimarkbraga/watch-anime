import { Fragment, ReactNode, useMemo } from 'react';
import { createBrowserRouter, RouteObject, Navigate } from 'react-router-dom';
import { useStore } from 'zustand';
import { GoogleAuthCallback } from './pages/Redirect/GoogleAuthCallback/GoogleAuthCallback';
import { sessionStore } from './stores/useSessionStore';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { WatchPage } from './pages/WatchPage/WatchPage';

const Protected = (props: { element: ReactNode }) => {
	const { element } = props;
	const isLoggedIn = useStore(sessionStore, (s) => !!s.user);

	if (!isLoggedIn) return <Navigate to="/login" replace={true} />;
	return <Fragment>{element}</Fragment>;
};

const Root = () => {
	const isLoggedIn = useStore(sessionStore, (s) => !!s.user);
	return <Navigate to={isLoggedIn ? '/watch' : '/login'} replace={true} />;
};

export const useRouter = () => {
	return useMemo(() => {
		const routes: RouteObject[] = [
			{
				path: '/',
				element: <Root />
			},
			{
				path: '/watch',
				element: <Protected element={<WatchPage />} />
			},
			{
				path: '/login',
				element: <LoginPage />
			},
			{
				path: '/redirect/google/auth-callback',
				element: <GoogleAuthCallback />
			}
		];

		return createBrowserRouter(routes);
	}, []);
};
