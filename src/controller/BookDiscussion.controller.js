require('dotenv').config();
const validator=require('validator');
const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const Book=require('../model/Book.model');

const BookDiscussion = require('../model/BookDiscussion.model');

const AddBookDiscussion=async(req,res,next)=>{

    const id=req.query.BookID;
    const {DiscussionDate,DiscussionStartTime,DiscussionEndTime}=req.body;
    let BookFind;

    try 
    {
        if(id)
        {
            BookFind=await Book.findById(id);
            if(!BookFind)
            {
                return next(ApiError(400,`Book Not Found with provided Book ID`))
            }
        }
        const BookDiscussionResult= await BookDiscussion.findOne();
        if(!BookDiscussionResult){
            const CreateDiscussion=new BookDiscussion({
                BookID:id,
                DiscussionDate,
                DiscussionStartTime,
                DiscussionEndTime
            })
            const SaveDiscussion = await CreateDiscussion.save();
            
            return next(ApiSuccess(200,SaveDiscussion,'Discussion Form created'));        
        } 
        BookDiscussionResult.BookID = id || BookDiscussionResult.DiscussionDate;    
        BookDiscussionResult.DiscussionDate = DiscussionDate || BookDiscussionResult.DiscussionDate;
        BookDiscussionResult.DiscussionStartTime = DiscussionStartTime || BookDiscussionResult.DiscussionStartTime;
        BookDiscussionResult.DiscussionEndTime = DiscussionEndTime || BookDiscussionResult.DiscussionEndTime;

        await BookDiscussionResult.save();
        return next(ApiSuccess(200,BookDiscussionResult,'Discussion Form Updated'));       
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
        return next(ApiError(500, `Internal Serve Error-: ${error.message} , ${error.stash}`)); 
    }
}

const getBookDiscussion=async(req,res,next)=>{
    

    const FindBookDiscussion= await BookDiscussion.aggregate(
        [
            {
                $lookup:{
                    from:"books",
                    localField:"BookID",
                    foreignField: "_id",
                    as: "BookDetails"                    
                }
            },
            {
                $unwind:{
                    path:'$BookDetails'
                }
            },
            {
                $lookup:{
                    from:"authors",
                    localField:"BookDetails.authorID",
                    foreignField: "_id",
                    as: "AuthorDetails"                    
                }
            },
            {
                $unwind:{
                    path:'$AuthorDetails'
                }
            },
            {
                $addFields:
                  {
                      FormattedDiscussionDate: {
                          $dateToString: {
                              format: '%Y-%m-%d',
                              date: '$DiscussionDate',
                              timezone: 'Asia/Kolkata' // Optional: Specify timezone if required
                          }
                      }
                }
             },
            {
                $project:{
                    BookTitle:"$BookDetails.title",
                    BookCover:"$BookDetails.BookCover",
                    Author:"$AuthorDetails.authorName",
                    DiscussionDate:"$FormattedDiscussionDate",
                    DiscussionStartTime: 1,
                    DiscussionEndTime: 1
                }
            }
        ]
    );

    if(!FindBookDiscussion)
    {
        return next(ApiError(404,'No Book Disscusion Found'))
    }
    return next(ApiSuccess(200,FindBookDiscussion,'Book Disscusion Found'))

}

module.exports={
    AddBookDiscussion,
    getBookDiscussion
}