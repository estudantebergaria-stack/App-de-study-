import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  AuthError
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!auth) {
      setError('Firebase não está configurado. Verifique as variáveis de ambiente.');
      return;
    }

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const authError = err as AuthError;
      switch (authError.code) {
        case 'auth/email-already-in-use':
          setError('Este e-mail já está em uso.');
          break;
        case 'auth/invalid-email':
          setError('E-mail inválido.');
          break;
        case 'auth/user-not-found':
          setError('Usuário não encontrado.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta.');
          break;
        case 'auth/weak-password':
          setError('A senha é muito fraca.');
          break;
        default:
          setError('Erro ao autenticar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl mx-auto mb-4">
            F
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Focus</h1>
          <p className="text-zinc-400">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300 mb-2">
                  Confirmar Senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processando...
                </>
              ) : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition"
              disabled={isLoading}
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entrar'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-zinc-500">
          <p>Seus dados serão sincronizados na nuvem</p>
          <p className="mt-1">e ficarão acessíveis em todos os seus dispositivos</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
