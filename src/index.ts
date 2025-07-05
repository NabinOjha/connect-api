import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/authRouter";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config({ quiet: true });

const app = express();

app.use(cors({ origin: process.env.APP_URL }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Register routes
app.use("/auth", authRouter);

// Error-handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`App listening on port ${PORT}`);
});
