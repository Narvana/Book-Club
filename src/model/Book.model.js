const mongoose=require('mongoose');

const BookSchema=new mongoose.Schema({
    title: {
        type:String,
        unique:true,
        required:[true,'Book Title is required']
    },
    authorID:{
        type: mongoose.Schema.Types.ObjectID,
        ref:'authors',
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
    }, 
    BookVote: {
        type: [String]
        // validate: [
        //     {
        //         validator: function (emails) {
        //             // Check if array contains only one email
        //             return emails.length === 1;
        //         },
        //         message: 'BookVote can only contain one email at a time.',
        //     },
        //     {
        //         validator: function (emails) {
        //             // Check if all emails are unique
        //             return new Set(emails).size === emails.length;
        //         },
        //         message: 'BookVote must contain unique email addresses.',
        //     },
        //     {
        //         validator: function (emails) {
        //             // Check if the email is valid
        //             return emails.every(email => validator.isEmail(email));
        //         },
        //         message: 'BookVote accepts only valid email addresses.',
        //     },
        // ],
    },
    
})

const Book = mongoose.model('Book',BookSchema);

module.exports = Book;