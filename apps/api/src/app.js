import express from "express";
import authRoutes from "./routes/auth.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import clientRoutes from "./routes/client.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import path from "path";
import { fileURLToPath } from "url";
// import { errorHandler } from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use("/api/inventory", inventoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/clientes", clientRoutes);
app.use("/api/providers", providerRoutes);

app.use("/api", authRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// app.use(errorHandler);
export default app;
