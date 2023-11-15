const dotenv = require('dotenv').config();
const express = require('express')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');



const app = express()
const port = process.env.PORT;
mongoose.set('strictQuery', true); // veya true
// DB Connect
require('./src/config/mongoDb');
// Mongoose bağlantısından sonra



// Router Settings
const homeRouter = require('./src/routers/homeRouter');
const adminRouter = require('./src/routers/adminRouter');
const authRouter = require('./src/routers/authRouter');
const editorRouter = require('./src/routers/editorRouter');

// Middleware (Gelen değerleri okumak)
app.use(express.urlencoded({ extended: true }));
app.use((error, request, response, next) => {
    response.send(error.message);
});
const errorMiddleware = require('./src/middlewares/errorMiddleware');

app.use(errorMiddleware); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Template Engine Settings
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');

const path = require('path');

app.use(expressLayouts);
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname,'./src/uploads/images')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views/pages'));
app.use( express.static( "./src/views/pages/user" ) );
app.use( express.static( "./src/views/pages/admin" ) );
app.use( express.static( "./src/views/pages/financer" ) );
app.use( express.static( "./src/views/pages/partials" ) );

// Session & Flash Message

const sessionStore = new MongoDBStore({
    uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'Sessions'
  });

  

  app.use(cookieParser());


app.use(session(
    {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        },
        store:sessionStore
    }
));
app.use(flash());
app.use((req, res, next) => {
    res.locals.validation_error = req.flash('validation_error');
    res.locals.iUserlogin_error = req.flash('iUserlogin_error');
    res.locals.success_message = req.flash('success_message');
    res.locals.email = req.flash('email');
    res.locals.ad = req.flash('ad');
    res.locals.soyad = req.flash('soyad');
    res.locals.login_error = req.flash('error');
    next();
});
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "X-My-Custom-Header, X-Another-Custom-Header");
    next(); 
});



app.use('/', homeRouter,authRouter);
app.use('/editor',editorRouter)
app.use('/admin', authRouter, adminRouter);

app.use((req, res) => {
    res.status(404).redirect('/')
});

app.listen(port,() => console.log(`KarabukUniv listening on port ${port}!`))