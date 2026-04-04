import { OpenIdConfiguration, LogLevel } from 'angular-auth-oidc-client';

function getWindowOrigin(): string {
  try {
    return typeof window !== 'undefined' && window?.location ? window.location.origin : 'http://localhost:4200';
  } catch (e) {
    return 'http://localhost:4200';
  }
}

const apiUrl = import.meta.env.NG_APP_API_URL || '';
const authUrl = import.meta.env.NG_APP_AUTH_URL || 'http://localhost:8180/realms/app';
const clientId = import.meta.env.NG_APP_CLIENT_ID || 'front';

export function createAuthConfig(): OpenIdConfiguration {
  return {
    authority: authUrl,
    redirectUrl: getWindowOrigin(),
    postLogoutRedirectUri: getWindowOrigin(),
    clientId: clientId,
    scope: 'openid offline_access',
    disablePkce: false,
    responseType: 'code',
    useRefreshToken: true,
    logLevel: import.meta.env.PROD ? LogLevel.Warn : LogLevel.Debug,
    secureRoutes: [apiUrl],
    silentRenew: true,
    silentRenewUrl: `${getWindowOrigin()}/silent-renew.html`,
    renewTimeBeforeTokenExpiresInSeconds: 30,
  };
}

export const authConfig = createAuthConfig();
