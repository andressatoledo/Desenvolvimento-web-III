import mongoose, { Schema, Document } from "mongoose";

export interface IEvento extends Document {
  Titulo: string;
  Descricao: string;
  Data: Date;
  Local: string;
  Valor: number;
}

const EventoSchema: Schema = new Schema({
  Titulo: { type: String, required: true },
  Descricao: { type: String, required: true },
  Data: { type: Date, required: true },
  Local: { type: String, required: true },
  Valor: { type: Number, required: true }
 
});

export const Evento = mongoose.model<IEvento>("Evento", EventoSchema, "eventos");
