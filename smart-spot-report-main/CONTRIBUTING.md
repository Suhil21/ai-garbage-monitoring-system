# Contributing to CleanCity AI

Thanks for taking a look at this project! This is a 3rd-year college mini
project built by students. Below are simple steps to set it up locally and
contribute changes.

## Local Setup

### 1. Prerequisites

- Node.js 18 or newer
- npm (comes with Node.js)
- A code editor (VS Code recommended)

### 2. Clone and install

```bash
git clone <your-repo-url>
cd cleancity-ai
npm install
```

### 3. Environment variables

Copy `.env.example` to `.env` and fill in your backend credentials:

```bash
cp .env.example .env
```

Then open `.env` and paste the values from your backend project.

### 4. Run the development server

```bash
npm run dev
```

The app will start at http://localhost:8080

## Project Structure

```
cleancity-ai/
├── public/              # Static assets and project documentation
│   └── project-files/   # Algorithm notes, dataset info, model explanation
├── src/
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks (data fetching, feedback)
│   ├── lib/             # Business logic (classifier, hotspots, utils)
│   ├── pages/           # Route-level pages
│   └── integrations/    # Backend client setup
├── supabase/
│   └── functions/       # Serverless edge functions (Gemini Vision)
└── README.md
```

## Coding Style

- TypeScript everywhere
- Functional React components with hooks
- TailwindCSS for styling (use semantic tokens from `index.css`)
- Keep files small and focused (one concern per file)
- Comment any non-obvious logic for clarity

## Available Scripts

| Command           | Purpose                          |
|-------------------|----------------------------------|
| `npm run dev`     | Start the development server     |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview the production build     |
| `npm run lint`    | Run ESLint to check code quality |
| `npm test`        | Run unit tests with Vitest       |
