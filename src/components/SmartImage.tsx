import Image, { type ImageProps } from "next/image";

type SmartImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

function isSvg(src: string) {
  const path = src.split("?")[0]?.toLowerCase() ?? "";
  return path.endsWith(".svg");
}

/**
 * SVGs bypass next/image so Content-Disposition: attachment never breaks inline display.
 * Raster images still use next/image when present.
 */
export function SmartImage({ src, alt, className, fill, width, height, style, sizes, priority, ...rest }: SmartImageProps) {
  if (isSvg(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            ...style,
          }}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        width={typeof width === "number" ? width : undefined}
        height={typeof height === "number" ? height : undefined}
        style={style}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      style={style}
      sizes={sizes}
      priority={priority}
      {...rest}
    />
  );
}
