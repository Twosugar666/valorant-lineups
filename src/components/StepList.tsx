import type { SpotStep } from "@/types";
import { SmartImage } from "./SmartImage";

export function StepList({ steps }: { steps: SpotStep[] }) {
  return (
    <ol className="space-y-8">
      {steps.map((step) => (
        <li key={step.order} className="flex gap-4 md:gap-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-val-red text-sm font-bold text-white shadow-lg shadow-val-red/30 clip-corner-sm">
            {step.order}
          </span>
          <div className="min-w-0 flex-1 space-y-3 pt-1">
            <p className="text-base leading-relaxed">{step.text}</p>
            {step.tip && (
              <p className="rounded-sm border border-val-cyan/25 bg-val-cyan/5 px-3 py-2 text-sm text-val-cyan">
                提示：{step.tip}
              </p>
            )}
            {step.image && (
              <figure className="overflow-hidden border border-val-border bg-val-bg shadow-inner">
                <div className="relative aspect-[16/9] md:aspect-[2/1]">
                  <SmartImage
                    src={step.image}
                    alt={`步骤 ${step.order}`}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 720px"
                  />
                </div>
                <figcaption className="border-t border-val-border px-3 py-2 text-xs text-val-muted">
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
