require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const alunosRoutes = require('./src/routes/alunos.routes');

const app = express();

// Habilita o CORS para evitar bloqueios no navegador (Fase 2)
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API Lab 8 rodando 🚀' });
});

app.use('/', authRoutes);
app.use('/alunos', alunosRoutes);

// A nuvem (Render/Railway) injeta a própria porta via process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
