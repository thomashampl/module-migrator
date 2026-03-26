import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import type { ReactNode } from "react";

type AlertVariant = "info" | "warning" | "error" | "success";

type AlertProps = {
	variant?: AlertVariant;
	title?: string;
	children: ReactNode;
	className?: string;
};

const variantConfig: Record<
	AlertVariant,
	{
		containerClass: string;
		icon: typeof Info;
		iconClass: string;
	}
> = {
	info: {
		containerClass: "bg-blue-50 border-blue-100",
		icon: Info,
		iconClass: "text-blue-500",
	},
	warning: {
		containerClass: "bg-warning/5 border-warning/15",
		icon: AlertCircle,
		iconClass: "text-warning",
	},
	error: {
		containerClass: "bg-red-50 border-red-100",
		icon: X,
		iconClass: "text-red-500",
	},
	success: {
		containerClass: "bg-green-50 border-green-100",
		icon: CheckCircle,
		iconClass: "text-green-500",
	},
};

const Alert = ({
	variant = "info",
	title,
	children,
	className = "",
}: AlertProps) => {
	const config = variantConfig[variant];
	const Icon = config.icon;

	return (
		<div
			className={`flex items-start gap-3 p-4 border-2 rounded-xl ${config.containerClass} ${className}`}
		>
			<Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconClass}`} />
			<div className="text-base text-gray-600">
				{title && <p className="font-medium text-gray-900">{title}</p>}
				<div className={title ? "mt-1" : ""}>{children}</div>
			</div>
		</div>
	);
};

export { Alert };
