const mongoose=require('mongoose');

const BookSchema=new mongoose.Schema({
    title: {
        type:String,
        unique:true,
        required:[true,'Book Title is required']
    },
    authorID:{
        type: mongoose.Schema.Types.ObjectID,
        ref:'Author',
        required:[true,'Author Data is required']
    },
    publication: {
        type:String,
        required:[true,'Publication is required']
    },
    summary: { 
        type:String,
    },
    review: {
        type:String,
    },
    language:{
        type:String,
    },
    genre: {
        type:String,
        required:[true,'Book Title is required']
    },
    BookCover:{
        type:String,
        required:[true,'Book Cover Image is required']
    }    
})

const Book = mongoose.model('Book',BookSchema);

module.exports = Book;