import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TelaLogin from './components/TelaLogin';
import Dashboard from './components/Dashboard';

// Componente Interceptador (Guardião de Rota)
const RotaPrivada = ({ children }) => {
  const token = localStorage.getItem('jwt_token');
  // Se não houver token, redireciona para a raiz (login)
  return token ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<TelaLogin />} />

        {/* Rota Protegida */}
        <Route
          path="/dashboard"
          element={
            <RotaPrivada>
              <Dashboard />
            </RotaPrivada>
          }
        />

        {/* Rota Coringa (404 - Redireciona para o login se a URL não existir) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
