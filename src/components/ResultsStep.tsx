import type {
	Blueprint,
	MigrationReport,
} from "@integromat/module-migrator-core";
import { RefreshCw } from "lucide-react";
import { pluralize } from "../lib/utils";
import { FileCard } from "./FileCard";
import { ModuleReportCard } from "./ModuleReportCard";
import { Alert, Button } from "./ui";

type ResultsStepProps = {
	originalFilename: string;
	migratedBlueprint: Blueprint;
	report: MigrationReport;
	onStartOver: () => void;
};

const ResultsStep = ({
	originalFilename,
	migratedBlueprint,
	report,
	onStartOver,
}: ResultsStepProps) => {
	const migratedFilename = originalFilename.replace(
		/\.json$/,
		"_migrated.json",
	);
	const migratedContent = JSON.stringify(migratedBlueprint, null, 2);
	const totalIssues = report.summary.warnings + report.summary.infos;

	const handleDownload = () => {
		const blob = new Blob([migratedContent], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = migratedFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-6">
			<header>
				<h2 className="text-2xl font-semibold text-gray-900">
					Migration Complete
				</h2>
				<p className="mt-1.5 text-base text-muted">
					Successfully migrated {report.summary.migrated}{" "}
					{pluralize(report.summary.migrated, "module")}
					{totalIssues > 0 &&
						` with ${totalIssues} ${pluralize(totalIssues, "item")} to review`}
				</p>
			</header>

			<FileCard
				filename={migratedFilename}
				size={new Blob([migratedContent]).size}
				onDownload={handleDownload}
			/>

			<Alert variant="info" title="Next steps">
				<ul className="space-y-1 list-disc list-inside text-muted">
					<li>Review warnings and update your scenario accordingly</li>
					<li>Import the migrated blueprint into Make</li>
					<li>Test all affected modules before activating</li>
				</ul>
			</Alert>

			{report.modules.length > 0 && (
				<section className="space-y-4">
					<h3 className="text-lg font-medium text-gray-900">
						Migration Details
					</h3>
					<div className="space-y-3">
						{report.modules.map((moduleReport) => (
							<ModuleReportCard
								key={moduleReport.moduleId}
								report={moduleReport}
							/>
						))}
					</div>
				</section>
			)}

			<div className="flex justify-start pt-2">
				<Button variant="ghost" onClick={onStartOver}>
					<RefreshCw className="w-4 h-4" />
					Migrate another scenario
				</Button>
			</div>
		</div>
	);
};

export { ResultsStep };
