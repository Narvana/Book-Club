const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const Book=require('../model/Book.model');
const Comment = require('../model/comment.model');

const WriteComment = async(req,res,next)=>{
    try {
        const id=req.query.BookID
        const {email,name,comment} = req.body
    
        if(!id)
        {
            return next(ApiError(400,'Please Provide the Book ID'));
        }
        const BookFind = await Book.findById(id);
        if(!BookFind)
        {
            return next(ApiError(400,'No Book Found regarding the Provide Book ID'));
        }
        const CreateComment= new Comment({
            BookID:id,
            name,
            email,
            comment
        });
        const SaveComment = await CreateComment.save();
        return next(ApiSuccess(200,SaveComment,`${name} comment Saved Successfully`));        
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
        return next(ApiError(500, `An error occurred while voting for the book ${error.message} , ${error.stack}`));  
    }
}
  
const GetComments=async(req,res,next)=>{
    const {BookID} = req.query;
    if(!BookID)
    {
        return next(ApiError(400,'Please provide the BookID'));   
    }
    try {
        const Comments=await Comment.find({
            BookID
        })    
        if(Comments.length === 0)
        {
            return next(ApiError(400,'No Comment found'));
        }
        return next(ApiSuccess(200,Comments,'All Comment'));   
    } catch (error) {
        console.log(
        {
            'Internal Serve Error, ' : error.message,
            error
        }
        );
        
        return next(ApiError(500, `An error occurred while voting for the book ${error.message} , ${error.stack}`));          
    }
}

const DeleteComment=async(req,res,next)=>{

    try {
        const id=req.query.CommentID;
        if(!id)
        {
            return next(ApiError(400, `Comment ID is required`));
        }
        const FindComment = await Comment.findById(id);
        // console.log(FindComment);        
        if(!FindComment)
        {
            return next(ApiError(400, `No Comment found`));
        }
        await Comment.findByIdAndDelete(id);        
        return next(ApiSuccess(200,[],`Comment removed`));
    } catch (error) {
        console.log(
        {
            'Internal Serve Error, ' : error.message,
            error
        }
        );
        return next(ApiError(500, `An error occurred while voting for the book ${error.message} , ${error.stack}`));  
    }
}

module.exports={
    WriteComment,
    GetComments,
    DeleteComment
}
