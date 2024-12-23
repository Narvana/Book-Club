const express=require('express');

const router=express.Router();

const {WriteComment,GetComments,DeleteComment}=require('../controller/Comment.controller');

const {verify}=require('../middleware/verifyToken');

router.post('/Write',WriteComment);

router.get('/Get',GetComments);

router.delete('/Remove',verify(['ADMIN']),DeleteComment);
 
module.exports=router;