import jsonpath from 'jsonpath';

export interface IGetErrorMessageOptions {
	defaultMessage?: string;
}

export const getErrorMessage = (error: unknown, options?: IGetErrorMessageOptions) => {
	const defaultMessage = options?.defaultMessage || 'An unknown error occurred';
	if (!error) return defaultMessage;
	if (typeof error === 'string') return error;
	if (typeof error === 'object') {
		const expressions = ['$.response.data.message', '$.response.data', '$.message'];
		for (const expression of expressions) {
			const value = jsonpath.value(error, expression);
			if (typeof value === 'string' && value) return value;
		}
	}
	return defaultMessage;
};
