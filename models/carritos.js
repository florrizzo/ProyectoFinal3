const { Schema, model } = require("mongoose");

const CarritosSchema = new Schema({
    username: { type: String, required: true, max: 100 },
    productos: [{ type: Object }],
});

const ModeloCarritos = model("carritos", CarritosSchema);
module.exports = { ModeloCarritos };