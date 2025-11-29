import { Router, Request, Response } from "express";
import { Evento } from "../models/Evento";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
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
    const newEvento = new Evento(req.body);
    const savedEvento = await newEvento.save();
    res.status(201).json(savedEvento);
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
    const updatedEvento = await Evento.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvento) {
      return res.status(404).json({ error: "Evento não encontrada." });
    }
    res.json(updatedEvento);
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
    const deletedEvento = await Evento.findByIdAndDelete(id);
    if (!deletedEvento) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }
    res.json({ message: "Evento excluído com sucesso." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
});

export const eventoRoutes = router;
