import { Check } from "lucide-react";

type CheckboxProps = {
	checked: boolean;
	onChange: () => void;
	label?: string;
	className?: string;
};

const Checkbox = ({
	checked,
	onChange,
	label,
	className = "",
}: CheckboxProps) => {
	return (
		<label
			className={`flex items-center gap-2.5 text-base text-muted hover:text-gray-900 transition-colors cursor-pointer ${className}`}
		>
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className="sr-only"
			/>
			<div
				className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
          ${checked ? "bg-primary border-primary" : "border-gray-300 hover:border-gray-400"}
        `}
			>
				{checked && (
					<Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
				)}
			</div>
			{label && <span>{label}</span>}
		</label>
	);
};

export { Checkbox };
