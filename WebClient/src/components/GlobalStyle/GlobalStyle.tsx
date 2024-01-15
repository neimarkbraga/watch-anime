import { GlobalStyles } from '@mui/material';

export const GlobalStyle = () => {
	return (
		<GlobalStyles
			styles={{
				'html, body, #root': {
					width: '100%',
					minHeight: '100vh',
					display: 'flex',
					flexDirection: 'column'
				},
				fieldset: {
					border: 'none',
					borderWidth: 0,
					padding: 0,
					margin: 0
				}
			}}
		/>
	);
};
