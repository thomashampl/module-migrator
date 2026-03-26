import type { ModuleReport } from "@integromat/module-migrator-core";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { formatModuleType, pluralize } from "../lib/utils";
import { MessageItem } from "./MessageItem";

type ModuleReportCardProps = {
	report: ModuleReport;
};

const ModuleReportCard = ({ report }: ModuleReportCardProps) => {
	const [isExpanded, setIsExpanded] = useState(true);

	const totalCount = report.messages.filter(
		(m) => m.type === "warning" || m.type === "info",
	).length;

	return (
		<div className="rounded-xl border-2 border-gray-100">
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className={`w-full flex items-center gap-4 p-4 transition-colors text-left cursor-pointer ${
					isExpanded ? "bg-gray-50" : "hover:bg-gray-50"
				}`}
			>
				<div className="shrink-0 text-muted">
					{isExpanded ? (
						<ChevronDown className="w-5 h-5" />
					) : (
						<ChevronRight className="w-5 h-5" />
					)}
				</div>

				<div className="px-2 py-1 rounded bg-gray-100 text-gray-500 text-sm font-medium shrink-0">
					#{report.moduleId}
				</div>

				<div className="flex items-center gap-2 text-base flex-1 min-w-0">
					<span className="font-medium text-gray-700 truncate">
						{formatModuleType(report.fromModule)}
					</span>
					<ArrowRight className="w-3.5 h-3.5 text-muted shrink-0" />
					<span className="font-medium text-primary truncate">
						{formatModuleType(report.toModule)}
					</span>
				</div>

				{totalCount > 0 && (
					<span className="text-base text-muted shrink-0">
						{totalCount} {pluralize(totalCount, "item")}
					</span>
				)}
			</button>

			{isExpanded && (
				<div className="px-4 pt-2 pb-4">
					{report.messages.length > 0 ? (
						<div className="space-y-2">
							{report.messages.map((message) => (
								<MessageItem key={message.field} message={message} />
							))}
						</div>
					) : (
						<p className="text-base text-muted">No issues found</p>
					)}
				</div>
			)}
		</div>
	);
};

export { ModuleReportCard };
