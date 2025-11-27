// ARCHIVO: server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Nota: Si te da error "Cannot use import statement outside a module",
// cambia la extensión de este archivo a "server.mjs" O agrega "type": "module" en tu package.json.
// Si prefieres no tocar package.json, cambia los imports por require:
// const express = require('express'); etc...

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Permite que cualquiera se conecte (celular y PC)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  socket.on("motion_data", (data) => {
    // Cuando el celular envía datos, se los pasamos al PC
    socket.broadcast.emit("update_mario", data);
  });
});

// Escuchar en el puerto 3001 y en 0.0.0.0 para que sea visible en la red
httpServer.listen(3001, "0.0.0.0", () => {
  console.log("🚀 Servidor Socket listo en el puerto 3001");
});