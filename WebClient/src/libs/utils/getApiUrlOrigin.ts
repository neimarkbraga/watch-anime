export const getApiUrlOrigin = () => {
	return process.env.REACT_APP_API_ROOT_URL || window.location.origin;
};
