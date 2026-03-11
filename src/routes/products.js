import express from "express";
import { ProductManager } from "../managers/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager();

// GET / - Listar todos los productos //
router.get("/", (req, res) => {
  try {
    const products = productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /:pid - Obtener un producto por ID //
router.get("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const productId = isNaN(pid) ? pid : parseInt(pid);
    const product = productManager.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / - Crear un nuevo producto //
router.post("/", (req, res) => {
  try {
    const newProduct = productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /:pid - Actualizar un producto //
router.put("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const productId = isNaN(pid) ? pid : parseInt(pid);
    const updatedProduct = productManager.updateProduct(productId, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE /:pid - Eliminar un producto //
router.delete("/:pid", (req, res) => {
  try {
    const { pid } = req.params;
    const productId = isNaN(pid) ? pid : parseInt(pid);
    const result = productManager.deleteProduct(productId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
