import { Router, Request, Response } from "express";
import { Disco } from "../models/Disco";

const router = Router();


router.get("/", async (_req: Request, res: Response) => {
  try {
    const discos = await Disco.find();
    res.json(discos);
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
    const newItem = new Disco(req.body);
    const ItemSave = await newItem.save();
    res.status(201).json(ItemSave);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
});


router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateItem = await Disco.findByIdAndUpdate(id, req.body, { new: true });
    if (!updateItem) {
      return res.status(404).json({ error: "Disco não encontrado." });
    }
    res.json(updateItem);
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
    const deleteItem = await Disco.findByIdAndDelete(id);
    if (!deleteItem) {
      return res.status(404).json({ error: "Disco não encontrado." });
    }
    res.json({ message: "Disco excluído com sucesso." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: String(error) });
    }
  }
});

export const discoRoutes = router;
