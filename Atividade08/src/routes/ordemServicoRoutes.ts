import { Router, Request, Response } from "express";
import { OrdemServico } from "../models/OrdemServico";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const ordens = await OrdemServico.find();
    res.json(ordens);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newOrdemServico = new OrdemServico(req.body);
    const savedOrdemServico = await newOrdemServico.save();
    res.status(201).json(savedOrdemServico);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOrdemServico = await OrdemServico.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrdemServico) {
      return res.status(404).json({ error: "Ordem de serviço não encontrada." });
    }
    res.json(updatedOrdemServico);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedOrdemServico = await OrdemServico.findByIdAndDelete(id);
    if (!deletedOrdemServico) {
      return res.status(404).json({ error: "Ordem de serviço não encontrado." });
    }
    res.json({ message: "Ordem de serviço excluído com sucesso." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
});

export const ordemServicoRoutes = router;
