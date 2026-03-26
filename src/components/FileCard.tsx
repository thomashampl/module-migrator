import { Download, FileJson } from "lucide-react";
import { formatFileSize } from "../lib/utils";
import { Button } from "./ui";

type FileCardProps = {
	filename: string;
	size: number;
	onDownload: () => void;
};

const FileCard = ({ filename, size, onDownload }: FileCardProps) => {
	return (
		<div className="rounded-xl border-2 border-gray-100">
			<div className="p-4 flex items-center gap-3">
				<FileJson className="w-5 h-5 text-muted shrink-0" />
				<div className="flex-1 min-w-0">
					<p className="text-base font-medium text-gray-800 truncate">
						{filename}
					</p>
					<p className="text-sm text-muted">{formatFileSize(size)}</p>
				</div>
				<Button onClick={onDownload}>
					<Download className="w-4 h-4" />
					Download
				</Button>
			</div>
		</div>
	);
};

export { FileCard };
