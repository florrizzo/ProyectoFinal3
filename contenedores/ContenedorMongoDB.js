const mongoose = require("mongoose");
const { ModeloCarritos } = require("../models/carritos");
const ModeloMensajes = require("../models/mensajes");
const ModeloProductos = require("../models/productos");
const winston = require('winston');

/* Winston configuration */

const logger = winston.createLogger({
  level: 'warn',
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({ filename: 'warn.log', level: 'warn' }),
    new winston.transports.File({ filename: 'info.log', level: 'error' }),
  ],
});

function validacionId(array, id) {
  const index = array.findIndex((object) => object.id == id);
  if (array[index]) {
    return true;
  } else {
    return false;
  }
}

class ContenedorMongoDB {
  constructor({ name, schema }) {
    this.model = mongoose.model(name, schema);
  }

  async getAll() {
    const resultado = await this.model.find({});
    return resultado;
  }

  async getByName(name) {
    const resultado = await this.model.find({ title: name }, {_id: false, __v: false});
    return resultado;
  }

  async save(title, price, thumbnail) {
    try {
      const productoNuevo = new ModeloProductos({
        title: title,
        price: price,
        thumbnail: thumbnail,
      });
      await productoNuevo.save();
    } catch {
      logger.log('error', 'Se ha producido un error al guardar el producto');
      return "Se ha producido un error";
    }
  }

  async getCartProducts(username){
    const carritoUsuario = await this.model.find({ username: username }, {_id: false, __v: false});
    if (carritoUsuario.length > 0){
      return carritoUsuario[0].productos
    } else {
      return false;
    }
  }

  async addToCart(username, product){
    const carritoUsuario = await this.model.find({ username: username }, {_id: false, __v: false});
    if (carritoUsuario.length > 0){
    const productosCarrito = carritoUsuario[0].productos;
    productosCarrito.push(product);
    await this.model.updateOne(
      { username: username },
      {
        $set: {
          productos: productosCarrito}
        })
    } else {
      try {
        const carritoNuevo = new ModeloCarritos({
          username: username,
          productos: product,
        });
        await carritoNuevo.save();
      } catch {
        logger.log('error', 'Se ha producido un error');
        return "Se ha producido un error";
      }
    }
  }

  async deleteFromCart(username, product){
    const carritoUsuario = await this.model.find({ username: username }, {_id: false, __v: false});
    const productosCarrito = carritoUsuario[0].productos;
    const indexProduct = productosCarrito.findIndex(
      (object) => object.title == product.title
    );
    productosCarrito.splice(indexProduct, 1);
    await this.model.updateOne(
      { username: username },
      {
        $set: {
          productos: productosCarrito}
        })
  }

  async emptyCart(username) {
    await this.model.deleteOne({ username: username });
  }

  async saveMsg(id, nombre, apellido, edad, alias, avatar, text) {
    try {
      const mensajeNuevo = new ModeloMensajes({
        author: {
          id: id,
          nombre: nombre,
          apellido: apellido,
          edad: edad,
          alias: alias,
          avatar: avatar,
        },
        text: text,
      });
      await mensajeNuevo.save();
    } catch {
      logger.log('error', 'Se ha producido un error al guardar el mensaje');
      return "Se ha producido un error";
    }
  }
}

module.exports = ContenedorMongoDB;
