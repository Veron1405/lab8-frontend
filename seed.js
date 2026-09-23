require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const MATERIAS = ['Matemática', 'Português', 'Física', 'Química', 'Programação'];
const TOTAL_ALUNOS = 10000; // ajuste conforme necessário / paciência da sua máquina

function nomeAleatorio(i) {
  return `Aluno ${i}`;
}

async function main() {
  console.log('🌱 Iniciando seed...');

  // Usuário admin para login/teste
  const senhaHash = await bcrypt.hash('123456', 10);
  await prisma.usuario.upsert({
    where: { email: 'admin@unisenai.com' },
    update: {},
    create: { nome: 'Admin', email: 'admin@unisenai.com', senha: senhaHash },
  });
  console.log('✅ Usuário admin criado (admin@unisenai.com / 123456)');

  // Alunos em lotes, para não estourar memória/conexões
  const TAMANHO_LOTE = 500;
  for (let inicio = 0; inicio < TOTAL_ALUNOS; inicio += TAMANHO_LOTE) {
    const lote = [];
    for (let i = inicio; i < Math.min(inicio + TAMANHO_LOTE, TOTAL_ALUNOS); i++) {
      lote.push({
        nome: nomeAleatorio(i),
        email: `aluno${i}@unisenai.com`,
        turma: `Turma ${String.fromCharCode(65 + (i % 5))}`, // Turma A-E
      });
    }
    await prisma.aluno.createMany({ data: lote, skipDuplicates: true });
    console.log(`  ...${Math.min(inicio + TAMANHO_LOTE, TOTAL_ALUNOS)}/${TOTAL_ALUNOS} alunos inseridos`);
  }

  // Notas: 2 notas por aluno, em lotes
  const alunos = await prisma.aluno.findMany({ select: { id: true } });
  const TAMANHO_LOTE_NOTAS = 1000;
  let notasBuffer = [];

  for (const aluno of alunos) {
    for (let n = 0; n < 2; n++) {
      notasBuffer.push({
        alunoId: aluno.id,
        materia: MATERIAS[Math.floor(Math.random() * MATERIAS.length)],
        valor: Math.round((Math.random() * 10) * 10) / 10,
      });
    }
    if (notasBuffer.length >= TAMANHO_LOTE_NOTAS) {
      await prisma.nota.createMany({ data: notasBuffer });
      notasBuffer = [];
    }
  }
  if (notasBuffer.length > 0) {
    await prisma.nota.createMany({ data: notasBuffer });
  }

  console.log('✅ Notas inseridas para todos os alunos');
  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
