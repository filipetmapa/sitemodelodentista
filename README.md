# Orvelle Odontologia — landing page (projeto demonstrativo)

Landing page de conversão para uma clínica odontológica de alto padrão, com estética editorial de luxo
(Bordô & Ouro), animações cinematográficas, ponto dourado narrativo ligado ao scroll e um dente 3D em
porcelana renderizado com Three.js.

> **Projeto demonstrativo.** A marca "Orvelle Odontologia", a "Dra. Helena Orvelle" e todos os dados
> (CRO, endereço, telefone, horários) são fictícios. O rodapé exibe "Projeto demonstrativo — marca fictícia"
> e a página sai com `noindex, nofollow` enquanto `isDemo: true`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · GSAP + ScrollTrigger + MotionPathPlugin ·
Motion for React · Three.js + React Three Fiber + Drei · Lenis · Lucide.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (inclui lint e checagem de tipos)
npm run start
```

Requer Node.js 18.18+ (recomendado 20 ou 22).

## Onde editar os dados

Tudo o que é texto ou dado editável fica em **`src/config/site.ts`**:

- `isDemo` — liga/desliga o modo demonstrativo;
- profissional, clínica, CRO, `qualifications` (só aparece se preenchido);
- endereço, cidade/UF, coordenadas;
- WhatsApp (somente dígitos, com DDI e DDD), telefone, Instagram, `googleReviewsUrl`;
- horários e informação de urgência;
- mensagens de WhatsApp (agendamento, urgência, avaliação, tratamento);
- tratamentos, pilares, etapas da jornada, FAQ;
- caminhos de mídia e todos os textos das seções.

Todo dado fictício está marcado com `// DEMO: substituir por dado real`; toda mídia provisória, com
`// PLACEHOLDER`. Os links do WhatsApp são montados a partir do número do arquivo de configuração
(`src/lib/links.ts`), com `encodeURIComponent`.

As cores ficam em variáveis CSS em `src/app/globals.css` (hex + canais RGB usados pelo Tailwind).

## Substituir imagens e vídeos

Organização em `public/media`:

| Pasta | Conteúdo |
| --- | --- |
| `hero/` | fallback fotográfico e poster da hero |
| `about/` | foto profissional (ainda vazia: o site mostra um placeholder com monograma) |
| `gallery/` | fotos do consultório (hoje: texturas ilustrativas, sem pessoas) |
| `3d/` | imagens pré-renderizadas do dente e dos objetos (fallback sem WebGL / reduced motion) |
| `og/` | imagem Open Graph 1200×630 |
| `public/models/` | reservado para um `.glb` (Draco, até ~300 KB) se o dente procedural for trocado |

- **Hero:** preencha `media.hero.videoSrc` (WebM + MP4, versões desktop e mobile, até ~4 MB) e
  `posterSrc`. Com o vídeo vazio, a hero usa `fallbackImageSrc` com parallax e zoom.
- **Foto da profissional:** coloque o arquivo em `public/media/about/` e preencha `media.about.photoSrc`.
- **Galeria:** troque os arquivos e os textos `alt` em `media.gallery` (a legenda "Imagem ilustrativa"
  só aparece no modo demonstrativo).

### Montagem sugerida de takes para o vídeo da hero

1. Close cinematográfico da profissional.
2. Cena do ambiente de trabalho.
3. Detalhes das mãos e instrumentos.
4. Atendimento ou interação profissional.
5. Novo take da profissional.

## Desativar o modo demonstrativo

1. Substitua todos os campos `DEMO` e `PLACEHOLDER` por dados e mídias reais e confirmados.
2. Confirme com o cliente a lista de tratamentos e se há atendimento de urgência (remova
   `EmergencySection` de `src/app/page.tsx` se não houver).
3. Defina `isDemo: false`. Com isso:
   - o aviso do rodapé e as legendas "Imagem ilustrativa" somem;
   - a página fica indexável (`robots`, `robots.txt`);
   - a seção de localização passa a usar o iframe do Google Maps e o botão de rota;
   - o botão de avaliações do Google é habilitado se `googleReviewsUrl` estiver preenchido.
4. Defina `NEXT_PUBLIC_SITE_URL` (na Vercel) com o domínio final, usado em canonical, sitemap e OG.

Nunca invente formação, especialidades, números, depoimentos ou avaliações (Código de Ética
Odontológica e resoluções de publicidade do CFO).

## Publicar

1. Crie um repositório no GitHub e envie este projeto:
   ```bash
   git remote add origin https://github.com/<usuario>/<repositorio>.git
   git push -u origin main
   ```
2. Na Vercel, **Add New → Project → Import** o repositório (framework detectado: Next.js).
3. A cada push na `main`, a Vercel publica automaticamente.

## Arquitetura

```
src/
  app/            layout (fontes, metadata, JSON-LD), page, robots, sitemap, ícone
  config/site.ts  dados e textos editáveis
  lib/            links do WhatsApp, tokens de motion, registro do GSAP, schema, hooks
  components/
    layout/       Navbar, MobileMenu, SmoothScrollProvider (Lenis), ScrollProgressDot, Footer
    sections/     Hero, HeroMedia, About, Treatments, Differentials, ClinicGallery,
                  PatientJourney, Emergency, Trust, GoogleReviews, FAQ, Location, StylizedMap, FinalCTA
    three/        Canvas único (Drei View), cenas procedurais, fallback estático
    ui/           MagneticButton, RevealText, Lightbox, FloatingButtons, ícones, wordmark
```

### Ponto dourado narrativo

`ScrollProgressDot` é montado uma vez no layout. Cada seção marcada com `data-dot-section` traz um
`<svg data-dot-svg>`; a trajetória é gerada a partir de âncoras do layout (`data-dot-anchor`) e
recalculada a cada `ScrollTrigger.refresh` (resize, fontes, imagens). O ponto se move com
`MotionPathPlugin.getPositionOnPath`, a linha é desenhada com `stroke-dashoffset` e tudo volta ao rolar
para cima. No mobile, o ponto percorre uma linha vertical fixa a 12px da borda; com
`prefers-reduced-motion`, fica estático e as linhas aparecem já desenhadas.

### 3D

Um único `<Canvas>` fixo (carregado com `next/dynamic` quando a seção de tratamentos se aproxima)
desenha as cenas nas regiões das `<View>` do Drei. O loop pausa quando nenhuma seção 3D está visível;
`dpr` é limitado e a geometria é simplificada no mobile e em aparelhos com poucos núcleos. Sem WebGL
ou com reduced motion, são exibidas as imagens de `public/media/3d`.
