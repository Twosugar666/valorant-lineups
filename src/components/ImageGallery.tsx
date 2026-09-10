import Image from "next/image";
import type { SpotImages } from "@/types";

const slots: { key: keyof SpotImages; label: string }[] = [
  { key: "position", label: "站位" },
  { key: "crosshair", label: "准星" },
  { key: "landing", label: "落点" },
];

export function ImageGallery({ images }: { images: SpotImages }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {slots.map(({ key, label }) => (
        <figure
          key={key}
          className="overflow-hidden border border-val-border bg-val-card"
        >
          <div className="relative aspect-video">
            <Image
              src={images[key]}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          </div>
          <figcaption className="border-t border-val-border px-3 py-2 text-center text-sm font-medium text-val-muted">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
