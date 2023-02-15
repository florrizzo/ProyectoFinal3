const { Schema, model } = require("mongoose");

const ProductosSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
});

const ModeloProductos = model("productos", ProductosSchema);
module.exports = { ModeloProductos };
