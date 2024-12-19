const mongoose=require('mongoose');

const BookWonSchema = new mongoose.Schema({
    // BookID: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Book',
    //     required:[true,'Book ID is required']
    // },
    Booktitle:{
        type: String,
        required: [true, 'Book title is required']
    },
    BookCover:{
        type: String,
        required: [true, 'Book Cover is required']
    },
    AuthorName:{
        type: String,
        required: [true, 'Author Name is required']
    },
    Month:{
        type:String,   
        required: [true, 'Month is required']
    },
    Year:{
        type:String,
        required: [true, 'Year is required']
    }
});


const BookWon= mongoose.model('BookWonVote',BookWonSchema);
module.exports= BookWon;