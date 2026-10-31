import prisma from "@database";
import { Luminosidade, Prisma } from "@prisma/client";

export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
  return await prisma.planta.create({ data });
};

export const findAllPlantas = async (
  filters?: { luminosidade?: Luminosidade; petFriendly?: boolean; nome?: string },
  ordem?: "preco" | "nome",
) => {
  // Constrói os filtros
  const whereClause: Prisma.PlantaWhereInput = {
    luminosidade: filters?.luminosidade,
    petFriendly: filters?.petFriendly,
  };

  // Adiciona a busca por nome insensível a maiúsculas/minúsculas
  if (filters?.nome) {
    whereClause.nome = {
      contains: filters.nome,
      mode: "insensitive",
    };
  }

  // Constrói a ordenação. O id no fim desempata e mantém a ordem estável.
  let orderByClause: Prisma.PlantaOrderByWithRelationInput[] = [{ id: "asc" }];
  if (ordem === "preco") {
    orderByClause = [{ preco: "asc" }, { id: "asc" }];
  } else if (ordem === "nome") {
    orderByClause = [{ nome: "asc" }, { id: "asc" }];
  }

  return await prisma.planta.findMany({
    where: whereClause,
    orderBy: orderByClause,
  });
};

export const findPlantasEsgotadas = async () => {
  return await prisma.planta.findMany({
    where: {
      estoque: 0,
    },
    orderBy: { id: "asc" },
  });
};

export const findPlantaById = async (id: number) => {
  return await prisma.planta.findUnique({
    where: { id },
  });
};

export const updatePlanta = async (id: number, data: Prisma.PlantaUpdateInput) => {
  return await prisma.planta.update({
    where: { id },
    data,
  });
};

export const deletePlanta = async (id: number) => {
  return await prisma.planta.delete({
    where: { id },
  });
};

// A checagem de estoque e a baixa acontecem no mesmo UPDATE (WHERE estoque >= quantidade).
// Assim, se duas vendas do último vaso chegarem juntas, o banco trava a linha e só uma passa.
// Devolve a planta atualizada ou null se o estoque não bastou.
export const sellPlanta = async (id: number, quantidade: number) => {
  return await prisma.$transaction(async (tx) => {
    const { count } = await tx.planta.updateMany({
      where: { id, estoque: { gte: quantidade } },
      data: { estoque: { decrement: quantidade } },
    });

    if (count === 0) {
      return null;
    }

    return await tx.planta.findUnique({ where: { id } });
  });
};

export const findPrecoEEstoqueDasPlantas = async () => {
  return await prisma.planta.findMany({
    select: {
      preco: true,
      estoque: true,
    },
  });
};
