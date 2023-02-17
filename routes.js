const ProductosDaoMongoDB = require("./daos/ProductosDaoMongoDB");
const CarritosDaoMongoDB = require("./daos/CarritosDaoMongoDB");
const contenedor = new ProductosDaoMongoDB();
const contenedorCarrito = new CarritosDaoMongoDB();

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

/* Nodemailer */
const { createTransport } = require("nodemailer");

const TEST_MAIL = "florenciam.rizzo@hotmail.com";

const transporter = createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "hailey.brown@ethereal.email",
    pass: "s6hb6pXVzFcPtsHGgC",
  },
});

async function getMain(req, res) {
  console.log(req.body)
  const { username, password } = req.user;
  const productos = await contenedor.getAll();
  const cartProducts = await contenedorCarrito.getCartProducts(username);
  let sum = 0;
  if(cartProducts.length > 0 ){
  cartProducts.forEach(element => {
    sum += element.price;
  })
  };
  const datos = {
    productos: productos,
    usuario: username,
    nombre: req.user.nombre,
    direccion: req.user.direccion,
    edad: req.user.edad,
    telefono: req.user.telefono,
    url: req.user.url,
    productosEncontrados: [],
    productosCarrito: cartProducts,
    total: sum
  };

  if(req.body.productosEncontrados){
    req.body.productosEncontrados.forEach(element => {
      datos.productosEncontrados.push(element)
    });
  }

  res.render("productslists", datos);
}

async function postEnviarCarrito(req, res) {
  const { username, nombre } = req.user;
  let carrito = await contenedorCarrito.getCartProducts(username);
  console.log(carrito)
  let htmlcarrito = "";
  let wappcarrito = "";
  let sum = 0;
  for (let i = 0; i < carrito.length; i++) {
    sum += parseInt(carrito[i].price);
    htmlcarrito += `
        <div> ${carrito[i].title} - $ ${carrito[i].price}</div>`;
    wappcarrito += `
        ${carrito[i].title} - $ ${carrito[i].price}`;
  }
  htmlcarrito += `<div> <em> Total: - $ ${sum} <em/> <div/>`;
  wappcarrito += `Total: - $ ${sum}`;
  const mailOptions = {
    from: "Servidor Node.js",
    to: TEST_MAIL,
    subject: "Nuevo pedido de " + nombre + ": " + username,
    html: `<h1>El usuario ${nombre} realizó el siguiente pedido:</h1>
    <p>${htmlcarrito}</p>`,
  };

  try {
    const enviarMail = async () => {
      const info = await transporter.sendMail(mailOptions);
      console.log(info);
    };
    enviarMail();
  } catch (err) {
    console.log(err);
  }

  /* Twilio */
  const twilio = require("twilio");

  const accountSid = "AC4a83255eb09003b2b25ede9b56db27f6";
  const authToken = "Agregar el authToken aqui";

  const client = twilio(accountSid, authToken);

  /* Twilio Wapp a administrador*/
  client.messages 
      .create({ 
         body: `El usuario ${username} realizó el siguiente pedido:
         ${wappcarrito}`, 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+5493487660828' 
       }) 
      .then(message => console.log(message.sid)); 

  /* Twilio SMS a usuario*/
  try {
    const enviarSMS = async () => {
      const message = await client.messages.create({
        body: "Tu pedido a Date el gusto se realizó con éxito!",
        from: "+14244849354",
        to: "+543487660828",
      });
      console.log(message);
    };
    enviarSMS();
  } catch (error) {
    console.log(error);
  }

  res.render("cartSent");
}

function postSignup(req, res) {
  const { username, password, nombre } = req.user;

  const mailOptions = {
    from: "Servidor Node.js",
    to: TEST_MAIL,
    subject: "Nuevo registro",
    html:
      '<h1 style="color: blue;">Se registró un usuario nuevo: <span style="color: green;">' +
      username +
      "</span></h1>",
  };

  try {
    const enviarMail = async () => {
      const info = await transporter.sendMail(mailOptions);
      console.log(info);
    };
    enviarMail();
  } catch (err) {
    console.log(err);
  }

  res.redirect("/");
}

function getLogin(req, res) {
  res.render("login");
}

function getRegister(req, res) {
  res.render("register");
}

function postLogin(req, res) {
  const { username, password } = req.user;
  res.redirect("/");
}

function getLogout(req, res) {
  const { username, password } = req.user;
  req.session.destroy((err) => {
    if (err) {
      res.send("No se pudo deslogear");
    } else {
      res.render("logout", { usuario: username });
    }
  });
}

function getInfo(req, res) {
  res.send(`
    Argumentos de entrada: ${process.argv.slice(2)}
    Nombre de la plataforma (sistema operativo): ${process.platform}
    Versión de node: ${process.version}
    Memoria total reservada (rss): ${process.memoryUsage.rss()}
    Path de ejecución: ${process.cwd()}
    ID del proceso: ${process.pid}`);
}

async function postProductFilter (req, res) {
  const { buscadorProducto } = req.body;
  if (!contenedor.getByName(buscadorProducto)) {
    res.redirect("/");
  } else {
    let resultado = await contenedor.getByName(buscadorProducto);
    req.body.productosEncontrados = resultado; 
    getMain(req, res);
  }
}

async function postAddToCart (req, res){
  let product = await contenedor.getByName(req.body.addcart)
  await contenedorCarrito.addToCart(req.user.username, product[0])
  res.redirect('/');
}

async function postEmptyCart (req, res){
  await contenedorCarrito.emptyCart(req.user.username)
  res.redirect('/');
}

async function deleteFromCart (req, res){
  let product = await contenedor.getByName(req.body.deletefromcart)
  await contenedorCarrito.deleteFromCart(req.user.username, product[0])
  res.redirect('/');
}

module.exports = {
  checkAuthentication,
  postSignup,
  getLogin,
  getRegister,
  postLogin,
  getMain,
  getLogout,
  getInfo,
  postEnviarCarrito,
  postProductFilter,
  postAddToCart,
  postEmptyCart,
  deleteFromCart
};
