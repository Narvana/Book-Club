require('dotenv').config();
require('./database/BC.database');

const express = require('express')
const app=express();
const helmet = require('helmet')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const mongoose = require('mongoose');
const multer = require('multer');
const http = require('http');  
// const hpp = require('hpp');


// const csrf = require('csurf');
// const csrfProtection = csrf({ cookie: true });
const port = process.env.PORT || 1000;

// const cookieSignature = require('cookie-signature');

const CookieSecret=process.env.COOKIE_SECRET;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser(CookieSecret));

app.use(helmet());
// app.use(helmet.xssFilter()) // no use if i'm using sanitizeMiddle
app.use(helmet.hsts({
    maxAge: 31536000, // One year
    includeSubDomains: true,
    preload: true,
}));

// app.use(helmet.frameguard({ action: 'sameorigin' }));

app.use(cors({
    origin: 
    [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://bookclubadmin.netlify.app",
        "https://bookclubadmin.vercel.app",
        "https://wgbookclub.netlify.app"
    ],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization'],
})); 

// app.get('/clear-cookie', (req, res) => {
//     res.clearCookie('accessToken');
//     res.send('Cookie has been cleared!');
// });
 
const AuthRoute=require('./route/auth.router');
const BookRoute = require('./route/Book.router');
const AuthorRoute = require('./route/Author.router');
const BookVoteRoute= require('./route/BookVote.route');
const BookWonRoute= require('./route/BookWon.route');
const FilterRoute = require('./route/Filter.route');
const DiscussionRoute=require('./route/BookDiscussion.route');
const CommentRoute=require('./route/comment.route');
const NewsLetterRoute=require('./route/NewsLetter.router');
const ContactUserRoute=require('./route/ContactUser.router');
const PodcastRoute=require('./route/Podcast.router');

app.use('/api/auth',AuthRoute);
app.use('/api/Book',BookRoute);
app.use('/api/Author',AuthorRoute);
app.use('/api/Book/Vote',BookVoteRoute);
app.use('/api/Book/Won',BookWonRoute);
app.use('/api/Filter',FilterRoute);
app.use('/api/Discussion',DiscussionRoute);
app.use('/api/Comment',CommentRoute);
app.use('/api/NewsLetter',NewsLetterRoute);
app.use('/api/Contact/User',ContactUserRoute);
app.use('/api/Podcast',PodcastRoute);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) 
    {
        // Handle Multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return  res.status(413).json({
                status:0,
                data:"",
                statusCode : 413,
                message:`${err.message}, max limit is 5MB`,
              });
        }
    } 
    if (err.message === 'Invalid file type. Only JPEG, PNG, and GIF files are allowed') 
    {
            return  res.status(400).json({
                status:0,
                data:"",
                statusCode : 400,
                message: 'Invalid file type. Only JPEG, PNG, and GIF files are allowed.',
              });    
    }
    else
    {
        const status=err.status || 0;        
        const statusCode = err.statusCode || 500; 
        const data=err.data || "";
        const message = err.message || 'Internal Server Error';
        return res.status(statusCode).json({
          status,
          data,
          statusCode,
          message,
        });    
    }
});


app.get('/test/port',(req,res,next)=>{
       res.status(201).send(`Secure Connection with port ${port}`)
})

app.get('/test/database',(req,res)=>{
    const isConnected= mongoose.connection.readyState===1;
    if(isConnected){
        res.status(201).json({message :'MongoDB connection is active'})
    }
    else{
        res.status(500).json({message :'MongoDB connection is not active'})
    }
})

const swaggerDocs = require('./swagger');
// const { LEGAL_TLS_SOCKET_OPTIONS } = require('mongodb');
swaggerDocs(app);

const server = http.createServer(app);
server.timeout = 60000;  // Set timeout to 1 minutes

server.listen(port, () => {
  console.log(`Secure Connection with port ${port}`);
});

// app.listen(port,()=>{
//     console.log(`Secure Connection with port ${port}`)
// })


 