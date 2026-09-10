import Image from "next/image";
import type { SpotStep } from "@/types";

export function StepList({ steps }: { steps: SpotStep[] }) {
  return (
    <ol className="space-y-6">
      {steps.map((step) => (
        <li key={step.order} className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-val-red text-sm font-bold text-white">
            {step.order}
          </span>
          <div className="min-w-0 flex-1 space-y-3 pt-1">
            <p className="leading-relaxed">{step.text}</p>
            {step.tip && (
              <p className="text-sm text-val-cyan">提示：{step.tip}</p>
            )}
            {step.image && (
              <figure className="overflow-hidden border border-val-border bg-val-bg">
                <div className="relative aspect-video">
                  <Image
                    src={step.image}
                    alt={`步骤 ${step.order}`}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 640px"
                  />
                </div>
                <figcaption className="border-t border-val-border px-3 py-1.5 text-xs text-val-muted">
                  步骤 {step.order} · 示意原图
                </figcaption>
              </figure>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
