import { siteConfig } from "@/config/site";

/** Dados estruturados gerados somente a partir do arquivo de configuração. */
export function dentistSchema() {
  const a = siteConfig.address;
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: siteConfig.clinic.name,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.media.og}`,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.street}, ${a.complement}`,
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.postalCode || undefined,
      addressCountry: a.country,
    },
    ...(siteConfig.isDemo ? {} : { geo: { "@type": "GeoCoordinates", latitude: a.coordinates.lat, longitude: a.coordinates.lng } }),
    openingHoursSpecification: siteConfig.hours.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    employee: {
      "@type": "Person",
      name: siteConfig.professional.name,
      jobTitle: siteConfig.professional.profession,
    },
    sameAs: [siteConfig.social.instagramUrl, siteConfig.social.googleReviewsUrl].filter(Boolean),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: siteConfig.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function keywords() {
  const { city, state } = siteConfig.address;
  return [
    `dentista em ${city}`,
    `consultório odontológico ${city}`,
    `cirurgião-dentista ${city}`,
    `dentista em ${city} ${state}`,
    `urgência odontológica ${city}`,
  ];
}
