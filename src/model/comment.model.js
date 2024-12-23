const mongoose=require('mongoose');
const Book = require('./Book.model');

const CommentSchema = new mongoose.Schema({

    BookID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:Book,
        required:[true,'Book ID is required']
    },    
    email:{
        type:String,
        required:[true,'Email is required to comment']
    },
    comment:{
        type:String,
        required:[true,'Comment is required']
    },
    Timestamp: {
        type: Date,
        default: Date.now
    }
}) 

const Comment =  mongoose.model('Comment',CommentSchema);
module.exports = Comment;