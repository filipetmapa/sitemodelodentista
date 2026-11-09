import { siteConfig } from "@/config/site";
import { links } from "@/lib/links";
import { RevealText } from "@/components/ui/RevealText";
import { DotTrack } from "@/components/layout/ScrollProgressDot";
import { GoogleReviews } from "./GoogleReviews";

export function TrustSection() {
  const c = siteConfig.copy.trust;
  const p = siteConfig.professional;
  const a = siteConfig.address;
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Profissional", value: `${p.name} — ${p.profession}` },
    { label: "Clínica", value: siteConfig.clinic.name },
    { label: "Registro", value: p.cro },
    { label: "Endereço", value: `${a.full} · ${a.cityState}` },
    {
      label: "Contatos",
      value: (
        <span className="flex flex-col gap-1">
          <a className="underline-offset-4 hover:underline" href={links.booking} target="_blank" rel="noopener noreferrer">
            WhatsApp {siteConfig.contact.whatsappDisplay}
          </a>
          <a className="underline-offset-4 hover:underline" href={links.phone}>
            Telefone {siteConfig.contact.phoneDisplay}
          </a>
          <a className="underline-offset-4 hover:underline" href={links.instagram} target="_blank" rel="noopener noreferrer">
            Instagram {siteConfig.social.instagramHandle}
          </a>
        </span>
      ),
    },
    { label: "Horários", value: <span className="flex flex-col">{siteConfig.hours.lines.map((l) => <span key={l}>{l}</span>)}</span> },
  ];
  if (p.qualifications.length) {
    rows.push({
      label: "Formação",
      value: <span className="flex flex-col">{p.qualifications.map((q) => <span key={q}>{q}</span>)}</span>,
    });
  }

  return (
    <section id="confianca" aria-labelledby="confianca-title" data-dot-section="rail" className="relative bg-bg py-28 md:py-36 lg:py-44">
      <DotTrack />
      <div className="container-site relative grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6 text-primary">{c.eyebrow}</p>
          <RevealText id="confianca-title" text={c.headline} className="h2 max-w-[13ch] text-primary-deep" />
          <dl className="mt-14 border-t border-accent-soft">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-1 gap-1 border-b border-accent-soft py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <dt className="eyebrow pt-1 text-ink/70">{r.label}</dt>
                <dd className="text-[1rem] leading-relaxed text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <GoogleReviews url={siteConfig.social.googleReviewsUrl} />
        </div>
      </div>
    </section>
  );
}
