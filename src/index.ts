import cors from "cors";
import express from "express";
import { PORT } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import sampleRouter from "./routes/sample.router";
import authRouter from "./routes/auth.router";
import productRouter from "./routes/product.router";
import eventRouter from "./routes/event.router";
import transactionRouter from "./routes/transaction.router";

import "./jobs"; // importing index.ts

const app = express();

app.use(cors());
app.use(express.json());

app.use("/samples", sampleRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/events", eventRouter);
app.use("/transactions", transactionRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
