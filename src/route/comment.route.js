const express=require('express');

const router=express.Router();

const {WriteComment,GetComments,DeleteComment}=require('../controller/Comment.controller');

const {verify}=require('../middleware/verifyToken');

/**
 * @swagger
 * /api/Comment/Write:
 *   post:
 *     summary: Add a comment to a book.
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: BookID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book to add a comment for.
 *         example: "64f84a1e16db4b16e1d0b591"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the person commenting.
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 description: The name of the person commenting.
 *                 example: "John Doe"
 *               comment:
 *                 type: string
 *                 description: The comment content.
 *                 example: "This is a fantastic book!"
 *     responses:
 *       200:
 *         description: Successfully added a comment.
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
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     comment:
 *                       type: string
 *                       example: "This is a fantastic book!"
 *                 message:
 *                   type: string
 *                   example: "John Doe comment Saved Successfully"
 *       400:
 *         description: Missing or invalid BookID.
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
 *                   example: "Please Provide the Book ID"
 *       500:
 *         description: Validation or internal server error.
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
 *                   example: "An error occurred: Validation error - Invalid comment."
 */
router.post('/Write',WriteComment);

/**
 * @swagger
 * /api/Comment/Get:
 *   get:
 *     summary: Retrieve comments for a specific book.
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: BookID
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the book for which to retrieve comments.
 *         example: "64f84a1e16db4b16e1d0b591"
 *     responses:
 *       200:
 *         description: Successfully retrieved comments.
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
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       comment:
 *                         type: string
 *                         example: "This is a fantastic book!"
 *                 message:
 *                   type: string
 *                   example: "All Comment"
 *       400:
 *         description: Missing or invalid BookID, or no comments found.
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
 *                   example: "Please provide the BookID"
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
 *                   example: "An error occurred: Internal server error."
 */
router.get('/Get',GetComments);


/**
 * @swagger
 * /api/Comment/Remove:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - in: query
 *         name: CommentID
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment removed successfully
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
 *                   example: Comment removed
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
 *                   example: Comment ID is required
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
 *                   example: An error occurred
 */
router.delete('/Remove', verify(['ADMIN']), DeleteComment);
 
module.exports=router;