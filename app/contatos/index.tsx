import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { api, clearAuthToken, getErrorMessage, getImageUrl } from '../../lib/api';
import { colors, globalStyles } from '../../styles/global';
import { Contato } from '../../types/Contato';

function Avatar({ contato }: { contato: Contato }) {
  const uri = getImageUrl(contato.fotoId);
  if (uri) {
    return <Image source={{ uri }} style={globalStyles.avatar} />;
  }
  return (
    <View style={[globalStyles.avatar, globalStyles.avatarPlaceholder]}>
      <Text style={globalStyles.avatarInitial}>{contato.nome.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

export default function ListaContatosScreen() {
  const router = useRouter();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregarContatos = useCallback(async () => {
    try {
      const { data } = await api.get<Contato[]>('/contatos');
      setContatos(data);
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar os contatos.'));
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  // Recarrega sempre que a tela ganha foco (ex.: ao voltar da criação/edição).
  useFocusEffect(
    useCallback(() => {
      carregarContatos();
    }, [carregarContatos]),
  );

  function confirmarExclusao(contato: Contato) {
    Alert.alert('Excluir contato', `Deseja excluir "${contato.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/contatos/${contato._id}`);
            await carregarContatos();
          } catch (error) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível excluir o contato.'));
          }
        },
      },
    ]);
  }

  function sair() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await clearAuthToken();
          router.replace('/');
        },
      },
    ]);
  }

  return (
    <View style={globalStyles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable onPress={sair} hitSlop={8}>
              <Text style={[globalStyles.headerButton, { color: colors.danger }]}>Sair</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.push('/contatos/novo')} hitSlop={8}>
              <Text style={globalStyles.headerButton}>+ Novo</Text>
            </Pressable>
          ),
        }}
      />

      {carregando ? (
        <View style={globalStyles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={contatos}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[globalStyles.content, contatos.length === 0 && { flexGrow: 1 }]}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregarContatos();
              }}
            />
          }
          ListEmptyComponent={
            <View style={globalStyles.centered}>
              <Text style={globalStyles.subtitle}>Nenhum contato cadastrado.</Text>
              <Pressable
                style={({ pressed }) => [globalStyles.button, pressed && globalStyles.buttonPressed, { paddingHorizontal: 24 }]}
                onPress={() => router.push('/contatos/novo')}
              >
                <Text style={globalStyles.buttonText}>Adicionar contato</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <Avatar contato={item} />
              <View style={globalStyles.cardInfo}>
                <Text style={globalStyles.cardTitle} numberOfLines={1}>
                  {item.nome}
                </Text>
                {!!item.telefone && <Text style={globalStyles.textMuted}>{item.telefone}</Text>}
                {!!item.email && (
                  <Text style={globalStyles.textMuted} numberOfLines={1}>
                    {item.email}
                  </Text>
                )}
                {!!item.endereco && (
                  <Text style={globalStyles.textMuted} numberOfLines={1}>
                    {item.endereco}
                  </Text>
                )}
              </View>
              <View style={globalStyles.cardActions}>
                <Pressable
                  style={({ pressed }) => [globalStyles.smallButton, pressed && globalStyles.buttonPressed]}
                  onPress={() => router.push(`/contatos/${item._id}`)}
                >
                  <Text style={globalStyles.smallButtonText}>Editar</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    globalStyles.smallButton,
                    globalStyles.buttonDanger,
                    pressed && globalStyles.buttonPressed,
                  ]}
                  onPress={() => confirmarExclusao(item)}
                >
                  <Text style={globalStyles.smallButtonText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
