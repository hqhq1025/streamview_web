# Base Experiment Site Constitution

## Core Principles

### I. Cookie-Scoped State Isolation
- Every request MUST resolve a user cookie (default `user_id`) and access only that user's state.
- Clients MUST include cookies in API calls; the backend MUST issue a cookie when missing.
- Do not add authentication or shared/global state unless a feature explicitly requires it and
  documents the scope change.
Rationale: Isolation keeps experiments safe, reproducible, and predictable for concurrent users.

### II. Preserve /state-manage as the Canonical Interface
- The `/state-manage` page MUST exist with both the documentation tab and the live editor tab.
- The interface MUST continue to read, patch, replace, and reset per-user state.
- Extensions are allowed, but the core controls and guidance MUST remain visible and usable.
Rationale: This is the single reliable control surface for inspecting and updating state.

### III. API and MCP Contract Stability
- Core REST routes and response shapes MUST remain backward compatible:
  `GET/PUT/PATCH/DELETE /api/state`, `GET /api/info`, `GET /api/health`,
  `POST/GET /api/files`, and `GET /api/files/{filename}`.
- The `/mcp` tools MUST mirror REST behavior and semantics.
- Breaking changes require a migration plan, versioned contracts, and a MAJOR version bump.
Rationale: External clients and automation depend on stable contracts.

### IV. Documentation Is Part of the Interface
- When contracts, state shape change, update `docs/API.md`, `docs/STATE.md`, and `README.md` in the same change.
- Examples MUST match real payloads and behavior.
Rationale: Documentation is the primary integration surface for users and agents.

### V. Testability and Quality Gates
- Backend route changes MUST include pytest coverage for success, error shape, and cookie behavior.
- Frontend view or API helper changes MUST include vitest coverage for primary flows and errors.
- Tests MUST run offline with mocked network dependencies.
Rationale: Reliable tests protect the cookie-scoped contract and core UX.

## Platform & Architecture Constraints

- The backend remains a FastAPI service exposing cookie-scoped state and the async `StateStore`
  contract (`get_state`, `replace_state`, `patch_state`, `reset_state`, `delete_state`).
- The frontend remains a Vite + React client (or equivalent) that calls the API with cookies and
  honors `VITE_API_BASE` for deployments.
- Deployments MUST route `/api` and `/mcp` to the backend, with CORS configured for the UI origin.
- The state envelope (`meta`, `data`, `note`) and metadata semantics (created/updated timestamps,
  version counter) MUST be preserved.
- File uploads are stored server-side and referenced by URL; legacy base64 uploads remain supported
  unless explicitly deprecated with a migration plan.

## Delivery Workflow & Quality Gates

- Changes to state data or metadata MUST update backend models/schemas and the frontend
  `/state-manage` preview/editor to stay aligned.
- Use `PATCH /api/state` for iterative updates and populate `note` to describe the change context.
- Every spec/plan MUST include a constitution check and record any required violations with
  rationale and a rollback plan.
- Release readiness requires verifying `/api/docs`, `/state-manage`, and `/api/info` still work.

## Governance

- This constitution supersedes other practices; if work conflicts, amend the constitution first.
- Amendments require: a written proposal, impact analysis, migration plan (if breaking), and
  updates to dependent templates/docs in the same change.
- Versioning follows semantic rules: MAJOR for incompatible contract or principle changes, MINOR
  for new principles/sections or substantive policy expansion, PATCH for clarifications.
- Compliance review occurs during plan/spec creation and before merge; reviewers must confirm
  constitution gates are met or explicitly waived with justification.
