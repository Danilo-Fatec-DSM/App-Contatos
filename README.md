# Contatos

Aplicativo mobile de agenda de contatos feito com Expo e React Native. O usuário cria uma conta, faz login e gerencia seus próprios contatos (nome, e-mail, telefone, endereço e foto). Os dados ficam em uma API REST com autenticação JWT.

## Funcionalidades

- Cadastro de usuário com validação de e-mail e senha (mínimo de 6 caracteres)
- Login com token JWT salvo de forma segura no dispositivo (`expo-secure-store`)
- Proteção de rotas: sem token, o usuário volta para o login; com token, vai direto para a lista
- Listagem de contatos com avatar, "puxar para atualizar" e estado vazio
- Criação, edição e exclusão de contatos (exclusão com confirmação)
- Foto do contato escolhida da galeria (`expo-image-picker`) e enviada para a API
- Logout e tratamento de sessão expirada (resposta 401 limpa o token e volta para o login)

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Expo SDK 57 | Base do projeto |
| React Native 0.86 / React 19 | Interface |
| Expo Router | Navegação baseada em arquivos |
| Axios | Requisições HTTP com interceptors |
| expo-secure-store | Armazenamento do token JWT |
| expo-image-picker | Seleção de fotos da galeria |
| TypeScript | Tipagem |

## Estrutura do projeto

```
app/
  _layout.tsx          Stack de navegação e verificação de autenticação
  index.tsx            Tela de login
  cadastro.tsx         Tela de criação de conta
  contatos/
    index.tsx          Lista de contatos
    novo.tsx           Criação de contato
    [id].tsx           Edição de contato
components/
  FormContato.tsx      Formulário reutilizado na criação e na edição
lib/
  api.ts               Cliente Axios, gestão do token e tratamento de erros
styles/
  global.ts            Cores e estilos compartilhados
types/
  Contato.ts           Tipos Contato e ContatoInput
assets/                Ícones e splash
```

## API

O app consome a API hospedada em:

```
https://api-contatos-auth-04-09-25.onrender.com
```

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/usuarios/registrar` | Cria um usuário (`nome`, `email`, `senha`) |
| POST | `/usuarios/login` | Autentica e retorna `{ token }` |
| GET | `/contatos` | Lista os contatos do usuário |
| GET | `/contatos/:id` | Busca um contato |
| POST | `/contatos` | Cria um contato |
| PUT | `/contatos/:id` | Atualiza um contato |
| DELETE | `/contatos/:id` | Remove um contato |
| POST | `/upload` | Envia uma foto (campo `foto`, multipart) e retorna `fileId` |
| GET | `/upload/:fileId` | Retorna a imagem armazenada |

As rotas de contatos e upload exigem o cabeçalho `Authorization: Bearer <token>`, que o app adiciona automaticamente. Para usar outra API, altere a constante `API_URL` em [lib/api.ts](lib/api.ts).

A API está no plano gratuito do Render, então a primeira requisição pode levar cerca de 50 segundos enquanto o servidor inicia. Por isso o timeout do Axios é de 60 segundos.

## Como executar

Pré-requisitos: Node.js instalado e o app Expo Go no celular (Android ou iOS).

```bash
npm install
npx expo start --tunnel
```

Escaneie o QR code exibido no terminal com o Expo Go. O celular e o computador precisam estar na mesma rede.

A versão web não é suportada, pois o `expo-secure-store` não funciona no navegador. Ao abrir no navegador, o app exibe um aviso.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run android` | Abre no Android |
| `npm run ios` | Abre no iOS |
| `npx tsc --noEmit` | Verifica os tipos |

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).
