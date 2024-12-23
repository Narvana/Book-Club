const express=require('express')

const router=express.Router()

const {CheckWinner, GetBookWinner, UpdateBookWonTheme}=require('../controller/BookWon.controller');

const {verify}=require('../middleware/verifyToken')

router.post('/Check/Admin',verify(['ADMIN']),CheckWinner)

router.get('/Get/Winner/Admin',GetBookWinner)

router.put('/Update/Theme',verify(['ADMIN']),UpdateBookWonTheme)

 

module.exports=router