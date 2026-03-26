/**
 * Hook to check if dev mode is enabled via ?dev=1 query param.
 * Used to show developer options in the UI.
 */
export const useDevMode = (): boolean => {
	const params = new URLSearchParams(window.location.search);
	return params.get("dev") === "1";
};
