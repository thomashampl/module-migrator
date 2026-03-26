import {
	type Blueprint,
	type Bundle,
	type DeprecatedModule,
	findDeprecatedModules,
	type MigrationReport,
	migrateBlueprint,
	parseBlueprint,
} from "@integromat/module-migrator-core";
import { useCallback, useMemo, useState } from "react";
import { AnalysisStep } from "./components/AnalysisStep";
import { ResultsStep } from "./components/ResultsStep";
import { StepIndicator } from "./components/StepIndicator";
import { UploadStep } from "./components/UploadStep";
import { createFetchConfigRepository } from "./lib/adapters";

const STEPS = ["Upload", "Analyze", "Download"];

const App = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
	const [config, setConfig] = useState<Bundle | null>(null);
	const [deprecatedModules, setDeprecatedModules] = useState<
		DeprecatedModule[]
	>([]);
	const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);
	const [migratedBlueprint, setMigratedBlueprint] = useState<Blueprint | null>(
		null,
	);
	const [migrationReport, setMigrationReport] =
		useState<MigrationReport | null>(null);
	const [configLoading, setConfigLoading] = useState(false);
	const [configError, setConfigError] = useState<string | null>(null);
	const [customConfig, setCustomConfig] = useState<{
		config: Bundle;
		filename: string;
	} | null>(null);

	const configRepository = useMemo(() => createFetchConfigRepository(), []);

	const handleFileSelect = useCallback((file: File, content: string) => {
		setSelectedFile(file);
		try {
			const parsed = parseBlueprint(content);
			setBlueprint(parsed);
		} catch (error) {
			console.error("Failed to parse blueprint:", error);
		}
	}, []);

	const handleContinueToAnalysis = useCallback(async () => {
		if (!blueprint) return;

		setConfigLoading(true);
		setConfigError(null);

		try {
			// Use custom config from dev options if available
			const loadedConfig =
				customConfig?.config ?? (await configRepository.load());
			setConfig(loadedConfig);
			const deprecated = findDeprecatedModules(blueprint, loadedConfig);
			setDeprecatedModules(deprecated);
			setSelectedModuleIds(deprecated.map((m) => m.id));
			setCurrentStep(2);
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to load migration config";
			setConfigError(message);
		} finally {
			setConfigLoading(false);
		}
	}, [blueprint, configRepository, customConfig]);

	const handleMigrate = useCallback(() => {
		if (!blueprint || !config) return;

		const { migratedBlueprint: migrated, report } = migrateBlueprint(
			blueprint,
			selectedModuleIds,
			config,
		);
		setMigratedBlueprint(migrated);
		setMigrationReport(report);
		setCurrentStep(3);
	}, [blueprint, selectedModuleIds, config]);

	const handleStartOver = useCallback(() => {
		setCurrentStep(1);
		setSelectedFile(null);
		setBlueprint(null);
		setDeprecatedModules([]);
		setSelectedModuleIds([]);
		setMigratedBlueprint(null);
		setMigrationReport(null);
		setConfigError(null);
	}, []);

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-2xl mx-auto px-6 py-16">
				<div className="mb-10">
					<h1 className="text-3xl font-semibold text-gray-900">
						Make Blueprint Migration
					</h1>
					<p className="mt-2 text-lg text-muted">
						Migrate deprecated Pipedrive modules to newer versions
					</p>
				</div>

				<div className="mb-8">
					<StepIndicator currentStep={currentStep} steps={STEPS} />
				</div>

				<div>
					{currentStep === 1 && (
						<UploadStep
							onFileSelect={handleFileSelect}
							selectedFile={selectedFile}
							onContinue={handleContinueToAnalysis}
							loading={configLoading}
							error={configError}
							customConfig={customConfig}
							onCustomConfigSelect={(config, filename) =>
								setCustomConfig({ config, filename })
							}
							onCustomConfigClear={() => setCustomConfig(null)}
						/>
					)}

					{currentStep === 2 && (
						<AnalysisStep
							deprecatedModules={deprecatedModules}
							selectedModuleIds={selectedModuleIds}
							onSelectionChange={setSelectedModuleIds}
							onMigrate={handleMigrate}
							onBack={() => setCurrentStep(1)}
						/>
					)}

					{currentStep === 3 &&
						migratedBlueprint &&
						migrationReport &&
						selectedFile && (
							<ResultsStep
								originalFilename={selectedFile.name}
								migratedBlueprint={migratedBlueprint}
								report={migrationReport}
								onStartOver={handleStartOver}
							/>
						)}
				</div>

				<p className="mt-8 text-center text-base text-muted">
					All processing happens locally in your browser
				</p>
			</div>
		</div>
	);
};

export default App;
