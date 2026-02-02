import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de productos y carritos" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
