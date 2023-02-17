const carrito = [];

function renderizarCarrito() {
  let html = "";
  let sum = 0;
  for (let i = 0; i < carrito.length; i++) {
    sum += parseInt(carrito[i].precio);
    html += `
        <div> ${carrito[i].nombre} - $ ${carrito[i].precio}  <button class="btn-cart" onclick="eliminarProducto(${i})">Eliminar</button> </div>`;
  }
  const carritoJSON = JSON.stringify(carrito);
  html += `<div> <em> Total: - $ ${sum} <em/> <div/>
  <form name="sendCart" action="/enviarCarrito" method="POST">
    <textarea class="hidden" name="cart">${carritoJSON}</textarea>
    <input type="submit" class="action-button" /> 
  </form>`;
  document.getElementById("div-cart-products").innerHTML = html;
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  renderizarCarrito();
}

function agregarProducto(producto) {
  let nombre = producto.slice(0, producto.lastIndexOf("-"));
  let precio = producto.slice(producto.lastIndexOf("-") + 1, producto.length);
  let productoAgregado = { nombre: nombre, precio: precio };
  carrito.push(productoAgregado);
  renderizarCarrito();
}

const socket = io();

function denormalizarMensajes(ListMessages) {
  const authorSchema = new normalizr.schema.Entity("authors", {
    idAttribute: "id",
  });
  const messageSchema = new normalizr.schema.Entity(
    "message",
    {
      author: authorSchema,
    },
    { idAttribute: "_id" }
  );

  const denormalizedListMessages = normalizr.denormalize(
    ListMessages.result,
    [messageSchema],
    ListMessages.entities
  );
  return denormalizedListMessages;
}

/* socket.on("connect", () => {
  console.log("me conecte!");
});

socket.on("msg-list", (data) => {
  let html = "";
  let denormalizado = denormalizarMensajes(data[0]);
  denormalizado.forEach((element) => {
    html += `
        <div> 
        <span class="bolded">${element.author.id}</span>: <em>${element.text}</em>
        <div/>`;
  });
  document.getElementById("div-list-msgs").innerHTML = html;
}); */

function enviarMsg() {
  const email = document.getElementById("input-email").value;
  const nombre = document.getElementById("input-nombre").value;
  const apellido = document.getElementById("input-apellido").value;
  const edad = document.getElementById("input-edad").value;
  const alias = document.getElementById("input-alias").value;
  const avatar = document.getElementById("input-avatar").value;
  const msgParaEnvio = document.getElementById("input-msg").value;
  socket.emit("msg", {
    id: email,
    nombre: nombre,
    apellido: apellido,
    edad: edad,
    alias: alias,
    avatar: avatar,
    text: msgParaEnvio,
  });
}

function enviarProducto() {
  const title = document.getElementById("Title").value;
  const price = document.getElementById("Price").value;
  const URL = document.getElementById("URL").value;
  socket.emit("product", { title: title, price: price, thumbnail: URL });
}
