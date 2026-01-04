import { OpenIdConfiguration, LogLevel } from 'angular-auth-oidc-client';

// Fonction pour obtenir l'origin de manière sécurisée (lazy-loaded)
function getWindowOrigin(): string {
  try {
    return typeof window !== 'undefined' && window?.location ? window.location.origin : 'http://localhost:4200';
  } catch (e) {
    return 'http://localhost:4200';
  }
}

// Accès direct aux variables d'environnement (requis pour esbuild - pas d'accès dynamique)
// En dev, apiUrl reste vide pour utiliser le proxy (/api -> https://chuck.filhype.ovh)
const apiUrl = import.meta.env.NG_APP_API_URL || '';
const authUrl = import.meta.env.NG_APP_AUTH_URL || 'http://localhost:8180/realms/app';
const clientId = import.meta.env.NG_APP_CLIENT_ID || 'front';

console.log('ENV DEBUG:', { apiUrl, authUrl, clientId });

// Créer la config de manière lazy pour éviter les problèmes en test
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
    logLevel: LogLevel.Debug,
    secureRoutes: [apiUrl],
    silentRenew: true,
    silentRenewUrl: `${getWindowOrigin()}/silent-renew.html`,
    renewTimeBeforeTokenExpiresInSeconds: 30,
  };
}

// Exporter une variable pour backward compatibility
export const authConfig = createAuthConfig();
