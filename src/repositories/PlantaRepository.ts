import prisma from "@database";
import { Luminosidade, Prisma } from "@prisma/client";

export class PlantaRepository {
  async create(data: Prisma.PlantaCreateInput) {
    return await prisma.planta.create({ data });
  }

  async findAll(filters?: { luminosidade?: Luminosidade; petFriendly?: boolean; nome?: string }, ordem?: string) {
    // Constrói os filtros
    const whereClause: Prisma.PlantaWhereInput = {
      luminosidade: filters?.luminosidade,
      petFriendly: filters?.petFriendly,
    };

    // Adiciona a busca por nome insensível a maiúsculas/minúsculas
    if (filters?.nome) {
      whereClause.nome = {
        contains: filters.nome,
        mode: 'insensitive', 
      };
    }

    // Constrói a ordenação
    let orderByClause: Prisma.PlantaOrderByWithRelationInput | undefined = undefined;
    if (ordem === 'preco') {
      orderByClause = { preco: 'asc' };
    } else if (ordem === 'nome') {
      orderByClause = { nome: 'asc' };
    }

    return await prisma.planta.findMany({
      where: whereClause,
      orderBy: orderByClause,
    });
  }

  // Nova função para as plantas esgotadas
  async findEsgotadas() {
    return await prisma.planta.findMany({
      where: {
        estoque: 0,
      },
    });
  }

  async findById(id: number) {
    return await prisma.planta.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.PlantaUpdateInput) {
    return await prisma.planta.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.planta.delete({
      where: { id },
    });
  }

  async diminuirEstoque(id: number, quantidade: number) {
    return await prisma.planta.update({
      where: { id },
      data: {
        estoque: { decrement: quantidade },
      },
    });
  }

  async findAllPrecoEEstoque() {
    return await prisma.planta.findMany({
      select: {
        preco: true,
        estoque: true,
      },
    });
  }
}