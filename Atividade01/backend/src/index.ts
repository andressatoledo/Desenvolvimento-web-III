import express from "express";
import dotenv from "dotenv";
import path from "path"; // para resolver caminhos
import { carRoutes } from "./routes/carRoutes";
import { personRoutes } from "./routes/personRoutes";
import { personCarRoutes } from "./routes/personCarRoutes";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));

// Middleware para ler JSON no corpo da requisição
app.use(express.json());

// Servir arquivos estáticos da pasta "views" (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, "views")));



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "index.html"));
});

app.use("/cars", carRoutes);
app.use("/persons", personRoutes);
app.use("/personCar", personCarRoutes);

app.use(express.static(path.join(__dirname, "view")));
 


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

