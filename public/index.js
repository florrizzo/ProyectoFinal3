const socket = io();

function denormalizarMensajes(ListMessages) { 
  const authorSchema = new normalizr.schema.Entity('authors', { idAttribute: 'id' });
  const messageSchema = new normalizr.schema.Entity('message', {
    author: authorSchema,
  }, { idAttribute: "_id" })

  const denormalizedListMessages = normalizr.denormalize(ListMessages.result, [messageSchema], ListMessages.entities);
  return denormalizedListMessages
}

socket.on('connect', () => {
  console.log('me conecte!');
});

socket.on('product-list', (data) => {
  let html1 = `
            <h2>Lista de productos:</h1>                
            <div class="divTable">
                <div class="headRow">
                    <div  class="divCell"><p>Nombre</p></div>
                    <div  class="divCell"><p>Precio</p></div>
                    <div  class="divCell"><p>Foto</p></div>
                </div>`;
  let html2 = '';
  data.forEach((item) => {
    html2 += `        
                <div class="divRow">
                    <div class="divCell"><p>${item.title}</p></div>
                    <div class="divCell"><p>${item.price}</p></div>
                    <div class="divCell"><img class="pequeña" src="${item.thumbnail}" alt="imagen-producto"></div>
                </div>`;
  });
  document.getElementById('div-list-products').innerHTML =
    html1 + html2 + '</div>';
});

socket.on('msg-list', (data) => {
  let html = '';
  console.log(data)
  let denormalizado = denormalizarMensajes(data[0]);
  console.log(denormalizado)
  denormalizado.forEach((element) => {
    html += `
        <div> 
        <span class="bolded">${element.author.id}</span>: <em>${element.text}</em>
        <div/>`;
  });
  document.getElementById('div-list-msgs').innerHTML = html;
});

function enviarMsg() {
  const email = document.getElementById('input-email').value;
  const nombre = document.getElementById('input-nombre').value;
  const apellido = document.getElementById('input-apellido').value;
  const edad = document.getElementById('input-edad').value;
  const alias = document.getElementById('input-alias').value;
  const avatar = document.getElementById('input-avatar').value;
  const msgParaEnvio = document.getElementById('input-msg').value;
  socket.emit('msg', {
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
  const title = document.getElementById('Title').value;
  const price = document.getElementById('Price').value;
  const URL = document.getElementById('URL').value;
  socket.emit('product', { title: title, price: price, thumbnail: URL });
}
