require('dotenv').config();
const ApiError = require('../utils/ApiResponse/ApiError');
const ApiSuccess = require('../utils/ApiResponse/ApiSuccess');
const mongoose = require('mongoose');
const Podcast = require('../model/podcast.model');
const { validationResult } = require('express-validator');

const EnterPodcast =  async(req,res,next)=>{
        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(ApiError(400, errors.errors[0].msg)); // Return validation errors
    }

    const {title,description,dateTime,videoLink} = req.body;

    try {

        const podcast=new Podcast({
            title,
            description,
            dateTime: new Date(dateTime),
            videoLink
        });
        const PodcastSave=await podcast.save();

        return next(ApiSuccess(201, PodcastSave ,'Podcast Added Successfully'));

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

const GetPodcast=async(req,res,next)=>{

    const latestQuery = req.query.latest;

        // Convert latest to a boolean if provided
        let latest = null;
        if (latestQuery !== undefined) {
            if(latestQuery === 'true')
            {
                latest = latestQuery === 'true';
            }
            else if(latestQuery === 'false')
            {
                latest = latestQuery === 'true';
            }

        }

        // Build match condition
        const matchCondition = {};
        if (latest !== null) {
            matchCondition.latest = latest;  // Use boolean value for matching
        }
         console.log(matchCondition);
    
    try {
        const PodcastData=await Podcast.aggregate([
            {
                $match: matchCondition
            }
           ]
        );


        if(PodcastData.length === 0)
        {
            return next(ApiError(400,'No Podcast found'));   
        }
        return next(ApiSuccess(200, PodcastData ,'Podcast List'));
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

const UpdatePodcast=async(req,res,next)=>{
    const id=req.query.PodID;
    try 
    {
        if(!id)
        {
            return next(ApiError(400,'Please provide Podcast ID'));
        }
        const podcast=await Podcast.findById(id);
        if(!podcast)
        {
            return next(ApiError(400,'No podcast found with the Provided podcast ID'));
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return next(ApiError(400, errors.errors[0].msg)); // Return validation errors
        }    

        const {title, description, dateTime, latest, videoLink}=req.body;
        

        if((!title || title.trim() === '') && (!description || description.trim() === '') && (!dateTime || dateTime.trim() === '') && ( !videoLink || videoLink.trim() === '') && (!latest))
        {
            return next(ApiError(400,'No data provided to update'));   
        }
        if(latest && latest === "true")
        {            
            const CheckLatestPodcast = await Podcast.find({
                // _id: new mongoose.Types.ObjectId(id),
                latest: true
            });

            if(CheckLatestPodcast.length > 0)
            {
                return next(ApiError(400,'There is already One Latest Podcast'));   
            }
        }
        

        const UpdatePodcast = await Podcast.findByIdAndUpdate(
            id,
            {
                $set:{
                    title,
                    description,
                    dateTime,
                    latest,
                    videoLink
                }       
            },
            {
                new: true
            }
        );
        return next(ApiSuccess(200, UpdatePodcast ,`Podcast Update Succcessfully`));
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

const RemovePodcast=async(req,res,next)=>{
    
    const id=req.query.PodID;
    try {
        if(!id)
        {
            return next(ApiError(400,'Please provide Podcast ID'));
        }
        const podcast=await Podcast.findById(id);
        if(!podcast)
        {
            return next(ApiError(400,'No Podcast found with the Provided Podcast ID'));
        }
        await Podcast.findByIdAndDelete(id);
        return next(ApiSuccess(200, [] ,`Podcast Removed`));
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
    EnterPodcast,
    GetPodcast,
    UpdatePodcast,
    RemovePodcast
}