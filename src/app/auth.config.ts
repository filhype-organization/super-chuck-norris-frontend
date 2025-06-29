import { OpenIdConfiguration, LogLevel } from 'angular-auth-oidc-client';

const apiUrl = import.meta.env['NG_APP_API_URL'] || 'http://localhost:8080';
const authUrl = import.meta.env['NG_APP_AUTH_URL'] || 'http://localhost:8180';
const clientId = import.meta.env['NG_APP_CLIENT_ID'] || 'front';

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
