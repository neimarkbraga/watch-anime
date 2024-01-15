import { Box, Stack, SxProps, Theme } from '@mui/material';
import { TextDividerProps } from './TextDivider.types';

export const TextDivider = (props: TextDividerProps) => {
	const { children, orientation = 'horizontal', lineSize = 1, ...stackProps } = props;

	const lineSx: SxProps<Theme> = ({ palette }) => ({
		height: orientation === 'horizontal' ? `${lineSize}px` : '100%',
		width: orientation === 'vertical' ? `${lineSize}px` : '100%',
		backgroundColor: palette.divider
	});

	return (
		<Stack
			{...stackProps}
			alignItems="center"
			direction={orientation === 'vertical' ? 'column' : 'row'}
		>
			<Box flex="1" sx={lineSx} />
			<Box sx={{ px: 1 }}>{children}</Box>
			<Box flex="1" sx={lineSx} />
		</Stack>
	);
};
