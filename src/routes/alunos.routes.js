const express = require('express');
const { PrismaClient } = require('@prisma/client');
const autenticar = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Todas as rotas abaixo exigem token válido (Bearer <token>)
router.use(autenticar);

// GET /alunos - lista alunos com suas notas (com paginação simples)
router.get('/', async (req, res) => {
  const pagina = parseInt(req.query.pagina) || 1;
  const porPagina = parseInt(req.query.porPagina) || 20;

  const alunos = await prisma.aluno.findMany({
    skip: (pagina - 1) * porPagina,
    take: porPagina,
    include: { notas: true },
  });

  const total = await prisma.aluno.count();

  res.json({ pagina, porPagina, total, alunos });
});

// GET /alunos/:id - detalhe de um aluno
router.get('/:id', async (req, res) => {
  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(req.params.id) },
    include: { notas: true },
  });

  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
  res.json(aluno);
});

// POST /alunos - cria um aluno
router.post('/', async (req, res) => {
  const { nome, email, turma } = req.body;
  const aluno = await prisma.aluno.create({ data: { nome, email, turma } });
  res.status(201).json(aluno);
});

module.exports = router;
