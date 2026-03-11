import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, "../../data/products.json");

export class ProductManager {
  constructor() {
    this.ensureFileExists();
  }

  ensureFileExists() {
    const dataDir = path.dirname(productsFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(productsFilePath)) {
      fs.writeFileSync(productsFilePath, JSON.stringify([], null, 2));
    }
  }

  getProducts() {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data);
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  }

  addProduct(productData) {
    const products = this.getProducts();

    // Validar campos requeridos //
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    for (const field of requiredFields) {
      if (!productData[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }

    // Auto-generar ID //
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: productData.price,
      status: productData.status !== undefined ? productData.status : true,
      stock: productData.stock,
      category: productData.category,
      thumbnails: productData.thumbnails || [],
    };

    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

    return newProduct;
  }

  updateProduct(id, productData) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }

    // No permitir actualizar el ID //
    const updatedProduct = {
      ...products[index],
      ...productData,
      id: products[index].id, // Asegurar que el ID no cambie //
    };

    products[index] = updatedProduct;
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

    return updatedProduct;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const filteredProducts = products.filter((p) => p.id !== id);

    if (products.length === filteredProducts.length) {
      throw new Error(`Producto con id ${id} no encontrado`);
    }

    fs.writeFileSync(
      productsFilePath,
      JSON.stringify(filteredProducts, null, 2),
    );
    return { message: `Producto ${id} eliminado` };
  }
}
