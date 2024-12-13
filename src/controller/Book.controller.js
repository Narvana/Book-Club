require('dotenv').config();

const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const {uploadToFirebase}=require('../middleware/ImageUpload/firebaseConfig');

const author=require('../model/author.model');
const Book=require('../model/Book.model');

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
        return next(ApiError(500, `Internal Server Error: ${error.message}`));
    }
}

const GetBooks=async(req,res,next)=>{

    try {
         const Books=await Book.aggregate([
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
            return next(ApiError(400, 'No Book Add'));
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

const GetAuthor=async(req,res,next)=>{
    try {
        const Author= await author.find();
        const AuthorCount=Author.length
        if(AuthorCount === 0)
        {
            return next(ApiError(400, 'No Author Found'));
        }
        return next(ApiSuccess(200, Author ,`Total Author Count -: ${AuthorCount}`));
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




module.exports={
    EnterBook,
    GetBooks,
    RemoveBook,
    GetAuthor,
    UpdateBook,
}