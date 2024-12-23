const mongoose=require('mongoose');
const validator=require('validator');

const CommentSchema = new mongoose.Schema({

    BookID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:[true,'Book ID is required']
    },    
    name:{
        type:String,
        required:[true,'Name is required to comment']
    },
    email:{
        type:String,
        required:[true,'Email is required to comment'],
        validate:
        {
            validator(value){
                if(!validator.isEmail(value)){
                    throw new Error("Write a Valid Email")
                }
            }
        }
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