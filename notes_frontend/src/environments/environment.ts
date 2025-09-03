export interface AppEnvironment {
  /** Base URL for notes backend API (e.g., https://api.example.com). Should be set at runtime via window.__env.API_BASE_URL */
  API_BASE_URL: string;
}

// Narrow global typings without assuming browser at compile time
type EnvWindow = { __env?: Record<string, string | undefined> };

function readApiBase(): string {
  try {
    const maybeWindow = (globalThis as unknown as EnvWindow);
    const val = maybeWindow?.__env?.['API_BASE_URL'];
    return (typeof val === 'string' && val.length > 0) ? val : '/api';
  } catch {
    return '/api';
  }
}

/**
 * PUBLIC_INTERFACE
 */
export const environment: AppEnvironment = {
  API_BASE_URL: readApiBase()
};
