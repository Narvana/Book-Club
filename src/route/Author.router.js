const express=require('express')

const router=express.Router()

const {GetAuthor,UpdateAuthor}=require('../controller/author.controller');
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
const {verify}=require('../middleware/verifyToken');
 

/**
 * @swagger
 * /api/Author/Get:
 *   get:
 *     summary: Retrieve a list of authors.
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors retrieved successfully.
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
 *                       _id:
 *                         type: string
 *                         example: "64fc2e0099a56a0017d5e340"
 *                       authorName:
 *                         type: string
 *                         example: "F. Scott Fitzgerald"
 *                       aboutAuthor:
 *                         type: string
 *                         example: "American novelist and short story writer."
 *                       authorImage:
 *                         type: string
 *                         example: "https://firebase-link-to-author-image.jpg"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Total Author Count -: 1"
 *       400:
 *         description: No authors found.
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
 *                   example: "No Author Found"
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
 *                   example: "Internal Server Error: [error message]"
 */
router.get('/Get',GetAuthor);

/**
 * @swagger
 * /api/Author/Update:
 *   put:
 *     summary: Update the details of an existing author.
 *     tags:
 *       - Authors
 *     security:
 *       - BearerAuth: []  # Indicates that the Bearer token is required
 *     parameters:
 *       - in: query
 *         name: AuthorID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               authorName:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               aboutAuthor:
 *                 type: string
 *                 example: "American novelist and short story writer."
 *               authorImage:
 *                 type: string
 *                 format: binary
 *                 description: The new image for the author (optional).
 *     responses:
 *       200:
 *         description: Author updated successfully.
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
 *                     _id:
 *                       type: string
 *                       example: "64fc2e0099a56a0017d5e340"
 *                     authorName:
 *                       type: string
 *                       example: "F. Scott Fitzgerald"
 *                     aboutAuthor:
 *                       type: string
 *                       example: "American novelist and short story writer."
 *                     authorImage:
 *                       type: string
 *                       example: "https://firebase-link-to-author-image.jpg"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Author Update Successfully"
 *       400:
 *         description: Bad request, such as missing Author ID or no author found.
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
 *                   example: "No Author found with the Provided Author ID"
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
 *                   example: "Internal Server Error: [error message]"
 */
router.put('/Update',verify(['ADMIN']),upload.single('authorImage'),UpdateAuthor);

module.exports=router