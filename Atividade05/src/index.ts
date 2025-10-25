import express from "express";
import mongoose from "mongoose";
import path from "path";
import { discoRoutes } from "./routes/discoRoutes";
import cors from "cors";


const app = express();

app.use(cors({
  origin: "*" 
}));

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/disco")
  .then(() => console.log("Conectado ao MongoDB"))
  .catch(error => console.log("Erro ao conectar MongoDB:", error));


app.use("/discos", discoRoutes);


app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
