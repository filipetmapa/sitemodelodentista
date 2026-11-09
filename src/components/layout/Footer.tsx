import { siteConfig } from "@/config/site";
import { links } from "@/lib/links";
import { Wordmark } from "@/components/ui/Brand";
import { AnchorLink } from "./SmoothScrollProvider";

export function Footer() {
  const p = siteConfig.professional;
  const a = siteConfig.address;
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-primary-night text-bg" aria-label="Rodapé">
      <div className="h-px w-full bg-accent/60" aria-hidden="true" />
      <div className="container-site grid grid-cols-1 gap-14 py-20 md:grid-cols-3 md:gap-10">
        <div>
          <Wordmark size="md" />
          <p className="mt-6 max-w-[18rem] font-serif-italic text-[1.35rem] font-light italic leading-snug text-bg/85">{siteConfig.clinic.tagline}</p>
        </div>

        <div className="space-y-2 text-[0.9375rem] leading-relaxed text-bg/80">
          <p className="text-bg">
            {p.name} — {p.profession}
          </p>
          <p>{p.cro}</p>
          <p>
            {a.full}
            <br />
            {a.cityState}
          </p>
          <p>
            <a href={links.phone} className="hover:text-accent-soft">
              Telefone {siteConfig.contact.phoneDisplay}
            </a>
            <br />
            <a href={links.booking} target="_blank" rel="noopener noreferrer" className="hover:text-accent-soft">
              WhatsApp {siteConfig.contact.whatsappDisplay}
            </a>
          </p>
          <p>{siteConfig.hours.lines.join(" · ")}</p>
          <p>Urgências mediante disponibilidade.</p>
        </div>

        <nav aria-label="Links do rodapé">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-[0.9375rem]">
            {siteConfig.copy.nav.map((n) => (
              <li key={n.href}>
                <AnchorLink href={n.href} className="inline-flex min-h-[44px] items-center text-bg/80 hover:text-accent-soft">
                  {n.label}
                </AnchorLink>
              </li>
            ))}
            <li>
              <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir Instagram da ${siteConfig.clinic.name}`}
                className="inline-flex min-h-[44px] items-center text-bg/80 hover:text-accent-soft"
              >
                Instagram
              </a>
            </li>
            <li>
              <a href={links.booking} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-bg/80 hover:text-accent-soft">
                WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-accent-soft/15">
        <div className="container-site flex flex-col gap-3 py-8 text-[0.8125rem] text-bg/70 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>
              © {year} {siteConfig.clinic.name}. Todos os direitos reservados.
            </p>
            <p>
              Responsável técnica: {p.name} — {p.cro}.
            </p>
          </div>
          {siteConfig.isDemo && (
            <p className="inline-flex items-center gap-2 border border-accent/50 px-3 py-1.5 text-[0.8125rem] font-medium text-accent-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {siteConfig.copy.footer.demoNotice}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
