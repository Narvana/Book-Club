const express=require('express')

const router=express.Router();
const {EnterPodcast,GetPodcast,UpdatePodcast,RemovePodcast}=require('../controller/podcast.controller');
const  {verify}  = require('../middleware/verifyToken');

const { body} = require('express-validator');

const podcastValidationRules = [
    body('title')
        .isString()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters.'),
    body('description')
        .isString()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters.'),
    body('dateTime')
        .isISO8601()
        .withMessage('DateTime must be a valid date.'),
    body('videoLink')
        .isURL()
        .withMessage('Video link must be a valid URL.')
];


router.post('/Add',verify(['ADMIN']),...podcastValidationRules,EnterPodcast);
router.get('/Get',GetPodcast);
router.put('/Update',verify(['ADMIN']),...podcastValidationRules,UpdatePodcast);
router.delete('/Remove',verify(['ADMIN']),RemovePodcast); 

module.exports=router