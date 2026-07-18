This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

📦 1️⃣  Get the project on the new machine

  1. Copy the entire project folder (the one you just received) to your machine (e.g., via USB, cloud storage, or Git).
  2. Open a terminal / command prompt and cd into that folder.

  cd path/to/ai-study-companion   # <-- the root folder that contains backend/, frontend/, docker-compose.yml, etc.

  ⚙️  2️⃣  Run the backend (FastAPI) manually

  ▎ The backend is a standard FastAPI app. It can run in a virtualenv or directly with your system Python.

  a) (Optional) Create & activate a virtual environment

  # Windows
  python -m venv venv
  venv\Scripts\activate

  # macOS / Linux
  python3 -m venv venv
  source venv/bin/activate

  b) Install Python dependencies

  cd backend
  pip install -r requirements.txt

  c) Check / set environment variables

  The project already ships with a .env file in backend/.
  If you prefer to start from an example, copy it:

  cp .env.example .env   # (if .env.example exists)
  # Edit .env to add any required API keys (e.g., GOOGLE_API_KEY for the Generative AI service)

  d) Start the server

  uvicorn main:app 8010   # note: the Dockerfile exposes 8000; adjust if your .env says a different port

  You should see something like:

  INFO:     Uvicorn running on http://0.0.0.0:8010 (Press CTRL+C to quit)
  INFO:     Started reloader process [...]

  The API will be reachable at http://localhost:8010 (or the port you set).

  ---
  🎨 3️⃣  Run the frontend (Next.js) manually

  a) Install JavaScript dependencies

  cd ../frontend
  npm install          # or: yarn install  /  pnpm install  /  bun install

  b) Start the development server

  npm run dev          # or: yarn dev  /  pnpm dev  /  bun dev

  The Next.js app will start, typically on http://localhost:3000.
  Open that URL in your browser to use the UI.


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
