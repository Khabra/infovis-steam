import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuraciones para rutas en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// 1. SERVIR LOS ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'dist')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  socket.on("motion_data", (data) => {
    socket.broadcast.emit("update_mario", data);
  });

  socket.on("feedback_event", (data) => {
    io.emit("trigger_feedback", data);
  });
});

// 2. RUTAS DE FALLBACK (CORREGIDO AQUI)
// CAMBIO: Usamos '(.*)' en lugar de '*' para evitar el PathError
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 3. PUERTO DINÁMICO
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor listo en el puerto ${PORT}`);
});