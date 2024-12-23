require('dotenv').config();
const validator=require('validator');
const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const {uploadToFirebase}=require('../middleware/ImageUpload/firebaseConfig');

const author=require('../model/author.model');
const Book=require('../model/Book.model');
const { default: mongoose } = require('mongoose');
const BookVote = require('../model/BookVote.model');

const EnterBook =  async(req,res,next)=>{
    
    const {title,publication,summary,review,language,genre} = req.body;
    let { authorID } = req.body;
    try {
        if(!authorID)
        {
            const {authorName,aboutAuthor}=req.body;

            let authorImage = req.files.authorImage
            ? await uploadToFirebase(req.files.authorImage[0])
            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

    
            const AuthorData=new author({
                authorName,
                aboutAuthor,
                authorImage
            });
    
            const Author=await AuthorData.save();

            authorID=Author._id;
        }


        const BookCover = req.files.BookCover
            ? await uploadToFirebase(req.files.BookCover[0])
            : null;

        const bookData=new Book({
            title,
            authorID,
            publication,
            summary,
            review,
            language,
            genre,
            BookCover
        });

        const bookSave=await bookData.save();

        return next(ApiSuccess(201, bookSave ,'Book Added Successfully'));

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
        else if(error.code === 11000)
        {
            const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);
            console.log(cinMatch[1]);
            if(error.errorResponse.errmsg.includes('title'))
            {
                console.log(error);
                return next(ApiError(500, `Book with title ${cinMatch[1]} is already taken`));
            }
        }
        return next(ApiError(500, `Internal Server Error: ${error.message}`));
    }
}

const GetBooks=async(req,res,next)=>{

    const {id} = req.query;

    let matchCondition = {};

    if(id)
    {
        matchCondition['_id'] = new mongoose.Types.ObjectId(id);
    }    

    try {
         const Books=await Book.aggregate([
            {
                $match:matchCondition
            },
            {
                $lookup:{
                    from:'authors',
                    localField: 'authorID',
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
                    title:1,
                    publication:1,
                    summary : { $ifNull: ['$summary', null] },
                    review : { $ifNull: ['$review', null] },
                    language : { $ifNull: ['$language', null] },
                    genre : { $ifNull: ['$genre', null] },
                    BookCover : 1,
                    authorName: '$AuthorDetails.authorName',
                    aboutAuthor: {$ifNull: ['$AuthorDetails.aboutAuthor', null]},
                    authorImage: '$AuthorDetails.authorImage'
                }
            }
        ])

        let BookCount=Books.length;

        if(BookCount === 0)
        {
            return next(ApiError(400, 'No Book found'));
        }
        return next(ApiSuccess(200, Books ,`Total Books Count -: ${BookCount}`));
    } catch (error) {
        console.log(
            {
                'Internal Serve Error, ' : error.message,
                error
            }
        );
        return next(ApiError(500, `Internal Server Error: ${error.message}`));
    }
}

const UpdateBook=async(req,res,next)=>{
    const id=req.query.BookID;
    try 
    {
        if(!id)
        {
            return next(ApiError(400,'Please provide Book ID'));
        }
        const book=await Book.findById(id);
        if(!book)
        {
            return next(ApiError(400,'No Book found with the Provided Book ID'));
        }
        const {title,authorID,publication,summary,review,language,genre}=req.body;

        let BookCoverURL;

        if(req.file && req.file.fieldname === 'BookCover')
        {
            console.log('Image Uploading new book cover to Firebase...');
            
            BookCoverURL = await uploadToFirebase(req.file);
            if(!BookCoverURL)
            {
                console.log('Upload Failed');
            }
            console.log('Image Uploaded');
        }
        else{
            BookCoverURL=book.BookCover
        }

        const updateBook= await Book.findByIdAndUpdate(
            id,
            {
                $set:{
                    title,
                    authorID,
                    publication,
                    summary,
                    review,
                    language,
                    genre,
                    BookCover:BookCoverURL
                }       
            },
            {new: true}
        );
        return next(ApiSuccess(200, updateBook ,`Book Update Succcessfully`));
    } catch (error) {
        console.log(
            {
                'Internal Serve Error, ' : error.message,
                error
            }
        );
        return next(ApiError(500, `Internal Server Error: ${error.message}`));
    }   
}

const RemoveBook=async(req,res,next)=>{
    
    const id=req.query.BookID;
    try {
        if(!id)
        {
            return next(ApiError(400,'Please provide Book ID'));
        }
        const book=await Book.findById(id);
        if(!book)
        {
            return next(ApiError(400,'No Book found with the Provided Book ID'));
        }
        const CheckBookVote= await BookVote.find({
            BookID:id
        })
        // let BookVoteID=[];
        if(CheckBookVote.length > 0)
        {
            // CheckBookVote.map((BookVote)=>{
            //     BookVoteID.push(BookVote._id);
            // })
            // await BookVote.deleteMany(BookVoteID);
            await BookVote.deleteMany({ _id: { $in: CheckBookVote.map(vote => vote._id) } });
        }       
        // return console.log(BookVoteID); 
        await book.deleteOne();
        return next(ApiSuccess(200, [] ,`Book Removed`));
    } catch (error) {
        console.log(
            {
                'Internal Serve Error, ' : error.message,
                error
            }
        );
        return next(ApiError(500, `Internal Server Error: ${error.message}`));
    }
}


