# Portfolio architecture

This document describes the implementation currently in the repository. It is intended as a concise engineering walkthrough rather than a claim that the site uses a larger architecture than it does.

## 1. Application shell and rendering

The site uses the Next.js App Router. The root layout in `src/app/layout.tsx` owns the document shell, global styles, local font variables, metadata, viewport theme color and Person JSON-LD structured data.

The home route in `src/app/page.tsx` composes the experience from a small set of layout and section components:

- `Header` and `ExploreRail` provide navigation and progress feedback.
- `ScreenDeck` hosts the ordered sequence of full-screen panels.
- Section components provide the content for the hero, about, skills, selected projects, leadership and contact.
- `SceneBackground` mounts the decorative WebGL layer after the hero text animation settles.

The page is composed in one route; the section sequence is not implemented as separate URL routes.

## 2. Content and presentation boundaries

Content and configuration are separated into `src/data`. For example, the ordered screen definitions live in `src/data/sections.ts`, while project content is typed against the shared `Project` type in `src/data/projects.ts`.

Reusable presentation primitives such as `Screen`, `Reveal`, `HoverCard`, `Eyebrow` and `MetaCopy` live under `src/components/ui`. Section-level components compose these primitives and consume typed data.

This keeps the project narrative and section ordering out of most of the presentation markup, while retaining straightforward React components rather than introducing a separate CMS or state-management layer.

## 3. Section navigation and scroll model

`SiteScroll` provides a React context containing the active section ID and a `scrollTo` function. `ScreenDeck` registers the navigation callback and owns the current panel index.

The deck supports several input paths:

- Header navigation buttons call the shared `scrollTo` function.
- Keyboard navigation maps Arrow Up/Down and Page Up/Down to adjacent sections, and Home/End to the first/last section.
- Wheel input is accumulated to a threshold before changing panels.
- Touch input uses a swipe threshold to move between panels.
- The current section is reflected in the URL hash using `history.replaceState`.

If the current panel contains a vertically scrollable `.section-scroll` region, wheel input is allowed to scroll that region before the deck advances to another section. The scroll helpers in `src/helpers/scroll.ts` isolate threshold, boundary and direction calculations from the event-handling component.

## 4. WebGL scene

The decorative background is implemented with React Three Fiber and Three.js in `src/components/webgl/scene-field.tsx`.

The scene builds a point field, a grid helper and a set of scene-specific geometric outlines. The active section selects the scene configuration. In the animation frame callback, the implementation updates point positions, shape geometry, opacity, scale, rotation and pointer-follow values.

A few implementation choices are worth noting:

- The WebGL field is hidden from assistive technology because it is decorative.
- The Canvas uses a device-pixel-ratio range of 1 to 1.5 and disables antialiasing.
- Point count and scene configuration can be reduced for compact viewports.
- Pointer-follow motion is enabled only for fine pointers.
- The frame callback exits while the document is hidden.
- Geometry and materials created for the field are explicitly disposed during cleanup.
- The field checks reduced-motion preference and WebGL support before mounting.

The field is intentionally a visual layer; the page content and navigation remain regular DOM elements.

## 5. Motion and accessibility

The site uses CSS classes for reveal and hero text animation, with Framer Motion available in the project for motion work. The background waits for the hero text animation to settle before it mounts.

The reduced-motion hook reads `prefers-reduced-motion` and subscribes to preference changes. The screen deck uses that preference to avoid applying its timed transition lock, and the WebGL field checks the preference before mounting.

Interactive navigation uses buttons and labelled navigation regions. The mobile menu exposes `aria-expanded`, `aria-controls`, and an inert/hidden closed state. Global `:focus-visible` styling is defined in the global stylesheet.

## 6. Styling and design system

Tailwind CSS 4 is imported in `src/app/globals.css`. The stylesheet also imports the project's design tokens, system styles and motion styles from `src/styles`.

Shared palette, spacing, typography and layout class definitions are centralised under `src/data/design`. Local font variables are loaded by the root layout.

## 7. Testing and quality checks

Vitest is configured with the jsdom environment and discovers tests under `src/tests`. The project scripts include:

```bash
yarn lint
yarn typecheck
yarn test
yarn build
```

The scroll and section helper modules are good candidates for focused unit tests because their calculations are isolated from browser event wiring. The GitHub Actions workflow runs linting, type-checking, tests and a production build for pushes and pull requests targeting `main`.

## 8. Boundaries and future improvements

The current implementation keeps navigation state in a small React context and uses local typed data. It does not introduce a global state library or a runtime CMS dependency for the portfolio itself.

Potential follow-up engineering work includes:

- Add browser-level tests for real wheel, touch, keyboard and hash-navigation behaviour.
- Verify the full reduced-motion experience in a browser, including changes to the OS preference while the page is open.
- Profile the WebGL scene on lower-powered mobile devices and tune point count using measured results.
- Confirm keyboard focus remains predictable when navigating between panels and opening/closing the mobile menu.
- Add a documented release/deployment process and check the canonical site URL configuration.

These are improvement opportunities, not claims that the current implementation is broken.
