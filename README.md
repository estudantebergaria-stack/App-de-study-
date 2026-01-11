<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Focus - Aplicativo de Estudo

Aplicativo de estudo com foco em produtividade, agora com sincronização na nuvem via Firebase!

View your app in AI Studio: https://ai.studio/apps/drive/1V4VPKDMp-YuCZSsamenll_Mn0BuApp4C

## Funcionalidades

- ⏱️ Timer Pomodoro e Cronômetro
- 📊 Estatísticas de estudo
- 🎯 Metas semanais
- 📝 Registro de questões
- 🏆 Sistema de conquistas
- ☁️ **Sincronização na nuvem com Firebase**
- 🔐 **Autenticação de usuários**
- 📱 Acesso em múltiplos dispositivos

## Configuração

**Prerequisites:** Node.js

### 1. Instalação de Dependências

```bash
npm install
```

### 2. Configuração do Firebase (Opcional)

O aplicativo funciona **sem Firebase** usando apenas armazenamento local (IndexedDB). Para habilitar a sincronização na nuvem:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative **Authentication** (Email/Password)
3. Ative **Cloud Firestore**
4. Copie as credenciais do seu projeto
5. Crie um arquivo `.env.local` na raiz do projeto (use `.env.local.example` como referência):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

**Nota:** Se você não configurar o Firebase, o app funcionará normalmente no modo local.

### 3. Executar o Aplicativo

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Build para Produção

```bash
npm run build
```

## Modo de Operação

### Sem Firebase Configurado
- Todos os dados são salvos localmente no navegador usando IndexedDB
- Os dados ficam disponíveis apenas no dispositivo atual

### Com Firebase Configurado
- **Usuários não autenticados:** funcionamento local (como acima)
- **Usuários autenticados:** dados sincronizados em tempo real com Firestore
- Acesso aos dados em qualquer dispositivo após fazer login

## Tecnologias

- React 19
- TypeScript
- Vite
- Firebase (Auth + Firestore)
- Lucide Icons
- Recharts
