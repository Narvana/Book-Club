const mongoose=require('mongoose');

const BookWonSchema = new mongoose.Schema({
    BookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required:[true,'Book ID is required']
    },
    Month:{
        type:String,   
    },
    Year:{
        type:String
    }
});


const BookWon= mongoose.model('BookWonVote',BookWonSchema);
module.exports= BookWon;