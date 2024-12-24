require('dotenv').config();
const validator=require('validator');
const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const Book=require('../model/Book.model');
const BookVote = require('../model/BookVote.model');

const CreateAdminBookVote=async(req,res,next)=>{
    try {        
        // let {BookIDs}=req.body;

        // const Month=["January","February","March","April","May","June","July","August","September","October","November","December"];

        // const d = new Date();
        
        // let year = d.getFullYear();
        // let month= Month[d.getMonth()];

        // let VoteData={
        //     VoteMonth: month,
        //     VoteYear: year
        // }

        // BookIDs=req.body.BookIDs;

        // // console.log(BookIDs);
        

        // const BookLength=BookIDs.length;
        
        // // console.log(BookLength);
        
        
        // if(BookLength === 0){
        //     return next(ApiErrors(400,'Book IDs are required'));
        // }


        // for (const id of BookIDs) {            
        //     const CheckBook= await Book.findById(id);
        //     if(!CheckBook)
        //     {
        //         return next(ApiErrors(400,`Book with id -: ${id} not found `));
        //     }
        //     const CheckBookVote= await BookVote.find({
        //         'BookID':id,
        //         "VoteData.VoteMonth": VoteData.VoteMonth,
        //         "VoteData.VoteYear": VoteData.VoteYear
        //     })

        //     // return console.log(CheckBookVote[0].BookID.equals(id));
        
        //     if(CheckBookVote.length > 0 && CheckBookVote[0].BookID.equals(id))
        //     {
        //         return next(ApiErrors(400,`Book Vote with Book ID -: ${id}  already exist.`));
        //     }
        // }
        // for (const id of BookIDs) {            
        //     const AddBookVotes = new BookVote({
        //         VoteData,
        //         BookID: id
        //     });
        //     await AddBookVotes.save(); 
        // }

        // const bookVoteList = await BookVote.find({
        //     "VoteData.VoteMonth": VoteData.VoteMonth,
        //     "VoteData.VoteYear": VoteData.VoteYear
        // })
        // .populate({
        //     path: 'BookID', 
        //     select: 'title' // Only fetch the 'title' field
        // });

        // return next(ApiSuccess(200,bookVoteList,`BookVote List created for ${VoteData.VoteYear} `))

        const { BookIDs } = req.body;

        const Month = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const d = new Date();
        const year = d.getFullYear();
        const month = Month[d.getMonth()];

        const VoteData = {
            VoteMonth: month,
            VoteYear: year,
        };

        // 1. Validate Input
        if (!BookIDs || !BookIDs.length) {
            return next(ApiError(400, "Book IDs are required"));
        }

        // 2. Fetch All Books and Votes in Bulk
        const [books, existingVotes] = await Promise.all([
            Book.find({ _id: { $in: BookIDs } }), // Fetch all books in one query
            BookVote.find({
                BookID: { $in: BookIDs },
                "VoteData.VoteMonth": VoteData.VoteMonth,
                "VoteData.VoteYear":  VoteData.VoteYear,
            }).select('BookID'), // Fetch votes for the given month/year in one query
        ]);

        // console.log({books,existingVotes});
        
        // 3. Check for Missing Books and Existing Votes
        const validBookIDs = new Set(books.map((book) => book._id.toString()));
        
        const missingBooks = BookIDs.filter((id) => !validBookIDs.has(id));
        if (missingBooks.length) {
            return next(ApiError(400, `Books not found: ${missingBooks.join(", ")}`));
        }

        const existingVoteIDs = new Set(existingVotes.map((vote) => vote.BookID.toString()));

        const duplicateVotes = BookIDs.filter((id) => existingVoteIDs.has(id));

        if (duplicateVotes.length) {
            return next(ApiError(400, `Votes already exist for Books: ${duplicateVotes.join(", ")}`));
        }

        // 4. Prepare Bulk Insert Data
        const voteDataArray = BookIDs.map((id) => ({
            BookID: id,
            VoteData,
        }));

        // return console.log(voteDataArray);
        
        // 5. Batch Insert Votes
        await BookVote.insertMany(voteDataArray);

        // 6. Fetch and Return Updated Vote List
        const bookVoteList = await BookVote.find({
            "VoteData.VoteMonth": VoteData.VoteMonth,
            "VoteData.VoteYear": VoteData.VoteYear,
        }).populate({
            path: "BookID",
            select: "title",
        });

        return next(
            ApiSuccess(200, bookVoteList, `BookVote List created for ${year}`)
        );


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

const Vote=async(req,res,next)=>{

    const email=req.query.Email;
    const id=req.query.BookID;
    if(!id)
    {
        return next(ApiError(400,`Choose a the Book You want to vote for` ))
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
                // return   console.log(vote);         
                if (vote.VoteData.Votes.includes(email)) {
                    return next(ApiError(400, `${email} have already voted for book title ${vote.BookID.title}.`));
                } 
            }
            // return console.log('by');
            for (const vote of bookVote) {
                // return   console.log(vote.BookID._id);     
                if (vote.BookID && vote.BookID._id && vote.BookID._id.equals(id)) 
                { 
                    vote.VoteData.Votes.push(email); 
                    await vote.save();
                    return next(ApiSuccess(200,vote,`${email} voted for ${vote.BookID.title}`))
                }
            }
        }
        return next(ApiError(400,`No Book Found for voting for Month ${VoteData.VoteMonth} and Year ${VoteData.VoteYear}`));

        // VoteData.Votes = [email]; 
        // const newBookVote = new BookVote({
        //     BookID: id,
        //     VoteData,
        // });
        // const savedVote = await newBookVote.save();

        // return next(ApiSuccess(201,savedVote,`${email} voted for ${book.title}`))

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
                    BookVoteID: '$_id',
                    BookID:'$BookDetails._id',
                    title: '$BookDetails.title',     
                    BookCover: '$BookDetails.BookCover',     
                    VoteMonth: '$VoteData.VoteMonth',
                    VoteYear: '$VoteData.VoteYear',
                    AuthorName : '$AuthorDetails.authorName',
                    TotalVote: { $size: '$VoteData.Votes' }
                }                     
             },             {
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
                    // VotePercent: {
                    //     $cond: {
                    //         if: { $gt: ['$TotalVotesAcrossBooks', 0] }, // Avoid division by zero
                    //         then: {
                    //             $multiply: [
                    //                 { $divide: ['$Books.TotalVote', '$TotalVotesAcrossBooks'] },
                    //                 100, // Convert to percentage
                    //             ],
                    //         },
                    //         else: 0,
                    //     },
                    // },
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


        return next(ApiSuccess(200,
        {
            'VoteYear' : year,
            'VoteMonth':month,
            books
        }
        ,`Book Votes`));        
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

const RemoveBookVote=async(req,res,next)=>{
    try {
        const id=req.query.BookVoteID;
        if(!id)
        {
            return next(ApiError(400, `Please provide the Book Vote ID that you want to remove`));   
        }

        const CheckBookVote = await BookVote.findById(id);
        
        if(!CheckBookVote)
        {
            return next(ApiError(400, `No Book Vote found with provided ID`));   
        }
        await BookVote.findByIdAndDelete(id);

        return next(ApiSuccess(200,
            []
            ,`Book Vote Removed`));
    
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
    CreateAdminBookVote,
    Vote,
    getBookVote,
    getBookVotePercent,
    RemoveBookVote
}

