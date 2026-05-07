import { OpenIdConfiguration, LogLevel } from 'angular-auth-oidc-client';


function getEnvVar(key: string, defaultValue: string): string {
  const ngxEnv = (globalThis as any)?._NGX_ENV_;
  return ngxEnv?.[key] || import.meta.env[key] || defaultValue;
}

const apiUrl = getEnvVar('NG_APP_API_URL', '');
const authUrl = getEnvVar('NG_APP_AUTH_URL', 'https://dev-lesson.eu.auth0.com');
const clientId = getEnvVar('NG_APP_CLIENT_ID', '');
const audience = getEnvVar('NG_APP_AUDIENCE', 'chuck-norris-api');

// authInterceptor uses req.url.startsWith(route).
// Proxy mode (apiUrl empty): HttpClient sends relative URLs → req.url = '/api/...'
//   → secureRoute must be '/api'
// Direct mode (apiUrl set):  HttpClient sends absolute URLs → req.url = 'http://host/...'
//   → secureRoute must be the full apiUrl
const secureRoute = apiUrl || '/api';

export const authConfig: OpenIdConfiguration = {
  authority: authUrl,
  redirectUrl: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  clientId: clientId,
  scope: 'openid profile email',
  responseType: 'code',
  useRefreshToken: true,
  renewTimeBeforeTokenExpiresInSeconds: 30,
  ignoreNonceAfterRefresh: true,
  logLevel: LogLevel.None,
  secureRoutes: [secureRoute],
  // Auth0 returns an opaque token when no audience is set; specifying it forces a JWT
  // that the backend can validate locally (QUARKUS_OIDC_TOKEN_VERIFY_ACCESS_TOKEN_WITH_USER_INFO=false)
  customParamsAuthRequest: { audience },
};
