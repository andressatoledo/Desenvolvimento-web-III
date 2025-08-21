import express from "express";
import {
  getCars,
  getCarByID,
  createCar,
  updateCar,
  deleteCar
} from "../controllers/carController";

const router = express.Router();

router.get("/getCars", getCars);
router.get("/getCarByID/:id", getCarByID);
router.post("/createCar", createCar);
router.put("/updateCar/:id", updateCar);
router.delete("/deleteCar/:id", deleteCar);

export const carRoutes = router;