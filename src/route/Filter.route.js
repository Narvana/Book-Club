const express=require('express')

const router=express.Router()

const {updatepoll,updateMonthYear,updateDiscussion,getFilter}=require('../controller/Filter.controller');

const {verify}=require('../middleware/verifyToken')

/**
 * @swagger
 * /api/Filter/Poll:
 *   post:
 *     summary: Update poll status
 *     tags: [Filters]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - in: query
 *         name: poll
 *         required: true
 *         description: The status of the poll to be updated
 *         schema:
 *           type: string
 *           example: "active"  # Example of poll status
 *     responses:
 *       200:
 *         description: Poll status updated successfully
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
 *                     poll:
 *                       type: string
 *                       example: "active"
 *                 message:
 *                   type: string
 *                   example: Filter updated
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
 *                   example: Please provide poll status
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
router.post('/Poll', verify(['ADMIN']), updatepoll);

/**
 * @swagger
 * /api/Filter/MonthYear:
 *   post:
 *     summary: Update month and year filter
 *     tags: [Filters]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         description: The month to set for the filter
 *         schema:
 *           type: string
 *           example: "January"  # Example of month
 *       - in: query
 *         name: year
 *         required: true
 *         description: The year to set for the filter
 *         schema:
 *           type: integer
 *           example: 2023  # Example of year
 *     responses:
 *       200:
 *         description: Month and year filter updated successfully
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
 *                     month:
 *                       type: string
 *                       example: "January"
 *                     year:
 *                       type: integer
 *                       example: 2023
 *                 message:
 *                   type: string
 *                   example: Filter updated
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
 *                   example: Please Provide Year also
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
 *                   example: An error occurred while voting for the book
 */
router.post('/MonthYear',verify(['ADMIN']),updateMonthYear);

/**
 * @swagger
 * /api/Filter/Discussion:
 *   post:
 *     summary: Update discussion status
 *     tags: [Filters]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT for authentication
 *     parameters:
 *       - in: query
 *         name: discussion
 *         required: true
 *         description: The status of the discussion to be updated
 *         schema:
 *           type: string
 *           example: "active"  # Example of discussion status
 *     responses:
 *       200:
 *         description: Discussion status updated successfully
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
 *                     discussion:
 *                       type: string
 *                       example: "active"
 *                 message:
 *                   type: string
 *                   example: Filter updated
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
 *                   example: Please provide Discussion status
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
router.post('/Discussion', verify(['ADMIN']), updateDiscussion);

/**
 * @swagger
 * /api/Filter/Get:
 *   get:
 *     summary: Retrieve filter information
 *     tags: [Filters]
 *     responses:
 *       200:
 *         description: Successfully retrieved filter information
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
 *                     month:
 *                       type: string
 *                       example: "January"
 *                     year:
 *                       type: integer
 *                       example: 2023
 *                     discussion:
 *                       type: string
 *                       example: "active"
 *                 message:
 *                   type: string
 *                   example: Filter information
 *       400:
 *         description: No filter found
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
 *                   example: Filter created
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
 *                   example: An error occurred while voting for the book
 */
router.get('/Get',
getFilter); 

module.exports=router