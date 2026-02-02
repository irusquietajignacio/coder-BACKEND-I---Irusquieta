import express from "express";
import { CartManager } from "../managers/CartManager.js";
import { ProductManager } from "../managers/ProductManager.js";

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// POST / - Crear un nuevo carrito //
router.post("/", (req, res) => {
  try {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /:cid - Obtener productos del carrito //
router.get("/:cid", (req, res) => {
  try {
    const { cid } = req.params;
    const cartId = isNaN(cid) ? cid : parseInt(cid);
    const products = cartManager.getCartProducts(cartId);
    res.json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST /:cid/product/:pid - Agregar producto al carrito //
router.post("/:cid/product/:pid", (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cartId = isNaN(cid) ? cid : parseInt(cid);
    const productId = isNaN(pid) ? pid : parseInt(pid);

    // Validar que el producto existe //
    const product = productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedCart = cartManager.addProductToCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
