const express=require('express');

const router=express.Router();

const {AddContactUser,GetContactUser,DeleteContactUser}=require('../controller/ContactUser.controller');

const {verify}=require('../middleware/verifyToken');

/**
 * @swagger
 * /api/Contact/User/Add:
 *   post:
 *     summary: Add a contact user
 *     tags: 
 *       - Users Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               message:
 *                 type: string
 *                 example: I would like to inquire about your services.
 *     responses:
 *       200:
 *         description: Contact info saved successfully
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
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     message:
 *                       type: string
 *                       example: I would like to inquire about your services.
 *                 message:
 *                   type: string
 *                   example: John Doe Contact info Saved Successfully
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
 *                   example: This email is already taken johndoe@example.com
 */
router.post('/Add',AddContactUser);

/**
 * @swagger
 * /api/Contact/User/Get:
 *   get:
 *     summary: Retrieve all contact users
 *     tags: [Users Contact]
 *     responses:
 *       200:
 *         description: Successfully retrieved all contact users
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
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                       message:
 *                         type: string
 *                         example: I would like to inquire about your services.
 *                 message:
 *                   type: string
 *                   example: All User Contact
 *       400:
 *         description: No user contacts found
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
 *                   example: No User Contact found
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
router.get('/Get', GetContactUser );

/**
 * @swagger
 * /api/Contact/User/Remove:
 *   delete:
 *     summary: Delete a contact user
 *     tags: [Users Contact]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - in: query
 *         name: UserID
 *         required: true
 *         description: The ID of the contact user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User contact removed successfully
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
 *                   example: User Contact removed
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
 *                   example: Contact User ID is required
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
router.delete('/Remove',verify(['ADMIN']),DeleteContactUser);

module.exports=router;