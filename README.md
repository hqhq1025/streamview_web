# Base Experiment Site

Cookie-scoped StreamView-style mock app built with FastAPI (backend) and Vite + React (frontend). Each visitor gets an isolated state slice tracked via a cookie; state can be read, replaced, patched, or reset through well-documented APIs and a UI that mirrors common video platform flows.

## Quick start

Backend (uv):

```bash
cd backend
uv venv
uv pip install -r requirements.txt
uv run uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev -- --host --port 5173
```

Open the frontend at http://localhost:5173. The UI calls the backend at `http://localhost:8000/api` (overridable via `VITE_API_BASE`).

## Docker compose
```bash
docker compose up --build
```
Open http://localhost (nginx reverse proxy). It routes `/api` and `/mcp` to the backend and everything else to the production frontend container.

## Highlights
- Per-user state keyed by cookie; no login required.
- REST endpoints for state lifecycle (`GET/PUT/PATCH/DELETE /api/state`) plus system info and health.
- StreamView action endpoints under `/api/streamview/*` for likes, subscriptions, playlists, comments, and history.
- MCP server (Streamable HTTP) mounted at `/mcp` exposing both state and StreamView action tools; accepts `user_cookie` to target a specific state.
- You can pin identity via querystring `?cookie=your-id` on any API call; the backend will also set that as the response cookie.
- Frontend uses the StreamView mock design with custom CSS (no Tailwind dependency).
- Initial state includes an example Hugging Face file URL (no verification) plus the StreamView mock dataset.
- Small file uploads can be stored directly in state as base64 (see `API.md`).
- Auto-generated OpenAPI docs at `/api/docs` and curated `API.md`.
- Extensible patterns documented in `docs/EXTENDING.md`.

## Repository layout
- `backend/`: FastAPI app, config, and state store.
- `frontend/`: Vite + React UI with API client.
- `docs/`: Guides for extending the backend/frontend and experiments.
- `API.md`: Endpoint reference with examples.
- `AGENT.md`: Notes for automation/agent integrations.
- MCP Streamable HTTP endpoint at `/mcp` (tools: `get_state`, `replace_state`, `patch_state`, `reset_state`, `info`, plus StreamView action tools).

## Testing
- Backend (uv): `cd backend && uv pip install -r requirements.txt pytest pytest-asyncio httpx && uv run pytest`
- Frontend: recommended stack `vitest` + Testing Library (see `docs/TESTING.md` for setup).

## Environment variables
- `API_PREFIX` (default `/api`)
- `COOKIE_NAME` (default `user_id`)
- `COOKIE_MAX_AGE` (seconds, default 30d)
- `CORS_ORIGINS` (JSON list, default `["http://localhost:5173"]`)
- `DEBUG` (boolean)

Set them in `backend/.env` (see `backend/.env.example`).

## Development tips
- Use `ruff`/`black` (optional) for backend formatting; `eslint`/`prettier` for frontend.
- Keep API shapes in sync with `API.md` and `STATE.md`; run the app and verify Swagger UI after changes.
