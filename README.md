# Anton Nebera — Portfolio

A personal portfolio for **Anton Nebera**, Frontend Tech Lead, Engineer and Product Builder.

The site presents selected engineering work, frontend architecture, technical leadership and the approach behind building maintainable product experiences.

- **Portfolio:** https://neberaanton.me
- **LinkedIn:** https://www.linkedin.com/in/anton-nebera-9a8232185/
- **Contact:** neberaanton@gmail.com

## Overview

The portfolio is designed as a sequence of full-screen sections with a minimal dark visual system, cyan accents and restrained motion.

### Highlights

- Responsive portfolio experience built with Next.js and React
- Typed content separated from presentation components
- Reusable layout, section and UI components
- Custom section navigation, scroll progress and keyboard interaction
- WebGL particle field using React Three Fiber and Three.js
- Reduced-motion and WebGL capability checks
- SEO metadata, sitemap, robots rules and Person structured data
- Unit/component tests with Vitest and Testing Library

## Technology

| Area | Technologies |
| --- | --- |
| Framework | Next.js, React |
| Language | TypeScript |
| Styling | Tailwind CSS 4, CSS design tokens |
| Motion | Framer Motion, custom CSS transitions |
| 3D / WebGL | Three.js, React Three Fiber |
| Icons | Lucide React |
| Testing | Vitest, Testing Library, jsdom |
| Code quality | ESLint |

## Project structure

```text
src/
├── app/              # App Router routes, metadata, sitemap and global styles
├── components/
│   ├── layout/       # Header, section navigation and scroll container
│   ├── sections/     # Hero, about, skills, projects, leadership and contact
│   ├── ui/           # Reusable presentation components
│   └── webgl/        # Three.js / React Three Fiber background
├── data/             # Portfolio content, skills, projects and design tokens
├── fonts/            # Local font files
├── helpers/          # Small reusable utilities
├── hooks/            # Scroll, section and motion hooks
├── styles/           # Design system and motion styles
├── tests/            # Unit and component tests
└── types/            # Shared TypeScript types
```

## Getting started

### Requirements

- Node.js (use an active LTS release)
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run the Vitest test suite once |

## Engineering notes

### Content and presentation

Portfolio copy, project details, skills, section definitions and design measurements live in `src/data`. Components consume this data so content can be updated without rewriting layout and presentation code.

### Motion and accessibility

The experience includes reduced-motion checks. The WebGL field is not mounted when WebGL is unavailable or the user requests reduced motion. Interactive controls include keyboard/focus behaviour and semantic labels where appropriate.

### WebGL background

The ambient particle field is implemented with React Three Fiber and Three.js. It uses a bounded point count, avoids rendering while the document is hidden, and disposes its geometries and materials on unmount.

## Quality checks

Before merging changes, run:

```bash
npm run lint
npm test
npm run build
```

## Deployment

The project is built with Next.js and can be deployed to a compatible Node.js or managed Next.js hosting platform. Set `NEXT_PUBLIC_SITE_URL` to the canonical public site URL in the deployment environment so metadata and sitemap URLs resolve correctly.

## About

I am a Frontend Tech Lead with 9+ years of experience building web applications, leading frontend squads and delivering scalable frontend architecture across multiple product domains.

For professional enquiries, connect via [LinkedIn](https://www.linkedin.com/in/anton-nebera-9a8232185/) or [email](mailto:neberaanton@gmail.com).
