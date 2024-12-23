const express=require('express')

const router=express.Router()

const {WriteComment,GetComments}=require('../controller/Comment.controller');

// const {verify}=require('../middleware/verifyToken')

router.post('/Write',WriteComment)

router.get('/Get',GetComments)
 
 
module.exports=router