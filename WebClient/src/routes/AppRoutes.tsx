import React, { Fragment, ReactNode } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { GoogleAuthCallback } from '../pages/Redirect/GoogleAuthCallback/GoogleAuthCallback';
import { useSessionStore } from '../stores/useSessionStore';
import { LoginPage } from '../pages/LoginPage/LoginPage';
import { WatchPage } from '../pages/WatchPage/WatchPage';
import { SignUpPage } from '../pages/SignUpPage/SignUpPage';
import { AccountSettingsPage } from '../pages/AccountSettingsPage/AccountSettingsPage';

const Protected = (props: { element: ReactNode }) => {
	const { element } = props;
	const isLoggedIn = useSessionStore((s) => !!s.user);

	if (!isLoggedIn) return <Navigate to="/login" replace={true} />;
	return <Fragment>{element}</Fragment>;
};

const Root = () => {
	const isLoggedIn = useSessionStore((s) => !!s.user);
	return <Navigate to={isLoggedIn ? '/watch' : '/login'} replace={true} />;
};

export const AppRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Root />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/sign-up" element={<SignUpPage />} />
			<Route path="/redirect/google/auth-callback" element={<GoogleAuthCallback />} />
			<Route path="/watch" element={<Protected element={<WatchPage />} />} />
			<Route path="/watch/:watchId" element={<Protected element={<WatchPage />} />} />
			<Route path="/account-settings" element={<Protected element={<AccountSettingsPage />} />} />
			<Route path="*" element={<div />} />
		</Routes>
	);
};
