/**
 * Helper pour configurer l'environnement de test avec les variables _NGX_ENV_
 */
export class EnvironmentMock {
  private static readonly defaultEnvVars = {
    NG_APP_API_URL: '',
    NG_APP_AUTH_URL: 'http://localhost:8180',
    NG_APP_CLIENT_ID: 'test-client'
  };

  static setup(envVars: Record<string, string> = {}) {
    (globalThis as any)._NGX_ENV_ = { ...this.defaultEnvVars, ...envVars };
  }

  static cleanup() {
    (globalThis as any)._NGX_ENV_ = { ...this.defaultEnvVars };
  }
}
