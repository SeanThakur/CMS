const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Categories = require('../../models/Categories');
const {authenticate} = require('../../helpers/authentication');
const Comment = require('../../models/Comment');

router.all('/*', authenticate,(req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/',(req,res) => {
    res.render('admin/main');
});

router.get('/create', (req,res) => {
    Categories.find({}).then(categories => {
        res.render('admin/create', {categories: categories});
    });
});

router.post('/create', (req,res) => {

    const newPost = new Post({
        title : req.body.title,
        body: req.body.body,
        Categories : req.body.Categories,
        user : req.user.id
    });

    newPost.save().then((PostSaved) => {
        req.flash('create_message', `${PostSaved.title} is Successfully Created`);
        res.redirect('/Videojet.admin/All_idea');
    }).catch((error) => {
        console.log(error);
    });

});

router.get('/edit/:id', authenticate,(req,res) => {
    Post.findOne({_id: req.params.id}).then(post => {
        Categories.find({}).then(cateShow => {
            res.render('admin/edit', {post: post, cateShow: cateShow});
        });
    });
});

router.put('/edit/:id', (req,res) => {
    Post.findOne({_id: req.params.id}).then(updatePost => {

        updatePost.title = req.body.title;
        updatePost.body = req.body.body;
        updatePost.Categories = req.body.Categories;
        updatePost.user = req.user.id;

        updatePost.save().then(savedd => {
            req.flash('edit_message', `${savedd.title} is Successfully Update`);
            res.redirect('/Videojet.admin/All_idea');
        });

    });
});

router.get('/All_idea', (req,res) => {
    Post.find({user: req.user.id}).populate('user').populate('Categories').then(posts => {
        res.render('admin/view_all', {posts:posts});
    });
});

router.delete('/:id', (req,res) => {
    Post.findOne({_id: req.params.id}).populate('comment').then(post => {

        if(!post.comment.length < 1)
        {
            post.comment.forEach(comment => {
                comment.remove();
            });     
        }
        post.remove();
        req.flash('delete_message', `${post.title} is Successfully Deleted`);
        res.redirect('/Videojet.admin/All_idea');
        
    });
});

module.exports = router;