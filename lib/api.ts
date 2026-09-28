import axios, { AxiosError } from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

export const API_URL = 'https://api-contatos-auth-04-09-25.onrender.com';

const TOKEN_KEY = 'auth_token';

// Cache em memória para não ler o SecureStore a cada requisição.
let authToken: string | null = null;

export const api = axios.create({
  baseURL: API_URL,
  // A API está no plano gratuito do Render: a primeira requisição pode levar ~50s (cold start).
  timeout: 60000,
});

export async function setAuthToken(token: string): Promise<void> {
  authToken = token;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function loadAuthToken(): Promise<string | null> {
  authToken = await SecureStore.getItemAsync(TOKEN_KEY);
  return authToken;
}

export async function clearAuthToken(): Promise<void> {
  authToken = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/** Monta a URL pública da imagem armazenada no GridFS. */
export function getImageUrl(fotoId?: string): string | undefined {
  return fotoId ? `${API_URL}/upload/${fotoId}` : undefined;
}

/** Extrai a mensagem de erro retornada pela API ({ mensagem }) ou uma mensagem padrão. */
export function getErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  if (axios.isAxiosError<{ mensagem?: string }>(error)) {
    if (error.response?.data?.mensagem) return error.response.data.mensagem;
    if (error.code === 'ECONNABORTED') return 'O servidor demorou para responder. Tente novamente.';
    if (!error.response) return 'Não foi possível conectar ao servidor.';
  }
  return fallback;
}

// Injeta o token JWT em todas as requisições.
api.interceptors.request.use(async (config) => {
  const token = authToken ?? (await loadAuthToken());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token expirado ou inválido: limpa a sessão e volta para o login.
let redirecionando = false;
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const enviouToken = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && enviouToken && !redirecionando) {
      redirecionando = true;
      await clearAuthToken();
      Alert.alert('Sessão expirada', 'Faça login novamente.');
      router.replace('/');
      redirecionando = false;
    }
    return Promise.reject(error);
  },
);
