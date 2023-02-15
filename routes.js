function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }
  
  function getMain(req, res) {
    const { username, password } = req.user;
    res.render('productslists', { usuario: username });
  }
  
  function postSignup(req, res) {
    const { username, password } = req.user;
    res.render('productslists', { usuario: username });
  }
  
  function getLogin(req, res) {
    res.render('login');
  }
  
  function getRegister(req, res) {
    res.render('register');
  }
  
  function postLogin(req, res) {
    const { username, password } = req.user;
    res.render('productslists', { usuario: username });
  }
  
  function getLogout(req, res) {
    const { username, password } = req.user;
    console.log(username);
    req.session.destroy((err) => {
      if (err) {
        res.send('No se pudo deslogear');
      } else {
        res.render('logout', { usuario: username });
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
  
module.exports = {
    checkAuthentication,
    postSignup,
    getLogin,
    getRegister,
    postLogin,
    getMain,
    getLogout,
    getInfo,
  };