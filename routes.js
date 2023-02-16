const ProductosDaoMongoDB = require("./daos/ProductosDaoMongoDB");
const contenedor = new ProductosDaoMongoDB();

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
  const { username, password } = req.user;
  const productos = await contenedor.getAll();
  const datos = {
    productos: productos,
    usuario: username,
    nombre: req.user.nombre,
    direccion: req.user.direccion,
    edad: req.user.edad,
    telefono: req.user.telefono,
    url: req.user.url,
  };
  res.render("productslists", datos);
}

function postEnviarCarrito(req, res) {
  const { username, nombre } = req.user;
  const carrito = JSON.parse(req.body.cart);
  let htmlcarrito;
  let sum = 0;
  for (let i = 0; i < carrito.length; i++) {
    sum += parseInt(carrito[i].precio);
    htmlcarrito += `
        <div> ${carrito[i].nombre} - $ ${carrito[i].precio}</div>`;
  }
  htmlcarrito += `<div> <em> Total: - $ ${sum} <em/> <div/>`
  const mailOptions = {
    from: "Servidor Node.js",
    to: TEST_MAIL,
    subject: "Nuevo pedido de " + nombre + ": " + username ,
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
  res.render("cartSent");
}

function postSignup(req, res) {
  const { username, password, nombre } = req.user;

  const mailOptions = {
    from: "Servidor Node.js",
    to: TEST_MAIL,
    subject: "Nuevo registro",
    html: '<h1 style="color: blue;">Se registró un usuario nuevo: <span style="color: green;">'+ username +'</span></h1>',
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

function getMyMenu(req, res) {
  const { username, password } = req.user;
  res.render("mymenu", { usuario: username });
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
  getMyMenu,
  postEnviarCarrito
};
