import { OpenIdConfiguration, LogLevel } from 'angular-auth-oidc-client';

// Fonction utilitaire pour accéder aux variables d'environnement de manière sécurisée
function getEnvVar(key: string, defaultValue: string): string {
  const ngxEnv = (globalThis as any)?._NGX_ENV_;
  return ngxEnv?.[key] || import.meta.env[key] || defaultValue;
}

// Fonction pour obtenir l'origin de manière sécurisée (lazy-loaded)
function getWindowOrigin(): string {
  try {
    return typeof window !== 'undefined' && window?.location ? window.location.origin : 'http://localhost:4200';
  } catch (e) {
    return 'http://localhost:4200';
  }
}

const apiUrl = getEnvVar('NG_APP_API_URL', 'http://localhost:8080');
const authUrl = getEnvVar('NG_APP_AUTH_URL', 'http://localhost:8180');
const clientId = getEnvVar('NG_APP_CLIENT_ID', 'front');

// Créer la config de manière lazy pour éviter les problèmes en test
export function createAuthConfig(): OpenIdConfiguration {
  return {
    authority: `${authUrl}/realms/app`,
    redirectUrl: getWindowOrigin(),
    postLogoutRedirectUri: getWindowOrigin(),
    clientId: clientId,
    scope: 'openid',
    disablePkce: false,
    responseType: 'code',
    useRefreshToken: true,
    logLevel: LogLevel.Debug,
    secureRoutes: [apiUrl],
    silentRenew: true,
    silentRenewUrl: `${getWindowOrigin()}/silent-renew.html`,
    renewTimeBeforeTokenExpiresInSeconds: 30,
  };
}

// Exporter une variable pour backward compatibility
export const authConfig = createAuthConfig();
