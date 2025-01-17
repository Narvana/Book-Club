const express=require('express');

const router=express.Router();

const {AddNewsletter,GetNewsLetters,DeleteNewsLetter}=require('../controller/newsletter.controller');

const {verify}=require('../middleware/verifyToken');

/**
 * @swagger
 * /api/NewsLetter/Add:
 *   post:
 *     summary: Add an email to the newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com  # Example email
 *     responses:
 *       200:
 *         description: Email added to the newsletter successfully
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
 *                       example: 60c72b2f9b1d4c001c8e4f1a
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                 message:
 *                   type: string
 *                   example: johndoe@example.com, Added to NewsLetter
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
 *                   example: Validation error Email is required
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
 *                   example: This email johndoe@example.com is already taken
 */
router.post('/Add', AddNewsletter);

/**
 * @swagger
 * /api/NewsLetter/Get:
 *   get:
 *     summary: Retrieve all newsletters
 *     tags: [Newsletter]
 *     responses:
 *       200:
 *         description: Successfully retrieved all newsletters
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
 *                         example: 60c72b2f9b1d4c001c8e4f1a
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                 message:
 *                   type: string
 *                   example: All NewsLetters
 *       400:
 *         description: No newsletters found
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
 *                   example: No NewsLetters found
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
router.get('/Get',GetNewsLetters);

/**
 * @swagger
 * /api/NewsLetter/Remove:
 *   delete:
 *     summary: Delete a newsletter
 *     tags: [Newsletter]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - in: query
 *         name: NewsLetterID
 *         required: true
 *         description: The ID of the newsletter to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Newsletter removed successfully
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
 *                   example: Newsletter removed
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
 *                   example: Newsletter ID is required
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
router.delete('/Remove', verify(['ADMIN']), DeleteNewsLetter);

 
module.exports=router;