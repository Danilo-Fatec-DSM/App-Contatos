import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

import { loadAuthToken } from '../lib/api';
import { colors, globalStyles } from '../styles/global';

// Rotas acessíveis sem login: "/" (segmento vazio) e "/cadastro".
const ROTAS_PUBLICAS = ['cadastro'];

function isRotaPublica(segments: string[]): boolean {
  return segments.length === 0 || ROTAS_PUBLICAS.includes(segments[0]);
}

export default function RootLayout() {
  // O expo-secure-store não funciona no navegador: o app deve ser testado no Expo Go.
  if (Platform.OS === 'web') {
    return (
      <View style={globalStyles.centered}>
        <Text style={globalStyles.title}>Plataforma não suportada</Text>
        <Text style={globalStyles.subtitle}>
          Este app usa o SecureStore para guardar o token JWT e deve ser aberto no Expo Go (Android ou iOS).
        </Text>
      </View>
    );
  }

  return <AuthGuardedStack />;
}

function AuthGuardedStack() {
  const segments = useSegments() as string[];
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);

  // A cada mudança de rota, confere se existe token salvo no SecureStore.
  useEffect(() => {
    let ativo = true;

    (async () => {
      const token = await loadAuthToken();
      if (!ativo) return;

      const publica = isRotaPublica(segments);
      if (!token && !publica) {
        router.replace('/');
      } else if (token && publica) {
        // Usuário já logado não precisa ver login/cadastro.
        router.replace('/contatos');
      }
      setVerificando(false);
    })();

    return () => {
      ativo = false;
    };
  }, [segments, router]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
        <Stack.Screen name="contatos/index" options={{ title: 'Meus contatos' }} />
        <Stack.Screen name="contatos/novo" options={{ title: 'Novo contato' }} />
        <Stack.Screen name="contatos/[id]" options={{ title: 'Editar contato' }} />
      </Stack>

      {/* O Stack precisa estar montado para permitir o redirect; a sobreposição esconde a tela até a verificação terminar. */}
      {verificando && (
        <View style={[StyleSheet.absoluteFill, globalStyles.centered]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </>
  );
}
