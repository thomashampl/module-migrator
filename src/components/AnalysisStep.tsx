import type { DeprecatedModule } from "@integromat/module-migrator-core";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatModuleType, pluralize } from "../lib/utils";
import { Alert, Button, Checkbox } from "./ui";

type AnalysisStepProps = {
	deprecatedModules: DeprecatedModule[];
	selectedModuleIds: number[];
	onSelectionChange: (ids: number[]) => void;
	onMigrate: () => void;
	onBack: () => void;
};

const AnalysisStep = ({
	deprecatedModules,
	selectedModuleIds,
	onSelectionChange,
	onMigrate,
	onBack,
}: AnalysisStepProps) => {
	const allSelected = selectedModuleIds.length === deprecatedModules.length;
	const hasModules = deprecatedModules.length > 0;

	const handleToggleAll = () => {
		onSelectionChange(allSelected ? [] : deprecatedModules.map((m) => m.id));
	};

	const handleToggleModule = (id: number) => {
		onSelectionChange(
			selectedModuleIds.includes(id)
				? selectedModuleIds.filter((i) => i !== id)
				: [...selectedModuleIds, id],
		);
	};

	return (
		<div className="space-y-6">
			<header>
				<h2 className="text-2xl font-semibold text-gray-900">
					Analysis Results
				</h2>
				<p className="mt-1.5 text-base text-muted">
					Found {deprecatedModules.length} deprecated{" "}
					{pluralize(deprecatedModules.length, "module")} that can be migrated
				</p>
			</header>

			{!hasModules ? (
				<Alert variant="info" title="No deprecated modules found">
					<p>Your blueprint is already up to date.</p>
				</Alert>
			) : (
				<>
					<div className="flex items-center justify-between py-2">
						<Checkbox
							checked={allSelected}
							onChange={handleToggleAll}
							label={allSelected ? "Deselect all" : "Select all"}
						/>
						<span className="text-base text-muted">
							{selectedModuleIds.length} of {deprecatedModules.length} selected
						</span>
					</div>

					<div className="space-y-3">
						{deprecatedModules.map((module) => {
							const isSelected = selectedModuleIds.includes(module.id);
							return (
								<button
									type="button"
									key={module.id}
									onClick={() => handleToggleModule(module.id)}
									className={`
										w-full flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 text-left
										${isSelected ? "border-primary" : "border-gray-100 hover:border-gray-200"}
									`}
								>
									<Checkbox checked={isSelected} onChange={() => {}} />

									<div
										className={`
											px-2 py-1 rounded text-sm font-medium shrink-0
											${isSelected ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"}
										`}
									>
										#{module.id}
									</div>

									<div className="flex items-center gap-2 text-base flex-1 min-w-0">
										<span className="font-medium text-gray-700 truncate">
											{formatModuleType(module.fromModule)}
										</span>
										<ArrowRight className="w-3.5 h-3.5 text-muted shrink-0" />
										<span
											className={`font-medium truncate ${isSelected ? "text-primary" : "text-gray-500"}`}
										>
											{formatModuleType(module.toModule)}
										</span>
									</div>
								</button>
							);
						})}
					</div>
				</>
			)}

			<div className="flex justify-between pt-2">
				<Button variant="ghost" onClick={onBack}>
					<ArrowLeft className="w-4 h-4" />
					Back
				</Button>

				{hasModules && (
					<Button onClick={onMigrate} disabled={selectedModuleIds.length === 0}>
						Migrate{" "}
						{selectedModuleIds.length > 0 && `(${selectedModuleIds.length})`}
						<ArrowRight className="w-4 h-4" />
					</Button>
				)}
			</div>
		</div>
	);
};

export { AnalysisStep };
