const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({

    name: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('categories', CategoriesSchema);