import { Star } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Avaliações do Google: recebe apenas a URL pública do perfil.
 * Nunca copia avaliações, notas ou trechos — apenas direciona para a fonte.
 */
export function GoogleReviews({ url }: { url: string }) {
  const c = siteConfig.copy.trust;
  const enabled = Boolean(url) && !siteConfig.isDemo;
  return (
    <div className="relative border border-accent p-8 md:p-10">
      <span className="absolute inset-2 border border-accent-soft/60" aria-hidden="true" />
      <div className="relative flex flex-col items-start gap-6">
        <Star size={26} strokeWidth={1} className="text-accent-ink" aria-hidden="true" />
        <p className="font-serif text-[1.6rem] font-light leading-snug text-primary-deep">
          {enabled ? "Veja as avaliações públicas no perfil do Google." : c.reviewsEmpty}
        </p>
        {enabled ? (
          <a href={url} target="_blank" rel="noopener" className="btn-outline text-primary-deep hover:bg-primary-deep hover:text-bg">
            {c.reviewsCta}
          </a>
        ) : (
          <button type="button" disabled aria-disabled="true" className="btn-outline cursor-not-allowed border-accent-soft text-ink/70">
            {c.reviewsCta}
          </button>
        )}
      </div>
    </div>
  );
}
