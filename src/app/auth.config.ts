import { OpenIdConfiguration, LogLevel } from 'angular-auth-oidc-client';

export const authConfig: OpenIdConfiguration = {
  authority: 'http://localhost:8180/realms/app',
  redirectUrl: window.location.origin,
  postLogoutRedirectUri: window.location.origin,
  clientId: 'front',
  scope: 'openid',
  disablePkce: false,
  responseType: 'code',
  useRefreshToken: true,
  logLevel: LogLevel.Debug
};
