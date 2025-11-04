import { Schema, model } from "mongoose";

export interface ITask {
  id?: string;
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "completada";
}

const taskSchema = new Schema<ITask>(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "completada"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

export const Task = model<ITask>("tareas", taskSchema);
