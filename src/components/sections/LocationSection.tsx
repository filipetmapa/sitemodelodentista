import { MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { links } from "@/lib/links";
import { RevealText } from "@/components/ui/RevealText";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { DotTrack } from "@/components/layout/ScrollProgressDot";
import { StylizedMap } from "./StylizedMap";

export function LocationSection() {
  const c = siteConfig.copy.location;
  const a = siteConfig.address;
  const realMap = !siteConfig.isDemo;
  return (
    <section id="contato" aria-labelledby="contato-title" data-dot-section="rail" className="noise relative bg-primary-deep py-28 text-bg md:py-36 lg:py-44">
      <DotTrack />
      <div className="container-site relative grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6 text-accent-soft">{c.eyebrow}</p>
          <RevealText id="contato-title" text={c.headline} vars={{ city: a.city }} className="h2 max-w-[13ch] text-bg" />

          <address className="mt-12 space-y-7 not-italic">
            <div>
              <p className="eyebrow mb-2 text-accent-soft/80">Endereço</p>
              <p className="text-[1.0625rem] leading-relaxed text-bg/90">
                {a.street}
                <br />
                {a.complement} — {a.district}
                <br />
                {a.cityState}
              </p>
            </div>
            <div>
              <p className="eyebrow mb-2 text-accent-soft/80">Horários</p>
              {siteConfig.hours.lines.map((l) => (
                <p key={l} className="text-[1.0625rem] leading-relaxed text-bg/90">
                  {l}
                </p>
              ))}
            </div>
            <div>
              <p className="eyebrow mb-2 text-accent-soft/80">Contato</p>
              <p className="text-[1.0625rem] leading-relaxed text-bg/90">
                <a href={links.phone} className="underline-offset-4 hover:underline">
                  Telefone {siteConfig.contact.phoneDisplay}
                </a>
                <br />
                <a href={links.booking} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  WhatsApp {siteConfig.contact.whatsappDisplay}
                </a>
              </p>
            </div>
          </address>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            {realMap ? (
              <a href={links.mapsRoute} target="_blank" rel="noopener noreferrer" className="btn-outline text-bg hover:bg-accent hover:text-primary-deep">
                <MapPin size={16} strokeWidth={1.4} aria-hidden="true" /> {c.routeCta}
              </a>
            ) : (
              <span className="group relative inline-flex">
                <button
                  type="button"
                  disabled
                  aria-describedby="route-tip"
                  className="btn-outline cursor-not-allowed border-accent/40 text-bg/60"
                >
                  <MapPin size={16} strokeWidth={1.4} aria-hidden="true" /> {c.routeCta}
                </button>
                <span
                  id="route-tip"
                  role="tooltip"
                  className="pointer-events-none absolute -top-11 left-0 whitespace-nowrap bg-bg px-3 py-1.5 text-[0.75rem] text-primary-deep opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  {c.routeDisabledTip}
                </span>
              </span>
            )}
            <a href={links.booking} target="_blank" rel="noopener noreferrer" className="btn-gold">
              <WhatsAppIcon size={17} /> {c.bookCta}
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
          {realMap ? (
            <figure>
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-accent/40">
                <iframe
                  title={`Mapa de localização — ${siteConfig.clinic.name}`}
                  src={links.mapsEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </figure>
          ) : (
            <StylizedMap caption={c.mapCaption} />
          )}
        </div>
      </div>
    </section>
  );
}
