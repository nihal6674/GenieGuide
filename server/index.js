import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./route/ai.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
