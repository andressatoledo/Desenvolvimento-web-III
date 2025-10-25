import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IDisco extends Document {
  id: ObjectId;
  titulo: string;
  artista: string;
  ano: number;
  genero: string;
  formato: string;
  preco: number;
}

const DiscoSchema: Schema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  titulo: { type: String, required: true },
  artista: { type: String, required: true },
  ano: { type: Number, required: true },
  genero: { type: String, required: true },
  formato: { type: String, required: true },
  preco: { type: Number, required: true } 
});

export const Disco = mongoose.model<IDisco>("Disco", DiscoSchema);
