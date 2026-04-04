// Ce fichier initialise l'environnement de test
// Doit être importé au début de chaque fichier spec

// Initialiser _NGX_ENV_ au niveau global
if (!(globalThis as any)._NGX_ENV_) {
  (globalThis as any)._NGX_ENV_ = {
    NG_APP_API_URL: '',
    NG_APP_AUTH_URL: 'http://localhost:8180',
    NG_APP_CLIENT_ID: 'test-client'
  };
}
