/**
 * Format bytes to human-readable file size
 */
const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Extract module name from full module type (e.g., "pipedrive:SearchForActivity" -> "SearchForActivity")
 */
const formatModuleType = (moduleType: string): string => {
	const parts = moduleType.split(":");
	return parts.length > 1 ? parts[1] : moduleType;
};

/**
 * Pluralize a word based on count
 */
const pluralize = (
	count: number,
	singular: string,
	plural?: string,
): string => {
	return count === 1 ? singular : (plural ?? `${singular}s`);
};

export { formatFileSize, formatModuleType, pluralize };
