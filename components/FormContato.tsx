import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api, getErrorMessage, getImageUrl } from '../lib/api';
import { colors, globalStyles } from '../styles/global';
import { ContatoInput } from '../types/Contato';

interface UploadResponse {
  fileId: string;
  filename: string;
  contentType: string;
}

interface FormContatoProps {
  initialValues?: Partial<ContatoInput>;
  onSubmit: (dados: ContatoInput) => Promise<void>;
  submitLabel?: string;
}

export default function FormContato({ initialValues, onSubmit, submitLabel = 'Salvar' }: FormContatoProps) {
  const [nome, setNome] = useState(initialValues?.nome ?? '');
  const [email, setEmail] = useState(initialValues?.email ?? '');
  const [telefone, setTelefone] = useState(initialValues?.telefone ?? '');
  const [endereco, setEndereco] = useState(initialValues?.endereco ?? '');
  const [fotoId, setFotoId] = useState(initialValues?.fotoId ?? '');
  // URI local da imagem escolhida, usada no preview enquanto/depois do upload.
  const [fotoLocal, setFotoLocal] = useState<string | null>(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const previewUri = fotoLocal ?? getImageUrl(fotoId);

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso à galeria para escolher uma foto.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (resultado.canceled) return;

    await enviarFoto(resultado.assets[0]);
  }

  async function enviarFoto(asset: ImagePicker.ImagePickerAsset) {
    const type = asset.mimeType ?? 'image/jpeg';
    const extensao = type.split('/')[1] ?? 'jpg';
    const name = asset.fileName ?? `foto_${Date.now()}.${extensao}`;

    const formData = new FormData();
    // No React Native, o FormData aceita um objeto { uri, name, type } para arquivos.
    formData.append('foto', { uri: asset.uri, name, type } as unknown as Blob);

    setFotoLocal(asset.uri);
    setEnviandoFoto(true);
    try {
      const { data } = await api.post<UploadResponse>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFotoId(data.fileId);
    } catch (error) {
      setFotoLocal(null);
      Alert.alert('Erro no upload', getErrorMessage(error, 'Não foi possível enviar a foto.'));
    } finally {
      setEnviandoFoto(false);
    }
  }

  function removerFoto() {
    setFotoId('');
    setFotoLocal(null);
  }

  async function handleSubmit() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome é obrigatório.');
      return;
    }

    setSalvando(true);
    try {
      await onSubmit({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        fotoId,
      });
    } finally {
      setSalvando(false);
    }
  }

  const ocupado = enviandoFoto || salvando;

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={globalStyles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={escolherFoto} disabled={ocupado}>
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={globalStyles.photoPreview} />
          ) : (
            <View style={[globalStyles.photoPreview, globalStyles.avatarPlaceholder]}>
              <Text style={globalStyles.avatarInitial}>{nome.trim().charAt(0).toUpperCase() || '+'}</Text>
            </View>
          )}
        </Pressable>

        {enviandoFoto ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <View style={globalStyles.photoActions}>
            <Pressable onPress={escolherFoto} disabled={ocupado}>
              <Text style={globalStyles.link}>{previewUri ? 'Trocar foto' : 'Escolher foto'}</Text>
            </Pressable>
            {!!previewUri && (
              <Pressable onPress={removerFoto} disabled={ocupado}>
                <Text style={[globalStyles.link, { color: colors.danger }]}>Remover</Text>
              </Pressable>
            )}
          </View>
        )}

        <Text style={globalStyles.label}>Nome *</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Nome completo"
          placeholderTextColor={colors.placeholder}
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <Text style={globalStyles.label}>E-mail</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="email@exemplo.com"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={globalStyles.label}>Telefone</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="(11) 99999-9999"
          placeholderTextColor={colors.placeholder}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={globalStyles.label}>Endereço</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Rua, número, bairro"
          placeholderTextColor={colors.placeholder}
          value={endereco}
          onChangeText={setEndereco}
        />

        <Pressable
          style={({ pressed }) => [
            globalStyles.button,
            { marginTop: 8 },
            pressed && globalStyles.buttonPressed,
            ocupado && globalStyles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={ocupado}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={globalStyles.buttonText}>{enviandoFoto ? 'Enviando foto...' : submitLabel}</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
