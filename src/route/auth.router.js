const express=require('express');

const router=express.Router();

const auth=require('../controller/auth.controller');
const defineRole=require('../middleware/role/defineRole');
const verifyRole=require('../middleware/role/verifyRole');
const loginLimitter=require('../middleware/limitter.js/login.limitter');
const signupLimitter=require('../middleware/limitter.js/signup.limitter');
const sanitizeMiddleware = require('../middleware/sanitizeMiddleware');
const upload = require('../middleware/ImageUpload/imageUploadMiddleware');

/**
 * @swagger
 * /api/auth/Admin/Signup:
 *   post:
 *     summary: Signup a new Admin user and this api defines role to ADMIN
 *     tags: 
 *       - AdminAuth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Admin
 *               lastname:
 *                 type: string
 *                 example: Book
 *               email:
 *                 type: string
 *                 format: email
 *                 example: Admin1@gmail.com
 *               password:
 *                 type: string
 *                 example: Admin@1234
 *     responses:
 *       201:
 *         description: Successful registration
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
 *                     firstname:
 *                       type: string
 *                       example: Admin
 *                     lastname:
 *                       type: string
 *                       example: Book
 *                     email:
 *                       type: string
 *                       example: Admin1@gmail.com
 *                     profilePicture:
 *                       type: string
 *                       example: https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png
 *                     role:
 *                       type: string
 *                       example: ADMIN
 *                     _id:
 *                       type: string
 *                       example: 6788b1d2e0edc8a2c17962ba
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Admin Book Registered Successfully"
 *       400:
 *         description: Bad request
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
 *               EmailTaken:
 *                 summary: Email already taken
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 400
 *                   message: "This email is already taken: Admin@gmail.com"
 *               InvalidPassword:
 *                 summary: Invalid password format
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 400
 *                   message: "Enter a valid password. At least Min 8 Character, 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number"
 *               InvalidEmail:
 *                 summary: Invalid email format
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 400
 *                   message: "Write a valid email"
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
 *             examples:
 *               FirstnameRequired:
 *                 summary: Missing Firstname
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 500
 *                   message: "Firstname is required"
 *               LastnameRequired:
 *                 summary: Missing Lastname
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 500
 *                   message: "Lastname is required"
 *               EmailRequired:
 *                 summary: Missing Email
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 500
 *                   message: "Email is required"
 *               PasswordRequired:
 *                 summary: Missing Password
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 500
 *                   message: "Password is required"
 */
router.post(
    '/Admin/Signup',
    defineRole('ADMIN'),
    signupLimitter,
    sanitizeMiddleware,
    auth.SignUp)

/**
 * @swagger
 * /api/auth/Admin/Login:
 *   post:
 *     summary: Login as an Admin user
 *     tags: 
 *       - AdminAuth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: Admin1@gmail.com
 *               password:
 *                 type: string
 *                 example: Admin@1234
 *     responses:
 *       200:
 *         description: Successful login
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
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                   example:
 *                     user:
 *                       _id: "675c2ec0868f7adc2a59260f"
 *                       firstname: "Admin"
 *                       lastname: "Book"
 *                       email: "Admin@gmail.com"
 *                       profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
 *                       role: "ADMIN"
 *                       __v: 0
 *                     accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "ADMIN Logged In Successfully"
 *       400:
 *         description: Bad request
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
 *               EmailRequired:
 *                 summary: Email field is missing
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 400
 *                   message: "Email field is required"
 *               PasswordRequired:
 *                 summary: Password field is missing
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 400
 *                   message: "Password field is required"
 *               EmailNotExist:
 *                 summary: Email does not exist
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 400
 *                   message: "Admi@gmail.com email don't Exist. Either Enter a correct one or Register Yourself with this email."
 *               EmailRoleError:
 *                 summary: Email Role is not Correct
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 400
 *                   message: "email User@gmail.com is not assigned with ADMIN role"
 *               WrongPassword:
 *                 summary: Incorrect password
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 400
 *                   message: "Wrong Password, Try Again"
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
 *             examples:
 *               ErrorMessageAndStack:
 *                 summary: Error with message and stack trace
 *                 value:
 *                   status: 0
 *                   data: ""
 *                   statusCode: 500
 *                   message: "error.message with error.stack"
 */
router.post(
    '/Admin/Login',
    verifyRole('ADMIN'),
    loginLimitter,
    sanitizeMiddleware,
    auth.Login
)

module.exports=router