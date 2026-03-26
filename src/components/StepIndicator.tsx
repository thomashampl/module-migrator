import { useEffect, useRef } from "react";

type StepIndicatorProps = {
	currentStep: number;
	steps: string[];
};

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
	const prevStepRef = useRef(currentStep);
	const ringRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		if (currentStep !== prevStepRef.current) {
			const prevRing = ringRefs.current[prevStepRef.current - 1];
			if (prevRing) {
				prevRing.classList.remove("animate-ring-expand");
				prevRing.classList.add("animate-ring-shrink");
			}

			const currentRing = ringRefs.current[currentStep - 1];
			if (currentRing) {
				currentRing.classList.remove("animate-ring-shrink");
				currentRing.classList.add("animate-ring-expand");
			}

			prevStepRef.current = currentStep;
		}
	}, [currentStep]);

	return (
		<div className="flex items-center justify-start gap-1">
			{steps.map((step, index) => {
				const stepNumber = index + 1;
				const isCompleted = currentStep > stepNumber;
				const isCurrent = currentStep === stepNumber;

				return (
					<div key={step} className="flex items-center">
						<div className="flex items-center gap-2.5">
							<div className="relative flex items-center justify-center">
								<div
									ref={(el) => {
										ringRefs.current[index] = el;
									}}
									className={`
                     transition-all absolute w-9 h-9 rounded-full border-2
                    ${isCurrent ? "border-primary animate-ring-expand" : "border-gray-400 opacity-0"}
                  `}
								/>
								<div
									className={`
                    flex items-center justify-center w-7 h-7 rounded-full
                    text-sm font-medium transition-all
                    ${
											isCompleted
												? "bg-gray-400 text-white"
												: isCurrent
													? "bg-primary text-white"
													: "bg-gray-200 text-gray-400"
										}
                  `}
								>
									{stepNumber}
								</div>
							</div>
							<span
								className={`
                text-base font-medium
                ${isCurrent ? "text-gray-900" : "text-muted"}
              `}
							>
								{step}
							</span>
						</div>

						{index < steps.length - 1 && (
							<div
								className={`
                w-16 h-0.5 mx-5 rounded-full
                ${currentStep > stepNumber ? "bg-gray-400" : "bg-gray-200"}
              `}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
};

export { StepIndicator };
