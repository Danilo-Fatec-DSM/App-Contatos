import { useRouter } from 'expo-router';
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

import { api, getErrorMessage } from '../lib/api';
import { colors, globalStyles } from '../styles/global';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CadastroScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      Alert.alert('Atenção', 'Informe um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/usuarios/registrar', {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
      });
      Alert.alert('Conta criada', 'Agora faça login com seu e-mail e senha.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      Alert.alert('Erro no cadastro', getErrorMessage(error, 'Não foi possível criar a conta.'));
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
        <Text style={globalStyles.title}>Criar conta</Text>
        <Text style={globalStyles.subtitle}>Preencha seus dados</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Nome"
          placeholderTextColor={colors.placeholder}
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          textContentType="name"
        />
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
          placeholder="Senha (mínimo 6 caracteres)"
          placeholderTextColor={colors.placeholder}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          onSubmitEditing={handleCadastro}
        />

        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            pressed && globalStyles.buttonPressed,
            carregando && globalStyles.buttonDisabled,
          ]}
          onPress={handleCadastro}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={globalStyles.buttonText}>Cadastrar</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace('/')}>
          <Text style={globalStyles.link}>Já tenho conta. Entrar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
