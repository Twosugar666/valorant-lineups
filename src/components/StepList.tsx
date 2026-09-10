import type { SpotStep } from "@/types";

export function StepList({ steps }: { steps: SpotStep[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step) => (
        <li key={step.order} className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-val-red text-sm font-bold text-white">
            {step.order}
          </span>
          <div className="pt-1">
            <p className="leading-relaxed">{step.text}</p>
            {step.tip && (
              <p className="mt-1 text-sm text-val-cyan">提示：{step.tip}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
