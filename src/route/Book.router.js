// routes/book.router.js
const express = require('express');
const router = express.Router();
const { EnterBook, GetBooks, RemoveBook, UpdateBook } = require('../controller/Book.controller');
const upload = require('../middleware/ImageUpload/imageUploadMiddleware');
const { verify } = require('../middleware/verifyToken');
const sanitizeMiddleware = require('../middleware/sanitizeMiddleware');

/**
 * @swagger
 * /api/Book/Enter:
 *   post:
 *     summary: Add a new book with author details and cover image. " IMP NOTE First, try to provide the authorID of an existing author in your database. If you want a author that don't exist than add new author and provide authorName, authorImage, and aboutAuthor".
 *     tags: 
 *       - Books
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - authorID
 *               - publication
 *               - genre
 *               - BookCover
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               publication:
 *                 type: string
 *                 example: "Scribner"
 *               summary:
 *                 type: string
 *                 example: "A novel set in the 1920s about Jay Gatsby's pursuit of the American Dream."
 *               review:
 *                 type: string
 *                 example: "An exceptional novel with profound social commentary."
 *               language:
 *                 type: string
 *                 example: "English"
 *               genre:
 *                 type: string
 *                 example: "Fiction"
 *               authorID:
 *                 type: string
 *                 example: "64fc2e0099a56a0017d5e340"
 *               authorName:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               aboutAuthor:
 *                 type: string
 *                 example: "American novelist and short story writer."
 *               authorImage:
 *                 type: string
 *                 format: binary
 *               BookCover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Book successfully added
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
 *                     title:
 *                       type: string
 *                       example: "The Great Gatsby"
 *                     authorID:
 *                       type: string
 *                       example: "64fc2e0099a56a0017d5e340"
 *                     BookCover:
 *                       type: string
 *                       example: "https://firebase-link-to-cover-image.jpg"
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Book Added Successfully"
 *       401:
 *         description: Authorization Error
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
 *                   example: 401
 *                 message:
 *                   type: string
 *             examples:
 *               AuthorizationError:
 *                 summary: Token Error
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 401
 *                   message: "No Token Found, ADMIN token Required"
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
 *                   example: 400
 *                 message:
 *                   type: string
 *             examples:
 *               SanitizationError:
 *                 summary: Input sanitization error
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 500
 *                   message: "Sanitization Error: Input contains disallowed patterns."
 *               ValidationError:
 *                 summary: Validation error
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 500
 *                   message: "Title is required"
 *               DuplicateTitle:
 *                 summary: Duplicate book title error
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 500
 *                   message: "Book with title 'The Great Gatsby' is already taken"
 */

router.post(
    '/Enter',
    verify(['ADMIN']),
    // sanitizeMiddleware,
    upload.fields([
        { name: 'authorImage', maxCount: 1 },
        { name: 'BookCover', maxCount: 1 }
    ]),
    sanitizeMiddleware,
    EnterBook
);

/**
 * @swagger
 * /api/Book/Get:
 *   get:
 *     summary: Retrieve a list of All books or a specific book by ID.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *         description: The ID of the book to retrieve. If not provided, all books will be returned.
 *     responses:
 *       200:
 *         description: A list of books retrieved successfully.
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
 *                       title:
 *                         type: string
 *                         example: "The Great Gatsby"
 *                       publication:
 *                         type: string
 *                         example: "Scribner"
 *                       summary:
 *                         type: string
 *                         example: "A novel set in the 1920s about Jay Gatsby's pursuit of the American Dream."
 *                       review:
 *                         type: string
 *                         example: "An exceptional novel with profound social commentary."
 *                       language:
 *                         type: string
 *                         example: "English"
 *                       genre:
 *                         type: string
 *                         example: "Fiction"
 *                       BookCover:
 *                         type: string
 *                         example: "https://firebase-link-to-cover-image.jpg"
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
 *                   example: "Total Books Count -: 1"
 *       400:
 *         description: No book found or invalid request.
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
 *                   example: "No Book found"
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
router.get('/Get', GetBooks);

/**
 * @swagger
 * /api/Book/Update:
 *   put:
 *     summary: Update the details of an existing book.
 *     tags:
 *       - Books
 *     security:
 *       - BearerAuth: []  # Indicates that the Bearer token is required
 *     parameters:
 *       - in: query
 *         name: BookID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               authorID:
 *                 type: string
 *                 example: "64fc2e0099a56a0017d5e340"
 *               publication:
 *                 type: string
 *                 example: "Scribner"
 *               summary:
 *                 type: string
 *                 example: "A novel set in the 1920s about Jay Gatsby's pursuit of the American Dream."
 *               review:
 *                 type: string
 *                 example: "An exceptional novel with profound social commentary."
 *               language:
 *                 type: string
 *                 example: "English"
 *               genre:
 *                 type: string
 *                 example: "Fiction"
 *               BookCover:
 *                 type: string
 *                 format: binary
 *                 description: The new cover image for the book (optional).
 *     responses:
 *       200:
 *         description: Book updated successfully.
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
 *                     title:
 *                       type: string
 *                       example: "The Great Gatsby"
 *                     authorID:
 *                       type: string
 *                       example: "64fc2e0099a56a0017d5e340"
 *                     publication:
 *                       type: string
 *                       example: "Scribner"
 *                     summary:
 *                       type: string
 *                       example: "A novel set in the 1920s about Jay Gatsby's pursuit of the American Dream."
 *                     review:
 *                       type: string
 *                       example: "An exceptional novel with profound social commentary."
 *                     language:
 *                       type: string
 *                       example: "English"
 *                     genre:
 *                       type: string
 *                       example: "Fiction"
 *                     BookCover:
 *                       type: string
 *                       example: "https://firebase-link-to-cover-image.jpg"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Book Updated Successfully"
 *       400:
 *         description: Bad request, such as missing Book ID or no book found.
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
 *                   example: "No Book found with the Provided Book ID"
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
router.put(
    '/Update', 
    verify(['ADMIN']), 
    upload.single('BookCover'), 
    sanitizeMiddleware,
    UpdateBook);

/**
 * @swagger
 * /api/Book/Delete:
 *   delete:
 *     summary: Remove a book by its ID.
 *     tags:
 *       - Books
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: BookID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to remove.
 *     responses:
 *       200:
 *         description: Book removed successfully.
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
 *                   items: []
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Book Removed"
 *       400:
 *         description: Bad request, such as missing Book ID or no book found.
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
 *                   example: "No Book found with the Provided Book ID"
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
router.delete('/Delete', verify(['ADMIN']), RemoveBook);

module.exports = router;