// const BookVote=async(req,res,next)=>{
//     const email=req.query.Email;
//     const id=req.query.BookID;
//     if(!id)
//     {
//         return next(ApiError(400,'Choose a the Book You want to vote for'))
//     }
//     else if(!email)
//     {
//      return next(ApiError(400,'Enter Your Email to Vote'))
//     }

//     const BookVote= await Book.findByIdAndUpdate(
//         id,
//         {
//             $set:{
//                 BookVote : (...BookVote,email)
//             }
//         }

//     );
// }
// const BookVote = async (req, res, next) => {
//     try {
//         const email = req.query.Email;
//         const id = req.query.BookID;

//         if (!id) {
//             return next(ApiError(400, 'Choose the book you want to vote for.'));
//         }

//         if (!email) {
//             return next(ApiError(400, 'Enter your email to vote.'));
//         }

//         // Validate email format
//         if (!validator.isEmail(email)) {
//             return next(ApiError(400, 'Enter a valid email address.'));
//         }

//         // Find the book and ensure uniqueness of email in BookVote array
//         const book = await Book.findById(id);

//         if (!book) {
//             return next(ApiError(404, 'Book not found.'));
//         }
//         if (book.BookVote.includes(email)) {
//             return next(ApiError(400, 'You have already voted for this book.'));
//         }

//         book.BookVote.push(email);

//         await book.save();

//         return next(ApiSuccess(200,book,`${email} voted for ${book.title}`))

//     } catch (error) {
//         console.log(
//             {
//                 'Internal Serve Error, ' : error.message,
//                 error
//             }
//         );

//         return next(ApiError(500, `An error occurred while voting for the book ${error.message}`));
//     }
// };

// const TotalVoteData=async(req,res,next)=>{

//     // const book=await Book.find();

//     // let TotalVote=0

//     // book.map((Book)=>{
//     //     vote=Book.BookVote.length
//     //     TotalVote += vote;
//     // })

//     // const BookVote=await Book.aggregate([
//     //     {
//     //         $lookup:{
//     //             from:'authors',
//     //             localField: 'authorID',
//     //             foreignField: '_id',
//     //             as: 'AuthorDetails'
//     //         }
//     //     },
//     //     {
//     //         $unwind:{
//     //             path:'$AuthorDetails'
//     //         }
//     //     },
//     //     {
//     //         $project:{
//     //             title:1,
//     //             BookCover:1,
//     //             Author: '$AuhtorDetails.authorName',
//     //             TotalVote: { $size: "$BookVote" },
//     //             VotePercent: '$BookVote'/TotalVote
//     //         }
//     //     }
//     // ])

//     // return next(ApiSuccess(200,{
//     //     TotalVote,
//     //     BookVote
//     // },'Votes'))
//     const BookVote = await Book.aggregate([
//         {
//             $lookup: {
//                 from: 'authors', // Join with authors collection
//                 localField: 'authorID', // Field in Book collection
//                 foreignField: '_id', // Field in authors collection
//                 as: 'AuthorDetails', // Output array field
//             },
//         },
//         {
//             $unwind: {
//                 path: '$AuthorDetails', // Flatten AuthorDetails array
//             },
//         },
//         {
//             $project: {
//                 title: 1,
//                 BookCover: 1,
//                 Author: '$AuthorDetails.authorName', // Fixed typo
//                 TotalVote: { $size: '$BookVote' }, // Total votes for each book
//             },
//         },
//         {
//             $group: {
//                 _id: null, // Group all documents together
//                 TotalVotesAcrossBooks: { $sum: '$TotalVote' }, // Sum of all votes
//                 Books: { $push: '$$ROOT' }, // Push the book details
//             },
//         },
//         {
//             $unwind: {
//                 path: '$Books', // Unwind Books array for further processing
//             },
//         },
//         {
//             $project: {
//                 _id: '$Books._id',
//                 title: '$Books.title',
//                 BookCover: '$Books.BookCover',
//                 Author: '$Books.Author',
//                 TotalVote: '$Books.TotalVote',
//                 VotePercent: {
//                     $cond: {
//                         if: { $gt: ['$TotalVotesAcrossBooks', 0] }, // Avoid division by zero
//                         then: {
//                             $multiply: [
//                                 { $divide: ['$Books.TotalVote', '$TotalVotesAcrossBooks'] },
//                                 100, // Convert to percentage
//                             ],
//                         },
//                         else: 0,
//                     },
//                 },
//             },
//         },
//     ]);
    
//     return next(
//         ApiSuccess(200, {
//             TotalVotes: BookVote.reduce((sum, book) => sum + book.TotalVote, 0),
//             BookVote,
//         }, 'Votes')
//     );
// }

module.exports={
    EnterBook,
    GetBooks,
    RemoveBook,
    UpdateBook,
    // BookVote,
    // TotalVoteData
}