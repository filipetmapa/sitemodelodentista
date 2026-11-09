/**
 * ARQUIVO DE CONFIGURAÇÃO CENTRAL — Orvelle Odontologia
 *
 * Todo o conteúdo editável do site vem daqui. Os componentes apenas
 * apresentam estes dados.
 *
 * PROJETO DEMONSTRATIVO: a marca, a profissional e todos os dados abaixo
 * são fictícios. Para converter em um projeto de cliente real:
 *   1. substitua cada campo marcado com "DEMO: substituir por dado real";
 *   2. troque as mídias marcadas com "PLACEHOLDER";
 *   3. defina `isDemo: false`.
 * Nunca invente informações profissionais.
 */

export type Treatment = {
  name: string;
  description: string;
  image?: string;
};

export type Step = { title: string; text: string };

export type FaqItem = { question: string; answer: string };

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

const isDemo = true; // DEMO: definir como false em um projeto real

const clinic = {
  name: "Orvelle Odontologia", // DEMO: substituir por dado real
  brandWord: "Orvelle", // DEMO: substituir por dado real
  tagline: "Odontologia com atenção aos detalhes.",
};

const professional = {
  name: "Dra. Helena Orvelle", // DEMO: substituir por dado real
  signature: "Helena Orvelle", // DEMO: substituir por dado real
  profession: "Cirurgiã-Dentista",
  // Especialidade só pode ser divulgada se registrada no CRO.
  cro: "CRO-XX 00000", // DEMO: substituir por dado real
  // Campo opcional: só é renderizado quando preenchido com dados confirmados.
  qualifications: [] as string[], // DEMO: substituir por dado real
};

const address = {
  street: "Avenida Exemplo, 000", // DEMO: substituir por dado real
  complement: "Sala 00", // DEMO: substituir por dado real
  district: "Bairro Exemplo", // DEMO: substituir por dado real
  city: "Cidade Exemplo", // DEMO: substituir por dado real
  state: "UF", // DEMO: substituir por dado real
  postalCode: "", // DEMO: substituir por dado real
  country: "BR",
  // Coordenadas só são usadas no modo real (isDemo: false).
  coordinates: { lat: 0, lng: 0 }, // DEMO: substituir por dado real
};

const contact = {
  // Somente dígitos, com DDI e DDD. O link do WhatsApp é montado a partir daqui.
  whatsapp: "5500000000000", // DEMO: substituir por dado real
  whatsappDisplay: "+55 00 00000-0000", // DEMO: substituir por dado real
  phone: "+5500000000000", // DEMO: substituir por dado real
  phoneDisplay: "+55 00 00000-0000", // DEMO: substituir por dado real
};

const social = {
  instagramHandle: "@orvelle.demo", // DEMO: substituir por dado real
  instagramUrl: "https://www.instagram.com/orvelle.demo", // DEMO: substituir por dado real
  // URL pública do perfil no Google. Vazia no modo demonstrativo.
  googleReviewsUrl: "", // DEMO: substituir por dado real
};

const hours = {
  // DEMO: horários fictícios, substituir por dado real
  lines: ["Segunda a sexta, das 8h às 19h", "Sábado, das 8h às 12h"],
  // Formato schema.org (usado no JSON-LD).
  schema: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "19:00" },
    { days: ["Saturday"], opens: "08:00", closes: "12:00" },
  ], // DEMO: substituir por dado real
  emergency: "Atendimento de urgência mediante disponibilidade — consulte pelo WhatsApp", // DEMO: substituir por dado real
  emergencyShort: "Atendimento de urgência mediante disponibilidade.", // DEMO: substituir por dado real
};

const messages = {
  booking: "Olá! Encontrei seu site e gostaria de agendar uma consulta.",
  emergency:
    "Olá! Preciso de atendimento odontológico de urgência. Poderia me orientar sobre a disponibilidade?",
  evaluation: "Olá! Gostaria de agendar uma avaliação odontológica.",
  treatment: (name: string) => `Olá! Gostaria de saber mais sobre ${name}.`,
};

// DEMO: confirmar tratamentos realmente oferecidos pelo cliente
const treatments: Treatment[] = [
  { name: "Consulta e avaliação", description: "Um momento para entender suas necessidades e orientar os próximos passos." },
  { name: "Prevenção e limpeza", description: "Cuidados periódicos para a saúde da boca, dos dentes e da gengiva." },
  { name: "Restaurações", description: "Recuperação da forma e da função dos dentes, com atenção à naturalidade." },
  { name: "Clareamento dental", description: "Procedimento indicado após avaliação profissional, conforme cada caso." },
  { name: "Lentes e facetas", description: "Possibilidades estéticas discutidas a partir de uma avaliação individualizada." },
  { name: "Urgências odontológicas", description: "Orientação e atendimento conforme a disponibilidade da agenda." },
];

