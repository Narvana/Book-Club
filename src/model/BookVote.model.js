const mongoose=require('mongoose');

const VoteSchema=new mongoose.Schema({
    VoteMonth:{
        type:String,
    },
    VoteYear:{
        type:String,
    },
    Votes:[String]
});

const BookVoteSchema = new mongoose.Schema({

    BookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required:[true,'Book ID is required']
    },
    VoteData: {
        type: VoteSchema,
        required: [true, 'Vote Data is required']
    }
    
});


const BookVote= mongoose.model('BookVote',BookVoteSchema);
module.exports= BookVote;