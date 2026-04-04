# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (requires env vars — see below)
ng serve

# Build
ng build                          # production
ng build --configuration development

# Tests
ng test                           # all tests, with Karma watch
ng test --include='**/JokeAPI.spec.ts'   # single spec file
```

## Required environment variables

Before running `ng serve` or tests that exercise auth, set:

```bash
export NG_APP_API_URL="http://localhost:8080"   # backend REST API; empty string uses dev proxy
export NG_APP_AUTH_URL="http://localhost:8180"  # Keycloak realm URL (e.g. .../realms/app)
export NG_APP_CLIENT_ID="front"
```

In development without a local backend, the proxy (`proxy.conf.json`) forwards `/api` → `https://chuck.filhype.ovh`, so leaving `NG_APP_API_URL` empty works out of the box.

At runtime (Docker/production), the build injects env vars through `_NGX_ENV_` (the `@ngx-env/builder` pattern). `JokeAPI` checks `globalThis._NGX_ENV_.NG_APP_API_URL` first, then falls back to the build-time value from `import.meta.env`.

## Architecture

This is an **Angular 21 standalone application** (no NgModules). It uses `@ngx-env/builder` instead of the default Angular builder, which enables injecting env vars at build time via `import.meta.env.NG_APP_*` and at container startup via `_NGX_ENV_`.

### Layer separation

| Layer | Location | Responsibility |
|---|---|---|
| API | `src/app/api/` | Raw HTTP calls (`JokeAPI`). Returns Observables. Reads `_NGX_ENV_` for the base URL. |
| Service | `src/app/services/` | State management using Angular signals (`JokeService`). Auth/role state (`UserRoleService`). |
| Components | `src/app/components/` | UI only; inject services. |
| Guards | `src/app/guards/` | `authGuard` (OIDC check + redirect to login), `adminGuard` (checks `UserRoleService.userInfo$` for `isAdmin`). |

### Authentication

Authentication uses `angular-auth-oidc-client` with Keycloak. The OIDC config lives in `src/app/auth.config.ts`. The `authInterceptor()` from the library automatically attaches Bearer tokens to HTTP requests for routes listed in `secureRoutes`.

`UserRoleService` wraps `OidcSecurityService` and normalises several Keycloak token structures (`groups`, `roles`, `realm_access.roles`, `resource_access[clientId].roles`) into a single `UserInfo` object. Always use `UserRoleService` rather than reading from `OidcSecurityService` directly.

### Signals pattern

`JokeService` manages all joke state with private `signal()`s exposed as read-only `computed()` properties. Components read `jokeService.jokes()`, `jokeService.loading()`, etc. without subscribing manually. Do not add `BehaviorSubject`/`ReplaySubject` to this service — keep the signals pattern consistent.

### Routes

```
/                  → HomeComponent          (authGuard)
/admin-joke        → JokeAdminComponent     (authGuard + adminGuard)
/admin-protected   → AdminPanelComponent    (authGuard)
/unauthorized      → UnauthorizedComponent  (public)
/forbidden         → UnauthorizedComponent  (public)
```

### UI

Uses **Boosted** (Orange's Bootstrap fork) via `node_modules/boosted`. Custom styles are in `src/styles.scss`.

## Testing

Spec files must import `../../test-helpers/test-init` as the first line (initialises `globalThis._NGX_ENV_` before any service is instantiated). Use `EnvironmentMock.setup()`/`EnvironmentMock.cleanup()` in `beforeEach`/`afterEach` to control env vars per test. The backend is mocked with `HttpClientTestingModule` + `HttpTestingController`; do not use a real HTTP client in unit tests.
