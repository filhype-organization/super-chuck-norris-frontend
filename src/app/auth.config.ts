import { OpenIdConfiguration, LogLevel } from 'angular-auth-oidc-client';

// Fonction utilitaire pour accéder aux variables d'environnement de manière sécurisée
function getEnvVar(key: string, defaultValue: string): string {
  const ngxEnv = (globalThis as any)?._NGX_ENV_;
  return ngxEnv?.[key] || import.meta.env[key] || defaultValue;
}

const apiUrl = getEnvVar('NG_APP_API_URL', 'http://localhost:8080');
const authUrl = getEnvVar('NG_APP_AUTH_URL', 'https://dev-lesson.eu.auth0.com');
const clientId = getEnvVar('NG_APP_CLIENT_ID', '');

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
  secureRoutes: [apiUrl],
};
