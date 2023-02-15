const ContenedorMongoDB = require("../contenedores/ContenedorMongoDB");
const ModeloProductos = require("../models/productos");

class ProductosDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super({
      name: 'productos',
      schema: ModeloProductos.ProductosSchema,
    });
  }
}

module.exports = ProductosDaoMongoDB;