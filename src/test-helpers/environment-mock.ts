/**
 * Helper pour configurer l'environnement de test avec les variables _NGX_ENV_
 */
export class EnvironmentMock {
  static setup(envVars: Record<string, string> = {}) {
    const defaultEnvVars = {
      NG_APP_API_URL: '',
      NG_APP_AUTH_URL: 'http://localhost:8180',
      NG_APP_CLIENT_ID: 'test-client',
      ...envVars
    };
    
    (globalThis as any)._NGX_ENV_ = defaultEnvVars;
  }

  static cleanup() {
    delete (globalThis as any)._NGX_ENV_;
  }
}
