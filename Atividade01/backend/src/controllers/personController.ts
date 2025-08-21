/*
• Criar um Person 
• Listar todos os Persons 
• Buscar Person por id 
• Atualizar Person por id 
• Excluir Person por id 

*/

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();


// 📌 Criar um Person
export const createPerson = async (req: Request, res: Response) => {
  try {
    let { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });
    }

    const newPerson = await prisma.pessoa.create({
      data: {
        nome,
        email,
        }
    });

    res.status(201).json(newPerson);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao criar pessoa" });
  }
};

// 📌 BusPerson todas os Persons
export const getPersons = async (req: Request, res: Response) => {
  console.log(req);
  try {
    const Persons = await prisma.pessoa.findMany();
    res.json(Persons);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pessoas." });
  }
};


// 📌 BusPerson Person pelo id
export const getPersonByID = async (req: Request, res: Response) => {

  try {
    const { id } = req.params;
   
    const Person = await prisma.pessoa.findUnique(({
      where: { id: Number(id) }}))
    res.json(Person);

   
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar pessoa" });
  }
};


// 📌 Atualizar tarefa
export const updatePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email } = req.body;

    const updatedPerson = await prisma.pessoa.update({
      where: { id: Number(id) },
      data: { nome, email}
    });
    
    res.json(updatedPerson);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar pessoa" });
  }
};

// 📌 Deletar tarefa
export const deletePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pessoa.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar pessoa" });
  }
};
