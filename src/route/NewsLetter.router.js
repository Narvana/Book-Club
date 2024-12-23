const express=require('express');

const router=express.Router();

const {AddNewsletter,GetNewsLetters,DeleteNewsLetter}=require('../controller/newsletter.controller');

const {verify}=require('../middleware/verifyToken');

router.post('/Add',AddNewsletter);

router.get('/Get',GetNewsLetters);

router.delete('/Remove',verify(['ADMIN']),DeleteNewsLetter);
 
module.exports=router;