const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');

const Filter=require('../model/Filter.model')

const updatepoll=async(req,res,next)=>{

    const {poll} = req.query;

    if(!poll)
    {
        return next(ApiError(400,'Please provide poll status'))    
    }

    try {      
        const checkFilter=await Filter.findOne();
        // return console.log(checkFilter);
        

        if(!checkFilter)
        {
            const createFilter=new Filter({
                poll
            })
            const filter=await createFilter.save();
            return next(ApiSuccess(200,filter,'Filter created'));
        }
        else if(checkFilter)
        {

            checkFilter.poll = poll
            await checkFilter.save();
            return next(ApiSuccess(200, checkFilter, 'Filter updated'));
        }
            
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
        return next(ApiError(500, `An error occurred ${error.message}`)); 
    }
}

const updateMonthYear=async(req,res,next)=>{

    const {month} = req.query;
    const {year}=req.query;

    const matchCondition={};
    
    if(month && year)
    {
        matchCondition['month'] = month;
        matchCondition['year'] = year;
    }
    else if(month){
        return next(ApiError(400, `Please Provide Year also`));   
    }
    else if(year){
        return next(ApiError(400, `Please Provide Month also`));   
    }
    else{
        return next(ApiError(400, `Please Provide Month and year`));     
    }

    // return console.log(matchCondition)

    try {
        const checkFilter=await Filter.findOne();    

        if(!checkFilter)
        {
            const createFilter=new Filter(
                matchCondition
            )
            const filter=await createFilter.save();
            return next(ApiSuccess(200,filter,'Filter created'));
        }
        else if(checkFilter)
        {
            checkFilter.month = matchCondition.month;
            checkFilter.year = matchCondition.year;
            await checkFilter.save();
            return next(ApiSuccess(200, checkFilter, 'Filter updated'));
        }
            
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

const updateDiscussion=async(req,res,next)=>{
    const {discussion} = req.query;

    if(!discussion)
    {
        return next(ApiError(400,'Please provide Discussion status'))    
    }

    try {      
        const checkFilter=await Filter.findOne();
        // return console.log(checkFilter);
        

        if(!checkFilter)
        {
            const createFilter=new Filter({
                discussion
            })
            const filter=await createFilter.save();
            return next(ApiSuccess(200,filter,'Filter created'));
        }
        else if(checkFilter)
        {

            checkFilter.discussion = discussion
            await checkFilter.save();
            return next(ApiSuccess(200, checkFilter, 'Filter updated'));
        }
            
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
        return next(ApiError(500, `An error occurred ${error.message}`)); 
    }
}

const getFilter=async(req,res,next)=>{
    try {
        const checkFilter=await Filter.findOne();    

        if(!checkFilter)
        {
            return next(ApiError(400,'Filter created'));
        }
        else if(checkFilter)
        {
            return next(ApiSuccess(200, checkFilter, 'Filter information'));
        }
            
    } catch (error) {
        console.log(
            {
                'Internal Serve Error, ' : error.message,
                error,
            }
        );
        return next(ApiError(500, `An error occurred while voting for the book ${error.message}, ${error.stack}`));    
    }  
}

module.exports={
    updatepoll,
    updateMonthYear,
    updateDiscussion,
    getFilter
}