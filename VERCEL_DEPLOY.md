# Deploy no Vercel - Focus App

Este guia explica como fazer o deploy do aplicativo Focus na plataforma Vercel.

## Configuração Automática

O arquivo `vercel.json` já está configurado com:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **SPA Routing**: Configurado com rewrites

## Passos para Deploy

### 1. Conectar ao GitHub

1. Acesse [Vercel](https://vercel.com)
2. Faça login ou crie uma conta
3. Clique em "Add New Project"
4. Selecione "Import Git Repository"
5. Escolha este repositório: `jeffinberg-ops/App-de-estudo-`

### 2. Configurar Variáveis de Ambiente

Na configuração do projeto Vercel, adicione as seguintes **Environment Variables**:

```
VITE_FIREBASE_API_KEY=AIzaSyAjWlY7uK5IFe6cSEGoPBa9coRYyqikC2s
VITE_FIREBASE_AUTH_DOMAIN=app-de-estudo-9d621.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=app-de-estudo-9d621
VITE_FIREBASE_STORAGE_BUCKET=app-de-estudo-9d621.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=190438381990
VITE_FIREBASE_APP_ID=1:190438381990:web:a624c02d62cde1225a5767
```

**Importante:** Configure estas variáveis para todos os ambientes (Production, Preview, Development)

### 3. Configurações do Build

A Vercel detectará automaticamente as configurações do `vercel.json`:

- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `dist`
- ✅ **Install Command**: `npm install`
- ✅ **Development Command**: `npm run dev`

Não é necessário alterar nada se o `vercel.json` estiver presente.

### 4. Deploy

1. Clique em "Deploy"
2. Aguarde o build finalizar (2-5 minutos)
3. Acesse o link fornecido pela Vercel

## Configuração Manual (Se Necessário)

Se você preferir configurar manualmente ou se o `vercel.json` não for detectado:

### Framework Preset
- Selecione: **Vite**

### Build & Development Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Root Directory
- Deixe em branco (ou `.` para raiz do projeto)

## Domínio Personalizado

Para adicionar um domínio personalizado:

1. Vá em "Settings" > "Domains"
2. Adicione seu domínio
3. Configure os DNS conforme instruções da Vercel

## Atualizações Automáticas

Após o primeiro deploy:
- ✅ **Push para main/master**: Deploy automático em produção
- ✅ **Pull Requests**: Preview deployments automáticos
- ✅ **Outros branches**: Preview deployments opcionais

## Verificação Pós-Deploy

Após o deploy, verifique:

1. ✅ Página de login carrega corretamente
2. ✅ Login com e-mail/senha funciona
3. ✅ Login com Google funciona
4. ✅ Dados sincronizam com Firestore
5. ✅ App funciona offline (após primeiro acesso)

## Configuração do Firebase para Vercel

### Adicionar Domínio Autorizado

No [Console do Firebase](https://console.firebase.google.com):

1. Vá em **Authentication** > **Settings** > **Authorized domains**
2. Adicione os domínios da Vercel:
   - `seu-app.vercel.app`
   - Domínio personalizado (se houver)

### Atualizar CORS no Firestore

Se necessário, configure regras de CORS para o domínio da Vercel.

## Troubleshooting

### Erro: "Firebase: Error (auth/unauthorized-domain)"
- **Solução**: Adicione o domínio da Vercel em "Authorized domains" no Firebase Console

### Erro: "Environment variables not found"
- **Solução**: Verifique se todas as variáveis `VITE_FIREBASE_*` estão configuradas na Vercel

### Erro: "404 Not Found" ao navegar
- **Solução**: Verifique se o `vercel.json` tem a configuração de `rewrites` correta

### Build falha com erro de memória
- **Solução**: A Vercel tem limites de memória. O build atual está otimizado e deve funcionar.

## Monitoramento

A Vercel oferece:
- 📊 Analytics de performance
- 🔍 Logs de build e runtime
- 📈 Métricas de uso
- ⚡ Edge Functions (se necessário no futuro)

## Custos

- **Hobby Plan**: Gratuito
  - Unlimited deployments
  - SSL automático
  - 100GB bandwidth
  - Suficiente para começar

- **Pro Plan**: $20/mês
  - Mais recursos
  - Analytics avançados
  - Suporte prioritário

## Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Vite + Vercel](https://vercel.com/docs/frameworks/vite)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/projects/domains)

---

**Pronto!** Seu aplicativo Focus está configurado para deploy na Vercel. 🚀
