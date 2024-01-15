import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { GlobalStyle } from './components/GlobalStyle/GlobalStyle';
import { darkTheme } from './themes/darkTheme';
import { queryClient } from './queryClient';
import { useRouter } from './useRouter';
import { SessionLoader } from './components/SessionLoader/SessionLoader';

function App() {
	const router = useRouter();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<GlobalStyle />
				<SessionLoader>
					<RouterProvider router={router} />
				</SessionLoader>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
