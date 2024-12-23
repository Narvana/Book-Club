const mongoose=require('mongoose');
const validator=require('validator');


const NewsletterSchema = new mongoose.Schema({
       email:{
           type:String,
           unique:true,
           required:[true,'Email is required for News Letter'],
           validate:
           {
               validator(value){
                  if(!validator.isEmail(value))
                  {
                    throw new Error("Write a Valid Email")
                  }
               }
           }
       }
});

const Newsletter = mongoose.model('Newsletter',NewsletterSchema);

module.exports=Newsletter;