const pillars: Step[] = [
  { title: "Atenção individualizada", text: "Cada paciente é ouvido com calma, e cada orientação considera a sua história." },
  { title: "Planejamento do atendimento", text: "As etapas do cuidado são explicadas com clareza antes de qualquer decisão." },
  { title: "Cuidado em cada etapa", text: "Do primeiro contato ao acompanhamento, cada detalhe recebe a mesma atenção." },
  { title: "Acolhimento e orientação", text: "Um ambiente pensado para que você se sinta à vontade para perguntar e entender." },
];

const journey: Step[] = [
  { title: "Primeiro contato", text: "Entre em contato pelo WhatsApp para tirar dúvidas e solicitar seu agendamento." },
  { title: "Avaliação", text: "Um momento dedicado à compreensão das suas necessidades odontológicas." },
  { title: "Planejamento", text: "As possibilidades de cuidado são apresentadas e discutidas conforme a avaliação profissional." },
  { title: "Acompanhamento", text: "Orientações e acompanhamento conforme as necessidades do tratamento." },
];

const fullAddress = `${address.street} — ${address.complement} — ${address.district}`;
const cityState = `${address.city} — ${address.state}`;

const faq: FaqItem[] = [
  {
    question: "Como posso agendar uma consulta?",
    answer:
      "Você pode agendar pelo WhatsApp, tocando em qualquer botão de agendamento desta página. A equipe responde com as opções de horário disponíveis.",
  },
  {
    question: "Onde fica o consultório?",
    answer: `O consultório fica na ${fullAddress}, ${cityState}. Você encontra o mapa e o botão de rota logo abaixo.`,
  },
  {
    question: "Qual é o horário de atendimento?",
    answer: `${hours.lines.join(" · ")}. Para urgências, consulte a disponibilidade pelo WhatsApp.`,
  },
  {
    question: "Existe atendimento de urgência?",
    answer: "Sim, mediante disponibilidade. Envie uma mensagem pelo WhatsApp para receber orientações.",
  },
  {
    question: "Como posso saber quais tratamentos são indicados para mim?",
    answer:
      "A indicação depende de uma avaliação odontológica individualizada. Na consulta, a profissional explica as possibilidades para o seu caso.",
  },
  {
    question: "A primeira consulta é uma avaliação?",
    answer: "Sim. O primeiro atendimento é dedicado a entender suas necessidades e orientar os próximos passos.",
  },
  {
    question: "Preciso levar algo na primeira consulta?",
    answer: "Se tiver exames ou radiografias recentes, leve-os. Eles ajudam na avaliação.",
  },
];

const media = {
  hero: {
    // Deixe vazio para usar o fallback fotográfico.
    videoSrc: {
      desktopWebm: "", // PLACEHOLDER: substituir por mídia real da clínica
      desktopMp4: "", // PLACEHOLDER: substituir por mídia real da clínica
      mobileWebm: "", // PLACEHOLDER: substituir por mídia real da clínica
      mobileMp4: "", // PLACEHOLDER: substituir por mídia real da clínica
    },
    posterSrc: "/media/hero/hero-fallback.webp", // PLACEHOLDER: substituir por mídia real da clínica
    fallbackImageSrc: "/media/hero/hero-fallback.webp", // PLACEHOLDER: substituir por mídia real da clínica
    fallbackAlt: "Textura de mármore claro sob luz de estúdio, com um arco de porcelana desfocado",
    // Foto da profissional exibida na hero, sobre o fundo atual.
    // Ideal: PNG com fundo removido (recorte), vertical, com pelo menos 1600px de altura.
    portraitSrc: "", // PLACEHOLDER: foto real da profissional
    portraitWidth: 1200,
    portraitHeight: 1600,
    portraitAlt: "Dra. Helena Orvelle, cirurgiã-dentista", // DEMO: substituir por dado real
    objectPositionDesktop: "60% 40%",
    objectPositionMobile: "72% 50%",
  },
  about: {
    // Vazio = placeholder elegante com monograma (nunca uma foto de banco como a profissional).
    photoSrc: "", // PLACEHOLDER: substituir por foto profissional real
    photoAlt: "Retrato da Dra. Helena Orvelle", // DEMO: substituir por dado real
  },
  toothFallback: "/media/3d/dente-porcelana.webp",
  pillarsFallback: [
    "/media/3d/pilar-01.webp",
    "/media/3d/pilar-02.webp",
    "/media/3d/pilar-03.webp",
    "/media/3d/pilar-04.webp",
  ],
  og: "/media/og/og-orvelle.png",
  // PLACEHOLDER: substituir por fotos reais do consultório
  gallery: [
    { src: "/media/gallery/consultorio-01.webp", width: 1280, height: 1600, alt: "Superfície de mármore claro com veios suaves sob luz natural", caption: "Imagem ilustrativa" },
    { src: "/media/gallery/consultorio-02.webp", width: 1440, height: 900, alt: "Parede clara com um arco em sombra atravessado por um feixe de luz", caption: "Imagem ilustrativa" },
    { src: "/media/gallery/consultorio-03.webp", width: 1440, height: 900, alt: "Três esferas de porcelana sobre fundo creme", caption: "Imagem ilustrativa" },
    { src: "/media/gallery/consultorio-05.webp", width: 1280, height: 1600, alt: "Detalhe de mármore com veios ondulados e reflexos dourados", caption: "Imagem ilustrativa" },
    { src: "/media/gallery/consultorio-04.webp", width: 2200, height: 900, alt: "Ambiente neutro com parede clara e luz natural diagonal", caption: "Imagem ilustrativa" },
  ] as GalleryImage[],
};

