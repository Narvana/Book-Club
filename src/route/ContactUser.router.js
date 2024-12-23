const express=require('express');

const router=express.Router();

const {AddContactUser,GetContactUser,DeleteContactUser}=require('../controller/ContactUser.controller');

const {verify}=require('../middleware/verifyToken');

router.post('/Add',AddContactUser);

router.get('/Get',GetContactUser);

router.delete('/Remove',verify(['ADMIN']),DeleteContactUser);
 
module.exports=router;