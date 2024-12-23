const ContactUser = require('../model/ContactUser.model');
const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');


const AddContactUser = async(req,res,next)=>{
    try {
        const {email,name,message} = req.body
    
        const CreateContactUser= new ContactUser({
            name,
            email,
            message
        });
        const SaveContactUser = await CreateContactUser.save();
        return next(ApiSuccess(200,SaveContactUser,`${name} Contact info Saved Successfully`));        
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
  
const GetContactUser=async(req,res,next)=>{
   
    try {
        const ContactUsers=await ContactUser.find()    
        if(ContactUsers.length === 0)
        {
            return next(ApiError(400,'No User Contact found'));
        }
        return next(ApiSuccess(200,ContactUsers,'All User Contact'));   
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

const DeleteContactUser=async(req,res,next)=>{

    try {
        const id=req.query.UserID;
        if(!id)
        {
            return next(ApiError(400, `Contact User ID is required`));
        }
        const FindContactUser = await ContactUser.findById(id);
        if(!FindContactUser)
        {
            return next(ApiError(400, `No Contact User Found`));
        }
        await ContactUser.findByIdAndDelete(id);        
        return next(ApiSuccess(200,[],`User Contact removed`));
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
    AddContactUser,
    GetContactUser,
    DeleteContactUser
}
