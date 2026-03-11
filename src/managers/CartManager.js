import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartsFilePath = path.join(__dirname, "../../data/carts.json");

export class CartManager {
  constructor() {
    this.ensureFileExists();
  }

  ensureFileExists() {
    const dataDir = path.dirname(cartsFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(cartsFilePath)) {
      fs.writeFileSync(cartsFilePath, JSON.stringify([], null, 2));
    }
  }

  getCarts() {
    const data = fs.readFileSync(cartsFilePath, "utf-8");
    return JSON.parse(data);
  }

  getCartById(id) {
    const carts = this.getCarts();
    return carts.find((c) => c.id === id);
  }

  createCart() {
    const carts = this.getCarts();

    // Auto-generar ID //
    const newId =
      carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;

    const newCart = {
      id: newId,
      products: [],
    };

    carts.push(newCart);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

    return newCart;
  }

  addProductToCart(cartId, productId) {
    const carts = this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex === -1) {
      throw new Error(`Carrito con id ${cartId} no encontrado`);
    }

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(
      (p) => p.product === productId,
    );

    if (productIndex !== -1) {
      // Incrementar cantidad si el producto ya existe //
      cart.products[productIndex].quantity += 1;
    } else {
      // Agregar nuevo producto //
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    carts[cartIndex] = cart;
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

    return cart;
  }

  getCartProducts(cartId) {
    const carts = this.getCarts();
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) {
      throw new Error(`Carrito con id ${cartId} no encontrado`);
    }

    return cart.products;
  }
}
