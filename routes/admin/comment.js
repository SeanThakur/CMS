const express = require('express');
const router = express.Router();
const {authenticate} = require('../../helpers/authentication');
const Comment = require('../../models/Comment');
const Post = require('../../models/Post');

router.all('/*', authenticate,(req,res,next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req,res) => {
    Comment.find({user: req.user.id}).populate('user').then(comment => {
        res.render('admin/comment/main', {comment: comment});
    });
});

router.post('/', (req,res) => {
    Post.findOne({_id: req.body.id}).then((PostComment) => {
        const newComment = new Comment({
            user: req.user.id,
            body: req.body.body
        });
        PostComment.comment.push(newComment);
        PostComment.save().then(comment => {
            newComment.save().then((commentSaved) => {
                res.redirect(`/post/${PostComment.id}`);
            });
        });
    });
});

router.delete('/:id', (req,res) => {
    Comment.remove({_id: req.params.id}).then(commentRemoved => {
        req.flash('Comment_removed', `Comment Deleted Successfully. `);
        res.redirect('/Videojet.admin/comment/');
    });
});

module.exports = router;