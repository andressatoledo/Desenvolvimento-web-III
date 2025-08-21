import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createPersonCar = async (req: Request, res: Response) => {
  try {
    const { personId, carId } = req.body;

    if (!personId || !carId) {
      return res.status(400).json({ error: "Pessoa e carro são obrigatórios" });
    }

    const newPersonCar = await prisma.pessoaPorCarro.create({
      data: {
        pessoaId: Number(personId),
        carroId: Number(carId),
      },
    });

    return res.status(201).json(newPersonCar);

  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
    
      return res.status(409).json({
        error: "Essa pessoa já está associada a esse carro.",
      });
    }

    console.error("Erro inesperado:", error);
    return res.status(500).json({ error: "Erro ao criar associação" });
  }
};

export const getListPersonCars = async (req: Request, res: Response) => {
  try {
    const personCars = await prisma.pessoaPorCarro.findMany({
      include: {
        pessoa: true, // pega os dados da pessoa
        carro: true,  // pega os dados do carro
      },
    });

    res.json(personCars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar associações" });
  }
};


export const deletePersonCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.pessoaPorCarro.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar associação" });
  }
};
