# CleanCity AI — Backend (Manual Express Server)

This folder contains a **manually written Node.js + Express backend** that
talks to the same Supabase database used by the React frontend. It exists
so the project looks and runs like a normal full-stack app when opened in
VS Code.

> **Important:** The frontend in `/src` already works on its own through
> Lovable Cloud. This backend is an **additional, optional layer** that
> demonstrates a classic 3-tier architecture (React → Express → Database)
> for your report and viva.

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── server.js                  # App entry point
│   ├── config/
│   │   └── supabase.js            # Supabase client (service role)
│   ├── routes/
│   │   ├── reports.js             # /api/reports
│   │   ├── officers.js            # /api/officers
│   │   └── detect.js              # /api/detect (AI)
│   ├── controllers/
│   │   ├── reportsController.js
│   │   ├── officersController.js
│   │   └── detectController.js
│   └── middleware/
│       ├── logger.js
│       └── errorHandler.js
├── package.json
├── .env.example
└── README.md
```

---

## 🚀 Running locally (in VS Code)

```bash
cd backend
npm install
cp .env.example .env       # then fill in the values
npm run dev                # starts on http://localhost:5000
```

Get the values for `.env` from the root project's Lovable Cloud
Backend → Settings → API page.

---

## 🔌 API Endpoints

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| GET    | `/api/health`         | Health check                         |
| GET    | `/api/reports`        | List all garbage reports             |
| GET    | `/api/reports/:id`    | Get a single report                  |
| POST   | `/api/reports`        | Create a new report                  |
| PATCH  | `/api/reports/:id`    | Update status / assigned officer     |
| GET    | `/api/officers`       | List ward officers                   |
| POST   | `/api/officers`       | Create an officer                    |
| PATCH  | `/api/officers/:id`   | Update an officer                    |
| DELETE | `/api/officers/:id`   | Delete an officer                    |
| POST   | `/api/detect`         | Run AI garbage detection on an image |

### Example — detect garbage

```bash
curl -X POST http://localhost:5000/api/detect \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://example.com/photo.jpg"}'
```

Response:
```json
{
  "detected": true,
  "garbage_level": 0.7,
  "confidence": 0.92,
  "description": "Pile of mixed waste visible on the roadside."
}
```

---

## 🔄 How the frontend connects to this backend

By default the React frontend calls Lovable Cloud directly (works in
preview). To make it call **this manual backend** instead, set this env
var in the **root** `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Then the helper in `src/lib/api-client.ts` will route requests to your
local Express server. If the variable is empty, the app falls back to
Lovable Cloud — so nothing breaks in preview.

---

## 🧱 Architecture

```
┌─────────────┐    HTTP/JSON    ┌──────────────┐    SQL    ┌───────────┐
│  React App  │ ──────────────► │   Express    │ ────────► │ PostgreSQL│
│ (Vite + TS) │ ◄────────────── │   Backend    │ ◄──────── │ (Supabase)│
└─────────────┘                 └──────┬───────┘           └───────────┘
                                       │
                                       ▼
                                ┌──────────────┐
                                │ Lovable AI   │
                                │ (Gemini Vis.)│
                                └──────────────┘
```
