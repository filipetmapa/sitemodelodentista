import { siteConfig } from "@/config/site";

/** Monta um link do WhatsApp com a mensagem codificada corretamente. */
export function whatsappLink(message: string): string {
  const number = siteConfig.contact.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const links = {
  booking: whatsappLink(siteConfig.messages.booking),
  emergency: whatsappLink(siteConfig.messages.emergency),
  evaluation: whatsappLink(siteConfig.messages.evaluation),
  treatment: (name: string) => whatsappLink(siteConfig.messages.treatment(name)),
  phone: `tel:${siteConfig.contact.phone.replace(/[^\d+]/g, "")}`,
  instagram: siteConfig.social.instagramUrl,
  /** Rota do Google Maps gerada a partir do endereço (somente no modo real). */
  mapsRoute: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.address.district}, ${siteConfig.address.city} - ${siteConfig.address.state}`,
  )}`,
  mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.address.district}, ${siteConfig.address.city} - ${siteConfig.address.state}`,
  )}&output=embed`,
};

/** Divide um texto com {palavra} em partes, marcando a palavra em caligrafia. */
export function splitScript(text: string, vars: Record<string, string> = {}) {
  const filled = text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));
  const parts: { text: string; script: boolean }[] = [];
  const re = /\{([^}]+)\}/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(filled))) {
    if (match.index > last) parts.push({ text: filled.slice(last, match.index), script: false });
    parts.push({ text: match[1], script: true });
    last = match.index + match[0].length;
  }
  if (last < filled.length) parts.push({ text: filled.slice(last), script: false });
  return parts;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
