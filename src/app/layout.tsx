import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Garamond, Manrope } from "next/font/google";
import { siteConfig } from "@/config/site";
import { dentistSchema, faqSchema, keywords } from "@/lib/schema";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ScrollProgressDot } from "@/components/layout/ScrollProgressDot";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-serif",
});
// Itálico usado apenas em detalhes abaixo da dobra (sem preload)
const serifItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: "italic",
  display: "swap",
  preload: false,
  variable: "--font-serif-italic",
});
const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-sans" });
const script = Allura({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-script" });

const { copy } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: copy.seo.title,
  description: copy.seo.description,
  keywords: keywords(),
  applicationName: siteConfig.clinic.name,
  alternates: { canonical: "/" },
  // Modo demonstrativo: a marca fictícia não deve ser indexada
  robots: siteConfig.isDemo
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.clinic.name,
    title: copy.seo.title,
    description: copy.seo.description,
    images: [{ url: siteConfig.media.og, width: 1200, height: 630, alt: siteConfig.clinic.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.seo.title,
    description: copy.seo.description,
    images: [siteConfig.media.og],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#32111C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${serifItalic.variable} ${sans.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }} />
      </head>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SmoothScrollProvider>
          {children}
          <ScrollProgressDot />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
