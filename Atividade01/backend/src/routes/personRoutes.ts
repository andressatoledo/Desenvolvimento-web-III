import express from "express";
import {
  getPersons,
  getPersonByID,
  createPerson,
  updatePerson,
  deletePerson
} from "../controllers/personController";

const router = express.Router();

router.get("/getPersons", getPersons);
router.get("/getPersonByID/:id", getPersonByID);
router.post("/createPerson", createPerson);
router.put("/updatePerson/:id", updatePerson);
router.delete("/deletePerson/:id", deletePerson);

export const personRoutes = router;