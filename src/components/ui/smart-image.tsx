"use client";

import Image from "next/image";
import { useState } from "react";
import { isRemoteImage } from "@/lib/image-url";

type SmartImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function SmartFillImage({
  src,
  fallbackSrc = "/assets/figma/hero-villa.png",
  alt,
  className,
  sizes,
  priority,
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  if (isRemoteImage(currentSrc)) {
    return (
      // Uploaded Supabase images are already CDN-hosted public assets; native img avoids optimizer edge cases.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={className}
        onError={() => setCurrentSrc(fallbackSrc)}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
}
