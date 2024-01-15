import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { GlobalStyle } from './components/GlobalStyle/GlobalStyle';
import { darkTheme } from './themes/darkTheme';
import { queryClient } from './queryClient';
import { useRouter } from './useRouter';
import { SessionProvider } from './providers/SessionProvider/SessionProvider';
import { MainHeader } from './components/MainHeader/MainHeader';
import { DialogProvider } from './providers/DialogProvider';

function App() {
	const router = useRouter();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<GlobalStyle />
				<DialogProvider>
					<SessionProvider>
						<MainHeader />
						<RouterProvider router={router} />
					</SessionProvider>
				</DialogProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
