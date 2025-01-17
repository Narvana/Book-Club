const express=require('express')

const router=express.Router();

const {CheckWinner, GetBookWinner, UpdateBookWonTheme}=require('../controller/BookWon.controller');

const {verify}=require('../middleware/verifyToken')

/**
 * @swagger
 * /api/Book/Won/Check/Admin:
 *   post:
 *     summary: Check and update the winning book for the current month based on votes.
 *     tags: [Book Won]
 *     security:
 *       - bearerAuth: [] # Example security configuration if using bearer token authentication
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successfully checked and updated the winning book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     BookID:
 *                       type: string
 *                       example: "64f84a1e16db4b16e1d0b591"
 *                     Month:
 *                       type: string
 *                       example: "January"
 *                     Year:
 *                       type: string
 *                       example: "2025"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-01T12:00:00.000Z"
 *                 message:
 *                   type: string
 *                   example: "Book Won The Great Gatsby created with book details"
 *       404:
 *         description: No book vote data found for the current month.
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
 *                   example: "No votes found for the month of January, 2025"
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
 *                   example: "An error occurred while voting for the book: Internal Server Error"
 */
router.post('/Check/Admin',verify(['ADMIN']),CheckWinner)

/**
 * @swagger
 * /api/Book/Won/Get/Winner/Admin:
 *   get:
 *     summary: Retrieve the winning book details for a specific month and year.
 *     tags: [Book Won]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: The month for which to retrieve the winning book.
 *         example: "January"
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         required: true
 *         description: The year for which to retrieve the winning book.
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Successfully retrieved the winning book details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       BookID:
 *                         type: string
 *                         example: "64f84a1e16db4b16e1d0b591"
 *                       title:
 *                         type: string
 *                         example: "The Great Gatsby"
 *                       BookCover:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       AuthorName:
 *                         type: string
 *                         example: "F. Scott Fitzgerald"
 *                       Month:
 *                         type: string
 *                         example: "January"
 *                       Year:
 *                         type: string
 *                         example: "2025"
 *                       Theme:
 *                         type: string
 *                         example: "Classic Literature"
 *                 message:
 *                   type: string
 *                   example: "Book Won"
 *       400:
 *         description: Missing required query parameters or no book found for the specified criteria.
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
 *                   example: "Please Provide Year also"
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
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the book winner: Internal Server Error"
 */
router.get('/Get/Winner/Admin',GetBookWinner)

/**
 * @swagger
 * /api/Book/Won/Update/Theme:
 *   put:
 *     summary: Update the theme of a winning book.
 *     tags: [Book Won]
 *     parameters:
 *       - in: query
 *         name: BookWonID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the winning book record to update.
 *         example: "64f84a1e16db4b16e1d0b591"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Theme:
 *                 type: string
 *                 description: The new theme to assign to the winning book.
 *                 example: "Classic Literature"
 *     responses:
 *       200:
 *         description: Successfully updated the theme of the winning book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 1
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     BookID:
 *                       type: string
 *                       example: "64f84a1e16db4b16e1d0b591"
 *                     Month:
 *                       type: string
 *                       example: "January"
 *                     Year:
 *                       type: string
 *                       example: "2025"
 *                     Theme:
 *                       type: string
 *                       example: "Classic Literature"
 *                 message:
 *                   type: string
 *                   example: "Book Won Updated"
 *       400:
 *         description: Missing or invalid BookWonID or Theme.
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
 *                   example: "Please provide Book Won ID"
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
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "An error occurred: Internal Server Error"
 */
router.put('/Update/Theme',verify(['ADMIN']),UpdateBookWonTheme)

 

module.exports=router