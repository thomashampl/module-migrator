import type { Bundle } from "@integromat/module-migrator-core";
import { FileJson, X } from "lucide-react";
import { type ChangeEvent, useCallback, useState } from "react";

type DevOptionsProps = {
	customConfig: { config: Bundle; filename: string } | null;
	onConfigSelect: (config: Bundle, filename: string) => void;
	onConfigClear: () => void;
};

const DevOptions = ({
	customConfig,
	onConfigSelect,
	onConfigClear,
}: DevOptionsProps) => {
	const [error, setError] = useState<string | null>(null);
	const hasCustomConfig = customConfig !== null;

	const handleFileSelect = useCallback(
		async (e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			setError(null);

			try {
				const content = await file.text();
				const parsed = JSON.parse(content) as Bundle;
				onConfigSelect(parsed, file.name);
			} catch {
				setError("Invalid config JSON file");
			}
		},
		[onConfigSelect],
	);

	return (
		<div className="space-y-3">
			<p className="text-base font-medium text-gray-700">
				Custom migration config:
			</p>

			{error && <p className="text-sm text-red-600">{error}</p>}

			{hasCustomConfig ? (
				<div className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-gray-100 rounded-xl">
					<FileJson className="w-4 h-4 text-muted shrink-0" />
					<span className="text-base text-gray-800 truncate">
						{customConfig.filename}
					</span>
					<div className="flex items-center gap-3 ml-auto">
						<label className="text-sm text-primary hover:text-primary-hover cursor-pointer transition-colors">
							Replace
							<input
								type="file"
								accept=".json"
								onChange={handleFileSelect}
								className="sr-only"
							/>
						</label>
						<button
							type="button"
							onClick={onConfigClear}
							className="text-muted hover:text-gray-700 cursor-pointer transition-colors"
							aria-label="Clear config"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				</div>
			) : (
				<label className="flex items-center gap-3 px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
					<FileJson className="w-4 h-4 text-muted shrink-0" />
					<span className="text-base text-muted">Choose file...</span>
					<input
						type="file"
						accept=".json"
						onChange={handleFileSelect}
						className="sr-only"
					/>
				</label>
			)}
		</div>
	);
};

export { DevOptions };
