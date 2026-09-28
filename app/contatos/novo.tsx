import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import FormContato from '../../components/FormContato';
import { api, getErrorMessage } from '../../lib/api';
import { ContatoInput } from '../../types/Contato';

export default function NovoContatoScreen() {
  const router = useRouter();

  async function handleCriar(dados: ContatoInput) {
    try {
      await api.post('/contatos', dados);
      router.back();
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível criar o contato.'));
    }
  }

  return <FormContato onSubmit={handleCriar} submitLabel="Criar contato" />;
}
