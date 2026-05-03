# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server on port 4200
npm run build      # Production build → dist/front-chuck-norris/
npm run watch      # Watch mode build
npm test           # Run all tests via Vitest
```

To run a single test file:
```bash
npx vitest run src/app/services/joke.service.spec.ts
```

## Architecture

**Stack**: Angular 21 (standalone components), TypeScript, SCSS, Boosted (Orange Design System), Vitest.

**Auth**: OIDC Code Flow with PKCE via `angular-auth-oidc-client`. Configured in `src/app/auth.config.ts` using runtime env vars. The `authInterceptor` attaches tokens automatically. `authGuard` and `adminGuard` protect routes.

**State management**: Angular Signals in `JokeService` (`src/app/services/joke.service.ts`). All mutable state (`randomJoke`, `jokes`, `loading`, `error`, pagination) lives there as signals; derived state uses `computed()`. Components inject the service and read signals directly — no NgRx, no BehaviorSubjects.

**API layer**: `JokeAPI` (`src/app/api/JokeAPI.ts`) is a thin HTTP client for `/api/v1/jokes`. Pagination uses `?page=X&size=Y` query params and reads total count from the `X-Total-Count` response header. `JokeService` orchestrates calls and updates signals via `tap`/`catchError`.

**Routing** (`src/app/app.routes.ts`):
- `/` → `HomeComponent` (requires auth)
- `/admin-joke` → `JokeAdminComponent` (requires auth + admin role)
- `/admin-protected` → `AdminPanelComponent` (requires auth)
- `/unauthorized` → `UnauthorizedComponent`

**User roles**: `UserRoleService` (`src/app/services/user-role.service.ts`) extracts `userName` and `isAdmin` from the OIDC token. It handles multiple claim shapes (`upn`, `preferred_username`, `realm_access.roles`, `groups`) to stay compatible with different OIDC providers (Keycloak, etc.).

## Runtime Environment Variables

Variables are injected at container startup via `entrypoint.sh` into `ngx-env.js`, then read via the `@ngx-env/builder` adapter (prefix `NG_APP_`). In tests, use the `EnvironmentMock` helper from `src/test-helpers/` — `test-init.ts` is auto-imported by Vitest to set up `_NGX_ENV_` globals.

| Variable | Default |
|---|---|
| `NG_APP_API_URL` | `http://localhost:8080` |
| `NG_APP_AUTH_URL` | `http://localhost:8180` |
| `NG_APP_CLIENT_ID` | *(must be set)* |

## Deployment

The app is served by an Alpine Caddy container. The Dockerfile expects the build artifact at `target/artifact/front-chuck-norris/browser`. The CI workflow (`.github/workflows/github-actions.yml`) builds a multi-arch Docker image, pushes to `leeson77/chuck-norris-frontend`, and updates the IaC repo's image tag on merges to `main`/`dev`.
