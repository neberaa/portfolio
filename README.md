# Anton Nebera

Portfolio for Anton Nebera, built with Next.js.

## Develop

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

`.env.example` lists `NEXT_PUBLIC_SITE_URL`. The app uses `http://localhost:3000` when that variable is unset.

## Checks

```bash
yarn test
yarn lint
yarn build
```

## Deploy

This is a standard Next.js app. Vercel detects Yarn from `yarn.lock` and runs `yarn build`.

Set `NEXT_PUBLIC_SITE_URL` in the Vercel project to the public origin, including `https` and without a trailing slash. The sitemap, robots file, and link previews use that value.

Production deploys should come from `main`. A pull request branch can be used for a Vercel preview first.
