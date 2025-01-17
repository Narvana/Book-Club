const express=require('express')

const router=express.Router()

const {Vote,getBookVote,getBookVotePercent,CreateAdminBookVote,RemoveBookVote}=require('../controller/BookVote.controller');
// const defineRole=require('../middleware/role/defineRole');
// const verifyRole=require('../middleware/role/verifyRole')
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
const {verify}=require('../middleware/verifyToken')

/**
 * @swagger
 * /api/Book/Vote/List/Add/Admin:
 *   post:
 *     summary: Create votes for multiple books as an admin.
 *     description: This endpoint allows an admin to create votes for a list of book IDs. It validates the input, checks for existing votes, and inserts new votes into the database. If any book IDs are invalid or if votes already exist for the specified month and year, appropriate error messages will be returned.
 *     tags:
 *       - Book Votes
 *     security:
 *       - BearerAuth: []  # Indicates that the Bearer token is required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BookIDs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64fc2e0099a56a0017d5e340", "64fc2e0099a56a0017d5e341"]
 *             required:
 *               - BookIDs
 *     responses:
 *       200:
 *         description: Votes created successfully for the specified books.
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
 *                       BookID:
 *                         type: string
 *                         example: "64fc2e0099a56a0017d5e340"
 *                       VoteData:
 *                         type: object
 *                         properties:
 *                           VoteMonth:
 *                             type: string
 *                             example: "October"
 *                           VoteYear:
 *                             type: integer
 *                             example: 2023
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "BookVote List created for 2023"
 *       400:
 *         description: Bad request, such as missing Book IDs or existing votes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Votes already exist for Books: 64fc2e0099a56a0017d5e340"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An error occurred while voting for the book: [error message]"
 */
router.post('/List/Add/Admin',verify(['ADMIN']),CreateAdminBookVote)
 

/**
 * @swagger
 * /api/Book/Vote/Add:
 *   post:
 *     summary: Vote for a book.
 *     description: This endpoint allows users to vote for a specific book by providing their email and the book ID. It validates the email format, checks if the book exists, and ensures that the user has not already voted for that book in that current month and year.
 *     tags:
 *       - Book Votes
 *     parameters:
 *       - in: query
 *         name: Email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user voting for the book.
 *       - in: query
 *         name: BookID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book the user wants to vote for.
 *     responses:
 *       200:
 *         description: Vote recorded successfully.
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
 *                   properties:
 *                     BookID:
 *                       type: string
 *                       example: "64fc2e0099a56a0017d5e340"
 *                     VoteData:
 *                       type: object
 *                       properties:
 *                         VoteMonth:
 *                           type: string
 *                           example: "October"
 *                         VoteYear:
 *                           type: integer
 *                           example: 2023
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "user@example.com voted for Book Title"
 *       400:
 *         description: Bad request, such as missing email or book ID, or user has already voted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "user@example.com has already voted for book title."
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Book not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An error occurred while voting for the book: [error message]"
 */
router.post('/Add',Vote);


/**
 * @swagger
 * /api/Book/Vote/Nominees:
 *   get:
 *     summary: Retrieve a list of books with voting details, including book and author information
 *     tags:
 *       - Book Votes
 *     responses:
 *       200:
 *         description: List of books with vote details
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
 *                       BookID:
 *                         type: string
 *                         example: "64fc2e0099a56a0017d5e340"
 *                       BookCover:
 *                         type: string
 *                         example: "https://example.com/path/to/bookcover.jpg"
 *                       title:
 *                         type: string
 *                         example: "The Great Gatsby"
 *                       AuthorName:
 *                         type: string
 *                         example: "F. Scott Fitzgerald"
 *                       VoteData:
 *                         type: object
 *                         additionalProperties: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Book Votes"
 *       400:
 *         description: No books found that have been voted on
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "No Book Found that has been voted"
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
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An error occurred while voting for the book: {error.message}"
 */
router.get('/Nominees',getBookVote);

/**
 * @swagger
 * /api/Book/Vote/Percent:
 *   get:
 *     summary: Retrieve the percentage of votes for each book in the current month and year
 *     tags:
 *       - Book Votes
 *     responses:
 *       200:
 *         description: Book voting percentage details
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
 *                   properties:
 *                     VoteYear:
 *                       type: integer
 *                       example: 2024
 *                     VoteMonth:
 *                       type: string
 *                       example: "January"
 *                     books:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64fdc1b200a56b0017e1a330"
 *                           BookID:
 *                             type: string
 *                             example: "64fc2e0099a56a0017d5e340"
 *                           title:
 *                             type: string
 *                             example: "The Great Gatsby"
 *                           BookCover:
 *                             type: string
 *                             example: "https://example.com/path/to/bookcover.jpg"
 *                           AuthorName:
 *                             type: string
 *                             example: "F. Scott Fitzgerald"
 *                           TotalVote:
 *                             type: integer
 *                             example: 50
 *                           VotePercent:
 *                             type: number
 *                             format: float
 *                             example: 25.00
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Book Votes"
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
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An error occurred while voting for the book {error.message}"
 */
router.get('/Percent',getBookVotePercent);

/**
 * @swagger
 * /api/Book/Vote/Delete/Admin:
 *   delete:
 *     summary: Remove a book vote entry by BookVoteID (admin only)
 *     tags: 
 *       - Book Votes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: BookVoteID
 *         required: true
 *         description: The ID of the BookVote to be deleted
 *         schema:
 *           type: string
 *           example: "64fdc1b200a56b0017e1a330"
 *     responses:
 *       200:
 *         description: Book vote entry successfully removed
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
 *                   example: []
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Book Vote Removed"
 *       400:
 *         description: Bad request, missing or invalid BookVoteID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Please provide the Book Vote ID that you want to remove"
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
 *                 data:
 *                   type: string
 *                   example: ""
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An error occurred while voting for the book {error.message}"
 */

router.delete('/Delete/Admin',verify(['ADMIN']),RemoveBookVote);

module.exports=router