const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const author=require('../model/author.model');
const Book=require('../model/Book.model');
const BookVote=require('../model/BookVote.model');
const BookWon=require('../model/BookWon.model');

const CheckWinner= async(req,res,next)=>{

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
                    BookVoteID: '$_id',
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
                    _id: '$Books.BookVoteID',
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

        // return console.log(bookWithMaxVotePercent);        

        const CheckBookWon=await BookWon.find({
                 Month: month,
                 Year: year
        });

        if(CheckBookWon.length === 1)
        {
            CheckBookWon[0].BookID = bookWithMaxVotePercent.BookID;
            // CheckBookWon[0].Booktitle = bookWithMaxVotePercent.title;
            // CheckBookWon[0].BookCover = bookWithMaxVotePercent.BookCover;
            // CheckBookWon[0].AuthorName = bookWithMaxVotePercent.AuthorName;

            await CheckBookWon[0].save();

            // const updatedBookWon = await CheckBookWon;
        
            return next(ApiSuccess(200, CheckBookWon[0], `Book Won ${bookWithMaxVotePercent.title} updated with book details`));
        }
        const CreateBookWon= new BookWon({
            BookID:bookWithMaxVotePercent.BookID,
            // Booktitle:bookWithMaxVotePercent.title,
            // BookCover:bookWithMaxVotePercent.BookCover,
            // AuthorName:bookWithMaxVotePercent.AuthorName,
            Month:month,
            Year:year
        });
        await CreateBookWon.save();

        const newBookWon = await BookWon.findById(CreateBookWon._id);
        // .populate({
        //     path: 'BookID',
        //     select: 'title author description' 
        // });
        
        return next(ApiSuccess(200, newBookWon, `Book Won ${bookWithMaxVotePercent.title} created with book details`));        

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
                return next(ApiError(500,`Validation error -: ${errorMessages[0]}`));            
            }

        return next(ApiError(500, `An error occurred while voting for the book ${error.message}`));   
    }
}

const GetBookWinner = async(req,res,next)=>{
    try {
        const Month = req.query.month;
        const Year=req.query.year;
    
        const matchCondition={};
        
        if(Month && Year)
        {
            matchCondition['Month'] = Month;
            matchCondition['Year'] = Year;
        }
        else if(Month){
            return next(ApiError(400, `Please Provide Year also`));   
        }
        else if(Year){
            return next(ApiError(400, `Please Provide Month also`));   
        }
    
        // console.log({matchCondition});
    
        
        const getBookWon = await BookWon.aggregate([
            {
                $match: matchCondition
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
                    BookID: '$BookDetails._id',
                    BookCover:'$BookDetails.BookCover',
                    title: '$BookDetails.title',     
                    AuthorName:'$AuthorDetails.authorName',
                    Month:1,
                    Year:1
                }
            }
        ]);
    
        if(!getBookWon.length)
        {
            return next(ApiError(400, `No Book Found`));    
        }
        return next(ApiSuccess(200,getBookWon,`Book Won`));   
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
    CheckWinner,
    GetBookWinner
}