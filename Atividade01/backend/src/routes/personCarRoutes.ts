import express from "express";
import {
  getListPersonCars,
  createPersonCar,
  deletePersonCar
} from "../controllers/personCarController";

const router = express.Router();

router.get("/getListPersonCars", getListPersonCars);
router.post("/createPersonCar", createPersonCar);
router.delete("/deletePersonCar/:id", deletePersonCar);

export const personCarRoutes = router;