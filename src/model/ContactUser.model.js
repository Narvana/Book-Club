const mongoose=require('mongoose');
const validator=require('validator');

const ContactUserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,'Name is required for Contact Uses']
    },
    email:{
        type:String,
        required:[true,'Email is required for Contact Uses'],
        unique:true,
        validate:
        {
            validator(value){
                if(!validator.isEmail(value)){
                    throw new Error("Write a Valid Email")
                }
            }
        }
    },
    message:{
        type:String,
        required:[true,'Message is required for Contact Uses']
    },
}) 

const ContactUser =  mongoose.model('ContactUser',ContactUserSchema);
module.exports = ContactUser;