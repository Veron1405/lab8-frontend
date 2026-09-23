import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function TelaLogin() {
  const [email, setEmail] = useState('admin@unisenai.com');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const processarLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await api.post('/login', { email, senha });
      const tokenRecebido = resposta.data.token;

      localStorage.setItem('jwt_token', tokenRecebido);
      navigate('/dashboard'); // Muda a URL e carrega o Dashboard
    } catch (err) {
      setErro('Email ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={processarLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
        {erro && <p className="erro">{erro}</p>}
      </form>
    </div>
  );
}
