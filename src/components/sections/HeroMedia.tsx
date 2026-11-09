"use client";

import Image from "next/image";
import { siteConfig } from "@/config/site";

type VideoSrc = { desktopWebm: string; desktopMp4: string; mobileWebm: string; mobileMp4: string };

type Props = {
  videoSrc?: VideoSrc;
  posterSrc?: string;
  fallbackImageSrc?: string;
  alt?: string;
};

/**
 * Mídia de fundo da hero.
 * - Com vídeo configurado: autoplay, muted, loop, playsInline, poster e
 *   versões desktop/mobile por media query.
 * - Sem vídeo: composição fotográfica de fallback com parallax e zoom.
 * O overlay bordô profundo garante a legibilidade do texto.
 */
export function HeroMedia({
  videoSrc = siteConfig.media.hero.videoSrc,
  posterSrc = siteConfig.media.hero.posterSrc,
  fallbackImageSrc = siteConfig.media.hero.fallbackImageSrc,
  alt = siteConfig.media.hero.fallbackAlt,
}: Props) {
  const hasVideo = Boolean(videoSrc.desktopMp4 || videoSrc.desktopWebm);
  return (
    <div className="absolute inset-0 overflow-hidden bg-primary-deep" aria-hidden={hasVideo ? "true" : undefined}>
      <div data-hero-media="" className="absolute inset-0 opacity-0">
        <div data-hero-parallax="" className="absolute inset-[-8%_0_-8%_0] will-change-transform">
          {hasVideo ? (
            <video
              className="h-full w-full object-cover [object-position:var(--hero-pos-m)] lg:[object-position:var(--hero-pos-d)]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterSrc}
              style={
                {
                  "--hero-pos-d": siteConfig.media.hero.objectPositionDesktop,
                  "--hero-pos-m": siteConfig.media.hero.objectPositionMobile,
                } as React.CSSProperties
              }
            >
              {videoSrc.mobileWebm && <source src={videoSrc.mobileWebm} type="video/webm" media="(max-width: 767px)" />}
              {videoSrc.mobileMp4 && <source src={videoSrc.mobileMp4} type="video/mp4" media="(max-width: 767px)" />}
              {videoSrc.desktopWebm && <source src={videoSrc.desktopWebm} type="video/webm" />}
              {videoSrc.desktopMp4 && <source src={videoSrc.desktopMp4} type="video/mp4" />}
            </video>
          ) : (
            // PLACEHOLDER: substituir por mídia real da clínica
            <Image
              src={fallbackImageSrc}
              alt={alt}
              fill
              priority
              sizes="100vw"
              className="object-cover [object-position:var(--hero-pos-m)] lg:[object-position:var(--hero-pos-d)]"
              style={
                {
                  "--hero-pos-d": siteConfig.media.hero.objectPositionDesktop,
                  "--hero-pos-m": siteConfig.media.hero.objectPositionMobile,
                } as React.CSSProperties
              }
            />
          )}
        </div>
      </div>
      {/* Overlay bordô profundo (≈62%) + vinheta editorial */}
      <div className="absolute inset-0 bg-primary-deep/[0.66]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(50,17,28,0.55)_0%,rgba(50,17,28,0.15)_55%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_100%,rgba(50,17,28,0.7),transparent_60%)]" />
    </div>
  );
}