const copy = {
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Tratamentos", href: "#tratamentos" },
    { label: "Consultório", href: "#consultorio" },
    { label: "Contato", href: "#contato" },
  ],
  hero: {
    eyebrow: "Dra. Helena Orvelle — Cirurgiã-Dentista",
    // A palavra entre {chaves} é exibida em caligrafia dourada.
    headline: "A excelência está em cada detalhe do seu {sorriso}.",
    subtitle: "Odontologia com atenção aos detalhes, cuidado individualizado e dedicação ao seu sorriso.",
    primaryCta: "Agendar minha consulta",
    secondaryCta: "Conheça a profissional",
    emergencyNote: "Urgências odontológicas: consulte a disponibilidade pelo WhatsApp.",
    scrollLabel: "Role para descobrir",
  },
  about: {
    eyebrow: "Conheça a profissional",
    headline: "O cuidado começa muito antes do sorriso.",
    paragraphs: [
      "Cada atendimento é uma oportunidade de oferecer atenção, escuta e um cuidado odontológico pensado para as necessidades de cada paciente.",
      "No consultório da Dra. Helena Orvelle, cada consulta começa por uma conversa. Entender sua rotina, suas dúvidas e suas expectativas é parte do cuidado.",
    ],
    cta: "Agendar uma avaliação",
    photoPlaceholder: "Foto profissional",
  },
  treatments: {
    eyebrow: "Tratamentos",
    headline: "Cada sorriso merece um cuidado único.",
    subtitle: "Conheça os cuidados e tratamentos odontológicos disponíveis.",
    itemCta: "Saber mais pelo WhatsApp",
    cta: "Agendar minha consulta",
  },
  differentials: {
    eyebrow: "A experiência Orvelle",
    headline: "Uma experiência pensada nos detalhes.",
  },
  gallery: {
    eyebrow: "O consultório",
    headline: "Um ambiente pensado para acolher você.",
    text: "Conheça o espaço de atendimento e saiba mais sobre a estrutura do consultório.",
  },
  journey: {
    eyebrow: "Sua jornada",
    headline: "Seu cuidado, em cada etapa.",
    cta: "Dar o primeiro passo",
  },
  emergency: {
    ring: "Urgências odontológicas · Urgências odontológicas · ",
    headline: "Imprevistos acontecem. O cuidado não pode esperar.",
    text: "Precisa de atendimento odontológico de urgência? Entre em contato para receber orientações sobre a disponibilidade.",
    cta: "Solicitar atendimento de urgência",
  },
  trust: {
    eyebrow: "Confiança",
    headline: "Transparência em cada informação.",
    reviewsEmpty: "Espaço reservado para avaliações públicas do Google.",
    reviewsCta: "Ver avaliações no Google",
  },
  faq: {
    eyebrow: "Dúvidas",
    headline: "Algumas respostas para você.",
  },
  location: {
    eyebrow: "Localização",
    headline: "Esperamos por você em {city}.",
    mapCaption: "Mapa ilustrativo",
    routeCta: "Ver localização",
    routeDisabledTip: "Disponível com endereço real",
    bookCta: "Agendar consulta",
  },
  finalCta: {
    headline: "O primeiro passo para o seu novo {sorriso} começa aqui.",
    subtitle: "Entre em contato e agende sua avaliação odontológica.",
    cta: "Agendar minha consulta",
    emergencyLink: "Precisa de atendimento de urgência?",
    instagramLink: "Acompanhe no Instagram",
  },
  footer: {
    demoNotice: "Projeto demonstrativo — marca fictícia",
  },
  seo: {
    title: `${professional.name} | ${professional.profession} em ${address.city} ${address.state}`,
    description: `Conheça o atendimento odontológico da ${professional.name} em ${address.city}. Agende sua consulta pelo WhatsApp.`,
  },
};

export const siteConfig = {
  isDemo,
  // URL pública do site (usada em canonical, sitemap e Open Graph).
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://orvelle-demo.vercel.app", // DEMO: substituir por dado real
  locale: "pt_BR",
  clinic,
  professional,
  address: { ...address, full: fullAddress, cityState },
  contact,
  social,
  hours,
  messages,
  treatments,
  pillars,
  journey,
  faq,
  media,
  copy,
  identity: {
    colors: {
      primary: "#581C2B",
      primaryDeep: "#32111C",
      accent: "#C5A46D",
      accentSoft: "#E0CCAA",
      bg: "#F7F4EE",
      text: "#292321",
      white: "#FFFFFF",
    },
    fonts: { serif: "Cormorant Garamond", sans: "Manrope", script: "Allura" },
  },
};

export type SiteConfig = typeof siteConfig;
