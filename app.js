require ('dotenv').config();
const express = require ('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB= require ('./server/config/db');
const cookieParser= require ('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const PORT =5000 || process.env.PORT;

//Connect to the database
connectDB();

//medileware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
    }),
    //cookie expiration date
    //cookie:{maxAge: new Date (Date.now () + (3600000))}
}));


app.use(express.static('public'));

//Templating engiine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//admin pages

app.use('/' , require('./server/routes/main'));
app.use('/' ,require('./server/routes/admin'));



app.use('/', require('./server/routes/main'));
app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`)
});