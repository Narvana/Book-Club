require('dotenv').config();
const validator=require('validator');
const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const Book=require('../model/Book.model');
const BookVote = require('../model/BookVote.model');

const Vote=async(req,res,next)=>{

    const email=req.query.Email;
    const id=req.query.BookID;
    if(!id)
    {
        return next(ApiError(400,'Choose a the Book You want to vote for'))
    }
    else if(!email)
    {
     return next(ApiError(400,'Enter Your Email to Vote'))
    }

    try{
        // Validate email format
        if (!validator.isEmail(email)) {
            return next(ApiError(400, 'Enter a valid email address.'));
        }

        // Find the book and ensure uniqueness of email in BookVote array
        const book = await Book.findById(id);

        if (!book) {
            return next(ApiError(404, 'Book not found.'));
        }

        const Month=["January","February","March","April","May","June","July","August","September","October","November","December"];

        const d = new Date();
        
        let year = d.getFullYear();
        let month= Month[d.getMonth()];

        let VoteData={
            VoteMonth: month,
            VoteYear: year
        }

        const bookVote = await BookVote.find({
            "VoteData.VoteMonth": VoteData.VoteMonth,
            "VoteData.VoteYear": VoteData.VoteYear
        })
        .populate({
            path: 'BookID', 
            select: 'title' // Only fetch the 'title' field
        });

    //  return   console.log(bookVote);  

        if(bookVote.length > 0)
        {    
           
                    
            for (const vote of bookVote) {            
                if (vote.VoteData.Votes.includes(email)) {
                    return next(ApiError(400, `${email} have already voted for book title ${vote.BookID.title}.`));
                } 
            }
            // return console.log('by');
            for (const vote of bookVote) {
                if (vote.BookID._id.equals(id)) 
                { 
                    vote.VoteData.Votes.push(email); 
                    await vote.save();
                    return next(ApiSuccess(200,vote,`${email} voted for ${vote.BookID.title}`))
                    // votedBook = vote; 
                    // break; 
                }
            }
        }
        VoteData.Votes = [email]; 
        const newBookVote = new BookVote({
            BookID: id,
            VoteData,
        });
        const savedVote = await newBookVote.save();

        return next(ApiSuccess(201,savedVote,`${email} voted for ${book.title}`))

    } catch (error) {
        console.log(
            {
                'Internal Serve Error, ' : error.message,
                error
            }
        );
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            return next(ApiError(500,errorMessages[0]));            
        }
        return next(ApiError(500, `An error occurred while voting for the book ${error.message}`));
    }
}

const getBookVote=async(req,res,next)=>{
    
    try {
        const book=await BookVote.aggregate([
            {
               $lookup:{
                    from:'books',
                    localField: 'BookID',
                    foreignField: '_id',
                    as: 'BookDetails'
                }
            },
            {
                $unwind:{
                    path:'$BookDetails'
                }
            },
            {
                $project:{
                    title: '$BookDetails.title',     
                    VoteData:1
                }                        
            }
        ]);
        if(book.length === 0)
        {
            return next(ApiError(400, `No Book Found that has been voted`));   
        }
        return next(ApiSuccess(201,book,`Book Votes`))        
    } catch (error) {
        console.log(
            {
                'Internal Serve Error, ' : error.message,
                error
            }
        );

        return next(ApiError(500, `An error occurred while voting for the book ${error.message}`));   
    }
}

const getBookVotePercent=async(req,res,next)=>{

    const Month=["January","February","March","April","May","June","July","August","September","October","November","December"];

    const d = new Date();

    let year = d.getFullYear();
    let month= Month[d.getMonth()];

    try {
        const books=await BookVote.aggregate([
            {
                $match:{
                    'VoteData.VoteMonth': month,
                    'VoteData.VoteYear': `${year}`,
                }
            },
            {
               $lookup:{
                    from:'books',
                    localField: 'BookID',
                    foreignField: '_id',
                    as: 'BookDetails'
                }
            },
            {
                $unwind:{
                    path:'$BookDetails'
                }
            },
            {
                $lookup:{
                     from:'authors',
                     localField: 'BookDetails.authorID',
                     foreignField: '_id',
                     as: 'AuthorDetails'
                 }
             },
             {
                 $unwind:{
                     path:'$AuthorDetails'
                 }
             },
            {
                $project:{
                    BookID:'$BookDetails._id',
                    title: '$BookDetails.title',     
                    BookCover: '$BookDetails.BookCover',     
                    VoteMonth: '$VoteData.VoteMonth',
                    VoteYear: '$VoteData.VoteYear',
                    AuthorName : '$AuthorDetails.authorName',
                    TotalVote: { $size: '$VoteData.Votes' }
                }                     
            },
            {
                $group: {
                    _id: null,
                    TotalVotesAcrossBooks: { $sum: '$TotalVote' }, 
                    Books: { $push: '$$ROOT' },
                },
            },
            {
                $unwind: {
                    path: '$Books',
                },
            },
            {
                $project: {
                    BookID: '$Books.BookID',
                    title: '$Books.title',
                    BookCover: '$Books.BookCover',
                    AuthorName: '$Books.AuthorName',
                    TotalVote: '$Books.TotalVote',
                    VotePercent: {
                        $cond: {
                            if: { $gt: ['$TotalVotesAcrossBooks', 0] }, // Avoid division by zero
                            then: {
                                $multiply: [
                                    { $divide: ['$Books.TotalVote', '$TotalVotesAcrossBooks'] },
                                    100, // Convert to percentage
                                ],
                            },
                            else: 0,
                        },
                    },
                    VotePercent: {
                        $round: {
                            $cond: {
                                if: { $gt: ['$TotalVotesAcrossBooks', 0] }, // Avoid division by zero
                                then: {
                                    $multiply: [
                                        { $divide: ['$Books.TotalVote', '$TotalVotesAcrossBooks'] },
                                        100, // Convert to percentage
                                    ],
                                },
                                else: 0,
                            },
                        },
                    },
                },
            }
        ]);

        const bookWithMaxVotePercent = books.reduce((max, book) => {
            return book.VotePercent > max.VotePercent ? book : max;
        }, books[0]);
        
        console.log(bookWithMaxVotePercent);

        return next(ApiSuccess(201,
        {
            'VoteYear' : year,
            'VoteMonth':month,
            books
        }
        ,`Book Votes`))        
    } catch (error) {
        console.log(
            {
                'Internal Serve Error, ' : error.message,
                error
            }
        );

        return next(ApiError(500, `An error occurred while voting for the book ${error.message}`));   
    }
}

module.exports={
    Vote,
    getBookVote,
    getBookVotePercent
}

