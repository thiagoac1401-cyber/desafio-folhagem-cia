import { PrismaClient, Luminosidade } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Só popula se a tabela estiver vazia. O skipDuplicates não ajuda aqui, porque ele só
  // ignora conflitos de colunas únicas e a Planta não tem nenhuma além do id autoincrementado.
  if ((await prisma.planta.count()) > 0) {
    console.log("A tabela Planta já tem dados. Seed ignorado.");
    return;
  }

  await prisma.planta.createMany({
    data: [
      { nome: 'Costela de Adão', especie: 'Monstera deliciosa', preco: 5000, estoque: 10, luminosidade: Luminosidade.MEIA_SOMBRA, petFriendly: false, regaACadaDias: 7 },
      { nome: 'Espada de São Jorge', especie: 'Sansevieria trifasciata', preco: 3000, estoque: 0, luminosidade: Luminosidade.MEIA_SOMBRA, petFriendly: false, regaACadaDias: 14 },
      { nome: 'Samambaia Americana', especie: 'Nephrolepis exaltata', preco: 2500, estoque: 5, luminosidade: Luminosidade.SOMBRA, petFriendly: true, regaACadaDias: 3 }
    ],
  });
  console.log("🌱 Seed plantado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
