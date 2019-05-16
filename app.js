const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');

const app = express();

const {mongodb} = require('./config/data');

//mongoose connection
mongoose.connect(mongodb, { useNewUrlParser: true }).then(db => {
    console.log('Mongodb is connected.');
}).catch(error => {
    console.log('Some Error ' + error);
});

//helpers for the server
const {generateDate} = require('./helpers/date');
const {select} = require('./helpers/select');

//template engine
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {generateDate: generateDate, select:select}}));
app.set('view engine', 'handlebars');

//expres public static path
app.use(express.static(path.join(__dirname , './public')));

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//methodOverride middleware
app.use(methodOverride('_method'));

//Sessions and the flash messages middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));

//flash middlware
app.use(flash());

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//using the flash message to display

app.use((req,res,next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    next();
});

app.use((req,res,next) => {

    res.locals.usernameTaken = req.flash('usernameTaken');
    res.locals.register_success = req.flash('register_success');
    res.locals.register_password = req.flash('register_password');
    res.locals.Comment_removed = req.flash('Comment_removed');
    res.locals.create_message = req.flash('create_message');
    res.locals.edit_message = req.flash('edit_message');
    res.locals.delete_message = req.flash('delete_message');
    res.locals.create_message_cat = req.flash('create_message_cat');
    res.locals.edit_message_cat = req.flash('edit_message_cat');
    res.locals.delete_message_cat = req.flash('delete_message_cat');
    next();

});

//routes location and links
const home = require('./routes/home/main');
const admin = require('./routes/admin/main');
const categories = require('./routes/admin/categories');
const comment = require('./routes/admin/comment');

app.use('/', home);
app.use('/Videojet.admin', admin);
app.use('/Videojet.admin/categories', categories);
app.use('/Videojet.admin/comment', comment);

//Port to listen
const port = process.env.PORT || 3000; //This line is for deployment changing to make it online

app.listen(port, () => {
    console.log('Ports Working');
});