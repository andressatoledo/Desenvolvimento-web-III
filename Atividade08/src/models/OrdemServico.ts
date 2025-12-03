import mongoose, { Schema, Document } from "mongoose";

export interface IOrdemServico extends Document {
  titulo: string;
  descricao: string;
  dataAbertura: Date;
  status: "aberta" | "em andamento" | "concluída";
  prioridade: "baixa" | "média" | "alta";
  responsavel?: string;
  setorSolicitante: string;
  prazoEstimado?: Date;
  valorServico: number;
}

const OrdemServicoSchema: Schema = new Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  dataAbertura: { type: Date, default: Date.now },
  
  status: { 
    type: String, 
    required: true, 
    enum: ["aberta", "em andamento", "concluída"] 
  },

  prioridade: { 
    type: String, 
    required: true, 
    enum: ["baixa", "média", "alta"] 
  },

  responsavel: { type: String },

  setorSolicitante: { type: String, required: true },

  prazoEstimado: { type: Date },

  valorServico: { type: Number, required: true }
});

export const OrdemServico = mongoose.model<IOrdemServico>(
  "OrdemServico",
  OrdemServicoSchema,
  "ordens_servico"
);
