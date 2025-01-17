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
        .isString()
        .withMessage('Video link must be a valid URL.'),
    body('latest')
         .optional()
        .isBoolean()
        .withMessage('latest must be either true or false.')
];

/**
 * @swagger
 * /api/Podcast/Add:
 *   post:
 *     summary: Add a new podcast
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Future of Technology"
 *                 description: "Title of the podcast, must be between 3 and 100 characters."
 *               description:
 *                 type: string
 *                 example: "In this episode, we discuss the latest trends in technology."
 *                 description: "Description of the podcast, must be at least 10 characters."
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-01T10:00:00Z"
 *                 description: "Date and time of the podcast in ISO 8601 format."
 *               videoLink:
 *                 type: string
 *                 example: "https://www.example.com/podcast-video"
 *                 description: "Link to the podcast video."
 *               latest:
 *                 type: boolean
 *                 example: true
 *                 description: "Indicates if this is the latest podcast."
 *     responses:
 *       201:
 *         description: Podcast added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d4c001c8e4f1a"
 *                     title:
 *                       type: string
 *                       example: "The Future of Technology"
 *                     description:
 *                       type: string
 *                       example: "In this episode, we discuss the latest trends in technology."
 *                     dateTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T10:00:00Z"
 *                     videoLink:
 *                       type: string
 *                       example: "https://www.example.com/podcast-video"
 *                     latest:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "Podcast Added Successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Title must be between 3 and 100 characters."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error - Validation error message."
 */


router.post(
    '/Add',
    verify(['ADMIN']),
    ...podcastValidationRules,
    EnterPodcast);

/**
 * @swagger
 * /api/Podcast/Get:
 *   get:
 *     summary: Retrieve all podcasts
 *     tags: [Podcasts]
 *     parameters:
 *       - in: query
 *         name: latest
 *         required: false
 *         description: Filter podcasts by latest status (true/false)
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Successfully retrieved all podcasts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60c72b2f9b1d4c001c8e4f1a"
 *                       title:
 *                         type: string
 *                         example: "The Future of Technology"
 *                       description:
 *                         type: string
 *                         example: "In this episode, we discuss the latest trends in technology."
 *                       dateTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-01T10:00:00Z"
 *                       videoLink:
 *                         type: string
 *                         example: "https://www.example.com/podcast-video"
 *                       latest:
 *                         type: boolean
 *                         example: true
 *                 message:
 *                   type: string
 *                   example: "Podcast List"
 *       400:
 *         description: No podcasts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "No Podcast found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error: error message"
 */
router.get('/Get',GetPodcast);

/**
 * @swagger
 * /api/Podcast/Update:
 *   put:
 *     summary: Update an existing podcast
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - in: query
 *         name: PodID
 *         required: true
 *         description: The ID of the podcast to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Future of Technology"
 *                 description: "Title of the podcast, must be between 3 and 100 characters."
 *               description:
 *                 type: string
 *                 example: "In this episode, we discuss the latest trends in technology."
 *                 description: "Description of the podcast, must be at least 10 characters."
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-01T10:00:00Z"
 *                 description: "Date and time of the podcast in ISO 8601 format."
 *               videoLink:
 *                 type: string
 *                 example: "https://www.example.com/podcast-video"
 *                 description: "Link to the podcast video."
 *               latest:
 *                 type: boolean
 *                 example: true
 *                 description: "Indicates if this is the latest podcast."
 *     responses:
 *       200:
 *         description: Podcast updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9b1d4c001c8e4f1a"
 *                     title:
 *                       type: string
 *                       example: "The Future of Technology"
 *                     description:
 *                       type: string
 *                       example: "In this episode, we discuss the latest trends in technology."
 *                     dateTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-01T10:00:00Z"
 *                     videoLink:
 *                       type: string
 *                       example: "https://www.example.com/podcast-video"
 *                     latest:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "Podcast Update Successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Please provide Podcast ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error Validation error message."
 */
router.put('/Update',verify(['ADMIN']),
[
    body('title')
    .optional()
    .isString().withMessage('Title must be a string.')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters.'),
    body('description')
    .optional()
    .isString().withMessage('Description must be a string.')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters.'),
    body('dateTime')
    .optional()
    .isISO8601().withMessage('DateTime must be a valid date.'),
    body('videoLink')
    .optional()
    .isString().withMessage('Video link must be a String for now.'),
    body('latest')
    .optional()
    .isBoolean()
    .withMessage('latest must be either true or false.')
],UpdatePodcast);


/**
 * @swagger
 * /api/Podcast/Remove:
 *   delete:
 *     summary: Remove a podcast
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - in: query
 *         name: PodID
 *         required: true
 *         description: The ID of the podcast to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Podcast removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 message:
 *                   type: string
 *                   example: "Podcast Removed"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Please provide Podcast ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error- error message"
 */
router.delete('/Remove',verify(['ADMIN']),RemovePodcast); 

module.exports=router