const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// POST /registrar - cria um usuário (uso inicial / admin)
router.post('/registrar', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'nome, email e senha são obrigatórios' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
    });
    return res.status(201).json({ id: usuario.id, email: usuario.email });
  } catch (err) {
    return res.status(400).json({ erro: 'Não foi possível registrar (email já existe?)' });
  }
});

// POST /login - autentica e devolve o token JWT
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'email e senha são obrigatórios' });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senha);
  if (!senhaConfere) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({ token });
});

module.exports = router;
