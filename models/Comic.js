const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Comic = new Schema({

    // Generic information
    publisher: {
        type: String,
        trim: true,
        default: ''
    },
    serie_title: {
        type: String,
        trim: true,
        default: ''
    },
    serie_number: {
        type: Number,
        min: 0
    },
    title: {
        type: String,
        trim: true,
        default: ''
    },
    pages: {
        type: Number,
        min: 0
    },
    release_date: Date,

    // Personal information
    in_collection: Boolean,
    read: {
        type: Boolean,
        default: false
    },
    read_date: {
        type: Date
    }
});

module.exports = mongoose.model('Comic', Comic);
