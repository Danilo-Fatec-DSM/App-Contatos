import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from 'react-native';

import { api, getErrorMessage, setAuthToken } from '../lib/api';
import { colors, globalStyles } from '../styles/global';

interface LoginResponse {
  token: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Informe e-mail e senha.');
      return;
    }

    setCarregando(true);
    try {
      const { data } = await api.post<LoginResponse>('/usuarios/login', {
        email: email.trim().toLowerCase(),
        senha,
      });
      await setAuthToken(data.token);
      router.replace('/contatos');
    } catch (error) {
      Alert.alert('Erro ao entrar', getErrorMessage(error, 'E-mail ou senha inválidos.'));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={globalStyles.authContent} keyboardShouldPersistTaps="handled">
        <Text style={globalStyles.title}>Contatos</Text>
        <Text style={globalStyles.subtitle}>Entre com sua conta para continuar</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Senha"
          placeholderTextColor={colors.placeholder}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
          onSubmitEditing={handleLogin}
        />

        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            pressed && globalStyles.buttonPressed,
            carregando && globalStyles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={globalStyles.buttonText}>Entrar</Text>
          )}
        </Pressable>

        <Link href="/cadastro" style={globalStyles.link}>
          Não tem conta? Cadastre-se
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
