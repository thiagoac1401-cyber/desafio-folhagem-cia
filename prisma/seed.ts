import { PrismaClient, Luminosidade } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.planta.createMany({
    data: [
      { nome: 'Costela de Adão', especie: 'Monstera deliciosa', preco: 5000, estoque: 10, luminosidade: Luminosidade.MEIA_SOMBRA, petFriendly: false, regaACadaDias: 7 },
      { nome: 'Espada de São Jorge', especie: 'Sansevieria trifasciata', preco: 3000, estoque: 0, luminosidade: Luminosidade.MEIA_SOMBRA, petFriendly: false, regaACadaDias: 14 },
      { nome: 'Samambaia Americana', especie: 'Nephrolepis exaltata', preco: 2500, estoque: 5, luminosidade: Luminosidade.SOMBRA, petFriendly: true, regaACadaDias: 3 }
    ],
    skipDuplicates: true,
  });
  console.log("🌱 Seed plantado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });