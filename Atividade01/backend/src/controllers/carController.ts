/*
• Criar um carro 
• Listar todos os carros 
• Buscar carro por id 
• Atualizar carro por id 
• Excluir carro por id 

*/

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();


// 📌 Criar um carro
export const createCar = async (req: Request, res: Response) => {
  try {
    let { modelo, marca, ano } = req.body;

    if (!modelo || !marca || !ano) {
      return res.status(400).json({ error: "Modelo, marca e ano são obrigatórios" });
    }

    ano = Number(ano);

    const newCar = await prisma.carro.create({
      data: {
        modelo,
        marca,
        ano
      }
    });

    res.status(201).json(newCar);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar carro" });
  }
};

// 📌 Buscar todas os carros
export const getCars = async (req: Request, res: Response) => {
  try {
    const cars = await prisma.carro.findMany();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar carros" });
  }
};


// 📌 Buscar carro pelo id
export const getCarByID = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;
   
    const car = await prisma.carro.findUnique(({
      where: { id: Number(id) }}))
    res.json(car);

   
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar carro" });
  }
};


// 📌 Atualizar tarefa
export const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { modelo, marca, ano } = req.body;

    const updatedCar = await prisma.carro.update({
      where: { id: Number(id) },
      data: { modelo, marca, ano}
    });
    
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar carro" });
  }
};

// 📌 Deletar tarefa
export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.carro.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar carro" });
  }
};
