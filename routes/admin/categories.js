const express = require('express');
const router = express.Router();
const Categories = require('../../models/Categories');
const {authenticate} = require('../../helpers/authentication');

router.all('/*', (req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', authenticate ,(req,res) => {
    Categories.find({}).then((categories) => {
        res.render('admin/categories/main', {categories: categories});
    });
});

router.post('/create', (req,res) => {
    const newCategories = new Categories({
        name : req.body.name
    });

    newCategories.save().then((categories) => {
        req.flash('create_message_cat', `${categories.name} is Successfully Created`);
        res.redirect('/Videojet.admin/categories/');
    });
});

router.get('/edit/:id', authenticate, (req,res) => {
    Categories.findOne({_id: req.params.id}).then((category) => {
        res.render('admin/categories/edit', {category: category});
    });
});

router.put('/edit/:id' , (req,res) => {
    Categories.findOne({_id: req.params.id}).then((categoryUpdate) => {

        categoryUpdate.name = req.body.name;

        categoryUpdate.save().then((updated) => {
            req.flash('edit_message_cat', `${updated.name} is Successfully Updated`);
            res.redirect('/Videojet.admin/categories/');
        });
    });
});

router.delete('/:id', (req,res) => {
    Categories.remove({_id: req.params.id}).then((savedCate) => {
        req.flash('delete_message_cat', `${savedCate.name} is Successfully Deleted`);
        res.redirect('/Videojet.admin/categories/');
    });
});

module.exports = router;