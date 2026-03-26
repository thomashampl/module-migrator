import type { Bundle } from "@integromat/module-migrator-core";
import { ArrowRight, Loader2, Paperclip, Upload, X } from "lucide-react";
import {
	type ChangeEvent,
	type DragEvent,
	useCallback,
	useId,
	useState,
} from "react";
import { useDevMode } from "../hooks";
import { formatFileSize } from "../lib/utils";
import { DevOptions } from "./DevOptions";
import { Alert, Button } from "./ui";

type UploadStepProps = {
	onFileSelect: (file: File, content: string) => void;
	selectedFile: File | null;
	onContinue: () => void;
	loading?: boolean;
	error?: string | null;
	customConfig: { config: Bundle; filename: string } | null;
	onCustomConfigSelect: (config: Bundle, filename: string) => void;
	onCustomConfigClear: () => void;
};

const UploadStep = ({
	onFileSelect,
	selectedFile,
	onContinue,
	loading,
	error: configError,
	customConfig,
	onCustomConfigSelect,
	onCustomConfigClear,
}: UploadStepProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [fileError, setFileError] = useState<string | null>(null);
	const inputId = useId();
	const isDevMode = useDevMode();

	const handleFile = useCallback(
		async (file: File) => {
			setFileError(null);

			if (!file.name.endsWith(".json")) {
				setFileError("Please upload a JSON file");
				return;
			}

			try {
				const content = await file.text();
				JSON.parse(content);
				onFileSelect(file, content);
			} catch {
				setFileError("Invalid JSON file. Please check the file format.");
			}
		},
		[onFileSelect],
	);

	const handleDrop = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			if (loading) return;
			const file = e.dataTransfer.files[0];
			if (file) handleFile(file);
		},
		[handleFile, loading],
	);

	const handleDragOver = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			if (loading) return;
			setIsDragging(true);
		},
		[loading],
	);

	const handleDragLeave = useCallback((e: DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleInputChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (loading) return;
			const file = e.target.files?.[0];
			if (file) handleFile(file);
		},
		[handleFile, loading],
	);

	const handleRemoveFile = useCallback(() => {
		if (loading) return;
		onFileSelect(null as unknown as File, "");
	}, [onFileSelect, loading]);

	return (
		<div className="space-y-6">
			<header>
				<h2 className="text-2xl font-semibold text-gray-900">
					Upload Blueprint
				</h2>
				<p className="mt-1.5 text-base text-muted">
					Select a JSON file to scan for deprecated modules
				</p>
			</header>

			<div
				className={`
          relative rounded-2xl border border-gray-100 p-1 bg-gray-50
          transition-all duration-150
          ${isDragging ? "border-primary bg-primary/5" : ""}
          ${loading ? "opacity-50 pointer-events-none" : ""}
        `}
			>
				<label
					htmlFor={loading ? undefined : inputId}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					className={`
            relative flex flex-col items-center rounded-xl py-16 px-6 bg-white
            border border-dashed border-gray-300
            ${loading ? "cursor-not-allowed" : "cursor-pointer"}
            ${isDragging ? "border-primary" : ""}
          `}
				>
					<input
						id={inputId}
						type="file"
						accept=".json"
						onChange={handleInputChange}
						disabled={loading}
						className="sr-only"
					/>
					<div className="flex items-center gap-2.5 text-gray-800">
						<Upload className="w-5 h-5" />
						<span className="font-medium">
							Drop your Make scenario blueprint here
						</span>
					</div>
					<p className="mt-2 text-base text-muted">
						or click to browse for a JSON file
					</p>
				</label>
			</div>

			{fileError && (
				<Alert variant="error">
					<span>{fileError}</span>
				</Alert>
			)}

			{configError && (
				<Alert variant="error" title="Failed to load migration config">
					<span>{configError}</span>
				</Alert>
			)}

			{selectedFile && (
				<div className="space-y-3">
					<p className="text-base font-medium text-gray-700">Attachments:</p>
					<div className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-gray-100 rounded-xl">
						<Paperclip className="w-4 h-4 text-muted shrink-0" />
						<span className="text-base text-gray-800 truncate">
							{selectedFile.name}
						</span>
						<div className="flex items-center gap-3 ml-auto">
							<span className="text-sm text-muted whitespace-nowrap">
								{formatFileSize(selectedFile.size)}
							</span>
							<button
								type="button"
								onClick={handleRemoveFile}
								disabled={loading}
								className={`
                  transition-colors
                  ${loading ? "text-gray-300 cursor-not-allowed" : "text-muted hover:text-gray-700 cursor-pointer"}
                `}
								aria-label="Remove file"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			)}

			{isDevMode && (
				<DevOptions
					customConfig={customConfig}
					onConfigSelect={onCustomConfigSelect}
					onConfigClear={onCustomConfigClear}
				/>
			)}

			<div className="flex justify-end pt-2">
				<Button onClick={onContinue} disabled={!selectedFile || loading}>
					{loading ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							Loading config...
						</>
					) : (
						<>
							Continue
							<ArrowRight className="w-4 h-4" />
						</>
					)}
				</Button>
			</div>
		</div>
	);
};

export { UploadStep };
