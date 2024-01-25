import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { GlobalStyle } from './components/GlobalStyle/GlobalStyle';
import { darkTheme } from './themes/darkTheme';
import { queryClient } from './queryClient';
import { DialogProvider } from './providers/DialogProvider';
import { SessionProvider } from './providers/SessionProvider/SessionProvider';
import { SignalRProvider } from './providers/SignalRProvider/SignalRProvider';
import { MainHeader } from './components/MainHeader/MainHeader';
import { AppRoutes } from './routes/AppRoutes';

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<GlobalStyle />
				<SignalRProvider>
					<DialogProvider>
						<BrowserRouter>
							<SessionProvider>
								<MainHeader />
								<AppRoutes />
							</SessionProvider>
						</BrowserRouter>
					</DialogProvider>
				</SignalRProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
