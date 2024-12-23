const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const Newsletter = require('../model/newsletter.model');

const AddNewsletter=async(req,res,next)=>{

    try {
        const {email}=req.body;

        const CreateNewsLetter=new Newsletter({
            email
        })
        const NewsLetter=await CreateNewsLetter.save();   
        return next(ApiError(200, NewsLetter,`${email}, Added to NewsLetter`));
    } catch (error) {
        console.log(
        {
            'Internal Serve Error, ' : error.message,
            error
        });
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            return next(ApiError(500,`Validation error -: ${errorMessages[0]}`));            
        }
        else if (error.code === 11000) 
        {
            const duplicateKey = Object.keys(error.keyValue)[0];
            const duplicateValue = error.keyValue[duplicateKey];

            if (duplicateKey === 'email') {
                return next(ApiError(500, `This email is already taken: ${duplicateValue}`));
            }
        }
        return next(ApiError(500, `An error occurred ${error.message} , ${error.stack}`));  
    }
}

const GetNewsLetters=async(req,res,next)=>{
    try {
        const NewsLetters=await Newsletter.find();    
        if(NewsLetters.length === 0)
        {
            return next(ApiError(400,'No NewsLetters found'));
        }
        return next(ApiSuccess(200,NewsLetters,'All NewsLetters'));   
    } catch (error) {
        console.log(
        {
            'Internal Serve Error, ' : error.message,
            error
        }
        );
        
        return next(ApiError(500, `An error occurred ${error.message} , ${error.stack}`));          
    }
}

const DeleteNewsLetter=async(req,res,next)=>{
    try {
        const id=req.query.NewsLetterID;
        if(!id)
        {
            return next(ApiError(400, `NewsLetter ID is required`));
        }
        const FindNewsLetter = await Newsletter.findById(id);
        // console.log(FindComment);        
        if(!FindNewsLetter)
        {
            return next(ApiError(400, `No NewsLetter found`));
        }
        await Newsletter.findByIdAndDelete(id);        
        return next(ApiSuccess(200,[],`NewsLetter removed`));
    } catch (error) {
        console.log(
        {
            'Internal Serve Error, ' : error.message,
            error
        }
        );
        return next(ApiError(500, `An error occurred ${error.message} , ${error.stack}`));  
    }
}

module.exports={
    AddNewsletter,
    GetNewsLetters,
    DeleteNewsLetter
}
