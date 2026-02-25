const express = require('express')
require("dotenv").config();
const cors = require('cors');
const path=require('path');
const bodyParser = require('body-parser');
const methodOveride = require("method-override");
const database = require("./config/database");
const routeAdmin = require("./routes/admin/index.route");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const route = require("./routes/client/index.route");
const moment=require("moment");
const http=require("http");
const {Server}= require("socket.io");
const systemConfig = require("./config/system");

const app = express()
const port = process.env.PORT || 3001;

app.use(cors({
  origin: true, 
  credentials: true
}));

app.use(methodOveride('_method'));
app.use(bodyParser.urlencoded({ extended: false }))
database.connect();


//TimyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//End TimyMCE

app.set("views", "./view");

// App local variables

//FLASH
app.use(cookieParser("ONGDATCUTEPOY"));
app.use(session({
  cookie: { maxAge: 60000 } // 60s
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
//END FLASH

app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment=moment

app.set("view engine", "pug");
app.use(express.static("public"));
// Nhúng file tĩnh

// Socket io
const server= http.createServer(app);
const io= new Server(server);
global._io=io; // Biến toàn cục


// Socket io

// Route
routeAdmin(app);
route(app);
app.use((req, res) => {
  res.status(404).render("client/pages/error/404", {
    pageTitle: "404 Not Found"
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

