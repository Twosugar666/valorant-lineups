import type { SpotImages } from "@/types";
import { SmartImage } from "./SmartImage";

const slots: { key: keyof SpotImages; label: string; hint: string }[] = [
  { key: "position", label: "站位", hint: "Position" },
  { key: "crosshair", label: "准星", hint: "Aim" },
  { key: "landing", label: "落点", hint: "Landing" },
];

export function ImageGallery({ images }: { images: SpotImages }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {slots.map(({ key, label, hint }) => (
        <figure
          key={key}
          className="glass-card group overflow-hidden transition hover:border-val-red/50"
        >
          <div className="relative aspect-video overflow-hidden bg-val-elevated">
            <SmartImage
              src={images[key]}
              alt={label}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              sizes="(max-width:768px) 100vw, 33vw"
            />
            <span className="absolute left-2 top-2 rounded-sm bg-val-bg/75 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-val-cyan backdrop-blur">
              {hint}
            </span>
          </div>
          <figcaption className="border-t border-val-border/80 bg-val-card/80 px-3 py-2.5 text-center text-sm font-medium">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
