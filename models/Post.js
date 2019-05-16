const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user :{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    Categories: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }]
});

module.exports = mongoose.model('posts', PostSchema);