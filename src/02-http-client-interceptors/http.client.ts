import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

export interface AuthTokenStorage {
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  clearTokens: () => void;
}

export interface HttpClientOptions {
  baseURL: string;
  tokenStorage: AuthTokenStorage;
  refreshTokenFn: () => Promise<string>;
  onAuthFailure?: () => void;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function createHttpClient(options: HttpClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL: options.baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
  }> = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else if (token) {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  // 1. Intercepteur de requête : injection automatique du Bearer Token
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = options.tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 2. Intercepteur de réponse : gestion du 401 + Silent Refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return client(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newAccessToken = await options.refreshTokenFn();
          options.tokenStorage.setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          options.tokenStorage.clearTokens();
          options.onAuthFailure?.();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}
