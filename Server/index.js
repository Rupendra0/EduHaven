import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";
import fetch, { Headers, Request, Response } from "node-fetch";

import { ConnectDB } from "./Database/Db.js";
import authRoutes from "./Routes/AuthRoutes.js";
import TodoRoutes from "./Routes/ToDoRoutes.js";
import NotesRoutes from "./Routes/NotesRoutes.js";
import EventRoutes from "./Routes/EventRoutes.js";
import StudySessionRoutes from "./Routes/StudySessionRoutes.js";
import SessionRoomRoutes from "./Routes/SessionRoomRoutes.js";
import FriendsRoutes from "./Routes/FriendsRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import { initializeSocket } from "./Socket/socket.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

const app = express();
const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(helmet());
app.use(compression());
app.use(morgan("tiny"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.get("/", (req, res) => res.send("✅ API is running..."));

app.use("/auth", authRoutes);
app.use("/todo", TodoRoutes);
app.use("/note", NotesRoutes);
app.use("/events", EventRoutes);
app.use("/study-sessions", StudySessionRoutes);
app.use("/session-room", SessionRoomRoutes);
app.use("/friends", FriendsRoutes);
app.use("/user", UserRoutes);

app.use(notFound);
app.use(errorHandler);

initializeSocket(io);

server.listen(port, async () => {
  await ConnectDB();
  console.log(`🚀 Server running at http://localhost:${port}`);
});
