import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

import FormContato from '../../components/FormContato';
import { api, getErrorMessage } from '../../lib/api';
import { colors, globalStyles } from '../../styles/global';
import { Contato, ContatoInput } from '../../types/Contato';

export default function EditarContatoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [contato, setContato] = useState<Contato | null>(null);

  useEffect(() => {
    let ativo = true;

    api
      .get<Contato>(`/contatos/${id}`)
      .then(({ data }) => {
        if (ativo) setContato(data);
      })
      .catch((error) => {
        if (!ativo) return;
        Alert.alert('Erro', getErrorMessage(error, 'Contato não encontrado.'));
        router.back();
      });

    return () => {
      ativo = false;
    };
  }, [id, router]);

  async function handleSalvar(dados: ContatoInput) {
    try {
      await api.put(`/contatos/${id}`, dados);
      router.back();
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível salvar as alterações.'));
    }
  }

  if (!contato) {
    return (
      <View style={globalStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <FormContato initialValues={contato} onSubmit={handleSalvar} submitLabel="Salvar alterações" />;
}
