import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRouter";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config({ quiet: true });

const app = express();

app.use(cors({ credentials: true, origin: process.env.APP_URL }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// Register routes
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
});
