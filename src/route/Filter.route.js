const express=require('express')

const router=express.Router()

const {updatepoll,updateMonthYear,updateDiscussion,getFilter}=require('../controller/Filter.controller');

const {verify}=require('../middleware/verifyToken')

router.post('/Poll',verify(['ADMIN']),updatepoll);

router.post('/MonthYear',verify(['ADMIN']),updateMonthYear);
router.post('/Discussion',verify(['ADMIN']),updateDiscussion);

router.get('/Get',
getFilter); 

module.exports=router