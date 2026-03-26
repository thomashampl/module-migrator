import type {
	Bundle,
	ConfigRepository,
} from "@integromat/module-migrator-core";

const fetchWithRetry = async (url: string, retries = 3): Promise<Response> => {
	let lastError: Error | null = null;

	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			return response;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			if (attempt < retries - 1) {
				await new Promise((resolve) =>
					setTimeout(resolve, 1000 * (attempt + 1)),
				);
			}
		}
	}

	throw lastError;
};

/**
 * ConfigRepository adapter that fetches config from a remote URL.
 * Used by the SPA.
 */
export class FetchConfigRepository implements ConfigRepository {
	private cachedBundle: Bundle | null = null;
	private fetchPromise: Promise<Bundle> | null = null;
	private readonly configUrl: string;

	constructor(configUrl: string) {
		if (!configUrl) {
			throw new Error("Config URL is required");
		}
		this.configUrl = configUrl;
	}

	async load(): Promise<Bundle> {
		if (this.cachedBundle) return this.cachedBundle;
		if (this.fetchPromise) return this.fetchPromise;

		this.fetchPromise = (async () => {
			try {
				const response = await fetchWithRetry(this.configUrl, 3);
				const data = await response.json();
				this.cachedBundle = data as Bundle;
				return this.cachedBundle;
			} finally {
				this.fetchPromise = null;
			}
		})();

		return this.fetchPromise;
	}

	getCached(): Bundle | null {
		return this.cachedBundle;
	}
}

/**
 * Factory function to create FetchConfigRepository from environment.
 */
export const createFetchConfigRepository = (): FetchConfigRepository => {
	const configUrl = import.meta.env.VITE_MIGRATION_CONFIG_URL;

	if (!configUrl) {
		throw new Error("VITE_MIGRATION_CONFIG_URL is not set");
	}
	return new FetchConfigRepository(configUrl);
};
