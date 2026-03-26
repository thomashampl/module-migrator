import type { ComponentPropsWithRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ComponentPropsWithRef<"button"> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
};

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		"bg-primary text-white hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400",
	secondary:
		"bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
	ghost: "text-muted hover:text-gray-900 hover:bg-gray-50",
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: "px-3 py-1.5 text-sm gap-1.5",
	md: "px-4 py-2 text-base gap-2",
};

const Button = ({
	variant = "primary",
	size = "md",
	className = "",
	disabled,
	children,
	ref,
	...props
}: ButtonProps) => {
	return (
		<button
			ref={ref}
			disabled={disabled}
			className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors cursor-pointer disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
			{...props}
		>
			{children}
		</button>
	);
};

export { Button };
