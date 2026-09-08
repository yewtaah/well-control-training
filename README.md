# Well Control Training & Knowledge Sharing

Course platform for well control and oil & gas field readiness training —
the training/knowledge-sharing subdomain (`training.wellcommandassurance.com`)
of the [well-control](https://github.com/yewtaah/well-control) project.

Requires account registration (email + password via AWS Cognito) to access
course content.

## Stack

- [Next.js](https://nextjs.org) (App Router)
- TypeScript + Tailwind CSS
- [AWS Amplify Gen 2](https://docs.amplify.aws/) — Cognito-backed authentication
- Hosted on AWS Amplify Hosting (us-east-1)

## Getting Started

Install dependencies, then start a local Amplify sandbox backend (creates a
personal dev Cognito user pool and writes `amplify_outputs.json`):

```bash
npm install
npx ampx sandbox
```

In a separate terminal, run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be prompted to
create an account before seeing course content.

## Deployment

Connected to AWS Amplify Hosting. Pushes to `main` trigger `amplify.yml`,
which deploys the Cognito backend via `ampx pipeline-deploy` before building
the Next.js frontend.
