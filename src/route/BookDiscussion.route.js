const express=require('express')

const router=express.Router()

const {AddBookDiscussion, getBookDiscussion}=require('../controller/BookDiscussion.controller');
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
const {verify}=require('../middleware/verifyToken')


/**
 * @swagger
 * /api/Discussion/Create:
 *   post:
 *     summary: Create or update a book discussion (admin only)
 *     tags: 
 *       - Book Discussions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: BookID
 *         required: false
 *         description: The ID of the book for which the discussion is being created or updated
 *         schema:
 *           type: string
 *           example: "64fdc1b200a56b0017e1a330"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Theme:
 *                 type: string
 *                 description: The theme of the discussion
 *                 example: "Exploring the world of fiction"
 *               DiscussionDate:
 *                 type: string
 *                 format: date
 *                 description: The date of the discussion
 *                 example: "2025-01-20"
 *               DiscussionStartTime:
 *                 type: string
 *                 description: The start time of the discussion
 *                 example: "14:00"
 *               DiscussionEndTime:
 *                 type: string
 *                 description: The end time of the discussion
 *                 example: "15:30"
 *               DiscussionLink:
 *                 type: string
 *                 description: The link to the discussion meeting
 *                 example: "https://example.com/discussion/12345"
 *     responses:
 *       200:
 *         description: Discussion form created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   example: {
 *                     "_id": "64fdc1b200a56b0017e1a331",
 *                     "BookID": "64fdc1b200a56b0017e1a330",
 *                     "Theme": "Exploring the world of fiction",
 *                     "DiscussionDate": "2025-01-20",
 *                     "DiscussionStartTime": "14:00",
 *                     "DiscussionEndTime": "15:30",
 *                     "DiscussionLink": "https://example.com/discussion/12345"
 *                   }
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Discussion Form created"
 *       400:
 *         description: Bad request when BookID is not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Book Not Found with provided Book ID"
 *       500:
 *         description: Internal server error or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error -: Validation error -: Theme is required"
 */
router.post('/Create',verify(['ADMIN']),AddBookDiscussion);

/**
 * @swagger
 * /api/Discussion/Get:
 *   get:
 *     summary: Retrieve all book discussions with associated book and author details
 *     tags: 
 *       - Book Discussions
 *     responses:
 *       200:
 *         description: Successfully retrieved book discussions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       BookTitle:
 *                         type: string
 *                         example: "The Great Gatsby"
 *                       BookCover:
 *                         type: string
 *                         description: URL to the book cover image
 *                         example: "https://example.com/bookcovers/gatsby.jpg"
 *                       Author:
 *                         type: string
 *                         example: "F. Scott Fitzgerald"
 *                       Theme:
 *                         type: string
 *                         example: "Exploring the Roaring Twenties"
 *                       DiscussionDate:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-25"
 *                       DiscussionStartTime:
 *                         type: string
 *                         example: "14:00"
 *                       DiscussionEndTime:
 *                         type: string
 *                         example: "15:30"
 *                       DiscussionLink:
 *                         type: string
 *                         example: "https://example.com/discussions/12345"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Book Discussion Found"
 *       404:
 *         description: No book discussions found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No Book Discussion Found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error - An error occurred"
 */
router.get('/Get',getBookDiscussion);

module.exports=router