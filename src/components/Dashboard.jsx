import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [alunos, setAlunos] = useState([]);
  const [total, setTotal] = useState(0);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const resposta = await api.get('/alunos?pagina=1&porPagina=20');
        setAlunos(resposta.data.alunos);
        setTotal(resposta.data.total);
      } catch (err) {
        setErro('Não foi possível carregar os alunos.');
      }
    }
    carregarAlunos();
  }, []);

  const sair = () => {
    localStorage.removeItem('jwt_token');
    navigate('/');
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button style={{ width: 'auto', padding: '8px 16px' }} onClick={sair}>
          Sair
        </button>
      </div>

      <p>Total de alunos cadastrados: {total}</p>
      {erro && <p className="erro">{erro}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Turma</th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.id}</td>
              <td>{aluno.nome}</td>
              <td>{aluno.email}</td>
              <td>{aluno.turma}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
