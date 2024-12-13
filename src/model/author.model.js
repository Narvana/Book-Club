const mongoose=require('mongoose');

const authorSchema=new mongoose.Schema({
    authorName: {
        type:String,
        required:[true,'Author Name is required']
    },
    aboutAuthor: {
        type:String,
        default:null
    },
    authorImage:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    }
})

const Author = mongoose.model('Author',authorSchema);

module.exports = Author;