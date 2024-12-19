const express=require('express')

const router=express.Router()

const {updatepoll,updateMonthYear,getFilter}=require('../controller/Filter.controller');

const {verify}=require('../middleware/verifyToken')

router.post('/Poll',verify(['ADMIN']),updatepoll);

router.post('/MonthYear',verify(['ADMIN']),updateMonthYear);

router.get('/Get',verify(['ADMIN']),
getFilter); 

module.exports=router