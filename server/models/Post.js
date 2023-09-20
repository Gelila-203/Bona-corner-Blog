const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema ({

    title:{
        type: String ,
        require: true
    },
    image:{
        type: String,
        require: false
    },
    body:{
        type: String ,
        require: true
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
    updatedSt:{
        type: Date,
        default: Date.now
    }
});

module.exports =mongoose.model('Post',PostSchema);