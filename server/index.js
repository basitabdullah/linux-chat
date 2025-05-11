import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from "path";

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import chatRoutes from './routes/chat.route.js';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173","https://linux-chat.vercel.app"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/",(req,res)=>{
  res.send("Server Running!")
})

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log('Server is listening on PORT:', PORT);
  connectDB();
});