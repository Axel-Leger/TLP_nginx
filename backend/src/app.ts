import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import taskRoutes from "./routes/tasks";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

const PORT =  3000;
const MONGO_URI = "mongodb://mongo:27017/gestor_tareas";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Backend corriendo en puerto ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));
