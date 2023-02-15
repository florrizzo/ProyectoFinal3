const ContenedorMongoDB = require("../contenedores/ContenedorMongoDB.js");
const ModeloMensajes = require("../models/mensajes.js");

class MensajesDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super({
      name: 'mensajes',
      schema: ModeloMensajes.MensajesSchema,
    });
  }
}

module.exports = MensajesDaoMongoDB;