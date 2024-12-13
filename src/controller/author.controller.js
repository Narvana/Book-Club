require('dotenv').config();

const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const {uploadToFirebase}=require('../middleware/ImageUpload/firebaseConfig');

const author=require('../model/author.model');
const Author = require('../model/author.model');

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

const UpdateAuthor=async(req,res,next)=>{
    const id=req.query.AuthorID;
    try {
        if(!id)
        {
            return next(ApiError(400,'Please provide Author ID'));
        }
        const author=await Author.findById(id);
        if(!author)
        {
            return next(ApiError(400,'No Auhtor found with the Provided Author ID'));
        }
        const {authorName,aboutAuthor}=req.body;

        let authorImageURL;

        if(req.file && req.file.fieldname === 'authorImage')
        {
            console.log('Author Image Uploading new to Firebase...');
            
            authorImageURL = await uploadToFirebase(req.file);
            if(!authorImageURL)
            {
                console.log('Upload Failed');
            }
            console.log('Image Uploaded');
        }
        else{
            authorImageURL=author.authorImage
        }

        const updateAuthor= await Author.findByIdAndUpdate(
            id,
            {
                $set:{
                    authorName,
                    aboutAuthor,
                    authorImage:authorImageURL
                }       
            },
            {new: true}
        );
        return next(ApiSuccess(200, updateAuthor ,`Author Update Succcessfully`));
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
    GetAuthor,
    UpdateAuthor
}