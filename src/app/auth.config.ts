import { OpenIdConfiguration, LogLevel } from 'angular-auth-oidc-client';

// Fonction utilitaire pour accéder aux variables d'environnement de manière sécurisée
function getEnvVar(key: string, defaultValue: string): string {
  const ngxEnv = (globalThis as any)?._NGX_ENV_;
  return ngxEnv?.[key] || import.meta.env[key] || defaultValue;
}

const apiUrl = getEnvVar('NG_APP_API_URL', 'http://localhost:8080');
const authUrl = getEnvVar('NG_APP_AUTH_URL', 'http://localhost:8180');
const clientId = getEnvVar('NG_APP_CLIENT_ID', 'front');

export const authConfig: OpenIdConfiguration = {
  authority: `${authUrl}/realms/app`,
  redirectUrl: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  clientId: clientId,
  scope: 'openid',
  disablePkce: false,
  responseType: 'code',
  useRefreshToken: true,
  logLevel: LogLevel.Debug,
  secureRoutes: [apiUrl],
  silentRenew: true,
  silentRenewUrl: `${window.location.origin}/silent-renew.html`,
  renewTimeBeforeTokenExpiresInSeconds: 30,
};
