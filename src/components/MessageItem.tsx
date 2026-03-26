import type { ReportMessage } from "@integromat/module-migrator-core";
import { AlertTriangle, Check, HelpCircle, Info } from "lucide-react";

type MessageItemProps = {
	message: ReportMessage;
};

const MessageItem = ({ message }: MessageItemProps) => {
	const isWarning = message.type === "warning";

	return (
		<div
			className={`flex gap-3 py-3 border-l-2 pl-3 ${isWarning ? "border-warning" : "border-blue-400"}`}
		>
			<div className="shrink-0 mt-0.5">
				{isWarning ? (
					<AlertTriangle className="w-4 h-4 text-warning" />
				) : (
					<Info className="w-4 h-4 text-blue-500" />
				)}
			</div>

			<div className="flex-1 min-w-0 text-base">
				<p className="text-gray-700">
					<span className="font-medium text-gray-900">{message.field}:</span>{" "}
					{message.message}
				</p>

				<div className="flex items-center gap-3 mt-1.5 text-sm text-muted">
					{message.autoFixed && (
						<span className="inline-flex items-center gap-1 text-primary">
							<Check className="w-3 h-3" />
							Auto-fixed
						</span>
					)}
					{!message.certain && (
						<span className="inline-flex items-center gap-1">
							<HelpCircle className="w-3 h-3" />
							Needs verification
						</span>
					)}
					{message.note && <span>{message.note}</span>}
				</div>

				{message.referencedBy && message.referencedBy.length > 0 && (
					<p className="mt-1 text-sm text-muted">
						Referenced by: {message.referencedBy.join(", ")}
					</p>
				)}
			</div>
		</div>
	);
};

export { MessageItem };
