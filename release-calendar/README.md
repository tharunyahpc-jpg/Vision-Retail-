# Resul · Release Calendar

A layered implementation of the Resul Release Calendar (releases · sprints · leaves),
split into three clean layers from the original single-file HTML prototype:

```
release-calendar/
├── backend/      REST API  (Node + Express + PostgreSQL)
└── frontend/     Web client (vanilla JS, ES modules)
```

The frontend and backend share one contract — the exact REST shape the original
HTML expected:

| Method | Path                  | Body            | Returns                |
|--------|-----------------------|-----------------|------------------------|
| GET    | `/api/entries`        | —               | `[ Entry, … ]`         |
| GET    | `/api/entries/:id`    | —               | `Entry`                |
| POST   | `/api/entries`        | `Entry` (no id) | `201` + saved `Entry`  |
| PUT    | `/api/entries/:id`    | `Entry`         | saved `Entry`          |
| DELETE | `/api/entries/:id`    | —               | `204`                  |

### The `Entry` object (dates are `YYYY-MM-DD`)

```jsonc
// common
{ "id": "…", "type": "release|sprint|leave", "color": "#2f54eb",
  // release
  "functionalityName": "…", "version": "…", "releaseDate": "…",
  "module": "…", "releaseManager": "…", "releaseNotes": "…",
  // sprint
  "sprintName": "…", "goal": "…", "startDate": "…", "endDate": "…", "teamNotes": "…",
  // leave
  "developerName": "…", "leaveType": "…", "fromDate": "…", "toDate": "…",
  "duration": "full|first|second", "notes": "…" }
```

Only the fields for the entry's `type` are present.

---

## Backend (`backend/`)

A textbook layered architecture — each layer only knows about the one beneath it:

```
HTTP → routes → controllers → services → repositories → PostgreSQL
                                 │
                               models  (shape, validation, JSON↔row mapping)
                config (env, db pool) · middleware (errors, CORS)
```

| Layer        | Folder                | Responsibility                                   |
|--------------|-----------------------|--------------------------------------------------|
| Config       | `src/config`          | Env vars + the shared PG connection pool         |
| Routes       | `src/routes`          | URL → handler mapping                            |
| Controllers  | `src/controllers`     | HTTP ↔ service translation (no business logic)   |
| Services     | `src/services`        | Business rules, orchestration                    |
| Repositories | `src/repositories`    | **The only place with SQL**                      |
| Models       | `src/models`          | Entry shape, validation, camel↔snake mapping     |
| Middleware   | `src/middleware`      | Central error handler, 404                       |
| DB           | `src/db`              | `schema.sql`, `seed.sql`, `migrate.js`           |

### Run it

```bash
cd backend
cp .env.example .env          # then edit DB credentials
npm install
npm run migrate               # create tables/indexes/triggers
npm run seed                  # (optional) load the sample data
npm run dev                   # http://localhost:4000/api
```

### Database schema

A single `entries` table holds all three kinds (common columns always set,
type-specific columns nullable). See [`backend/src/db/schema.sql`](backend/src/db/schema.sql).
Dates are stored as `DATE`; an `updated_at` trigger keeps the timestamp fresh.

---

## Frontend (`frontend/`)

The original one-file app, refactored into layered ES modules — no build step,
no framework. Open `index.html` (via any static server) and it runs.

```
js/
├── config.js                 toggle demo ⇄ API
├── core/
│   ├── constants.js          palette, type metadata, demo seed
│   └── state.js              shared UI state
├── utils/
│   ├── date.js               date + entry helpers
│   ├── dom.js                esc / hexA / toast
│   └── icons.js              inline SVG icons
├── data/
│   └── store.js              ← data layer: localStorage OR REST
├── views/
│   ├── calendar.view.js      month grid w/ spanning bars
│   ├── list.view.js          grouped list
│   └── modal.view.js         add/edit form
├── app.js                    orchestration: render() + wiring
└── main.js                   entry point
```

### Run it

```bash
cd frontend
python3 -m http.server 8080   # or any static file server
# open http://localhost:8080
```

By default it runs in **demo mode** (browser `localStorage`, seeded with sample
data). To use the backend, edit `js/config.js`:

```js
export const CONFIG = { useApi: true, apiBase: 'http://localhost:4000/api' };
```

Make sure the backend's `CORS_ORIGIN` includes the frontend's origin
(e.g. `http://localhost:8080`).
