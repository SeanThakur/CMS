const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Categories = require('../../models/Categories');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req,res) => {
    res.render('home/main');
});

router.get('/index', (req,res) => {
    Post.find({}).populate('user').populate('Categories').then(post => {
        Categories.find({}).then(cate => {
            res.render('home/index', {post:post ,cate: cate});
        });
    });
});

router.get('/post/:id', (req,res) => {
    Post.findOne({_id: req.params.id}).populate({path:'comment', populate :{path: 'user', model: 'users'}}).populate('user').populate('Categories').then((post) => {
        Categories.find({}).then(cate => {
            res.render('home/post', {post: post,cate: cate});
        });
    });
});

router.get('/about', (req,res) => {
    res.render('home/about');
});

router.get('/register', (req,res) => {
    res.render('home/register');
});

router.post('/register', (req,res) => {
    
    if(req.body.password != req.body.confirmPassword)
    {
        req.flash('register_password', 'Password is not Matched. Try Again. ');
        res.redirect('/register');
    } else {

        User.findOne({email: req.body.email}).then((user) => {  //User email already TAken
            if(!user) //if email is new than execute else do not execute
            {

                const UserInfo = new User({
                    firstName: req.body.firstName,
                    email: req.body.email,
                    password: req.body.password
                }); 
                
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) throw err;
                        else {
                            bcrypt.hash(UserInfo.password, salt, (err, hash) => {
                                if(err) throw err;
                                else {
                                    UserInfo.password = hash;
                                    UserInfo.save().then(userSaved => {
                                        req.flash('register_success', `${userSaved.firstName} You Can Login.`);
                                        res.redirect('/login');
                                    });
                                }
                            });
                        }
                    });

            } else {

                req.flash('usernameTaken', 'This Email is Already Taken.');
                res.redirect('/register');

            }
        });
        
    }

});

router.get('/login', (req,res) => {
    res.render('home/login');
});

passport.use(new LocalStrategy({usernameField: 'email'}, (email,password,done) => {
    User.findOne({email: email}).then(user => {
        if(!user) { return done(null, false, {message: 'User Not Matched. '}) }
        bcrypt.compare(password, user.password, (err, matched) => {
            if(err) throw err;
            if(matched) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Incorrect Password. '});
            }
        });
    });
}));

//passport serialized and Deserialized For execution

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

router.post('/login',(req,res,next) => {
    passport.authenticate('local', { successRedirect: '/Videojet.admin',
                                   failureRedirect: '/login',
                                   failureFlash: true })(req,res,next);
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/index');
});

module.exports = router;