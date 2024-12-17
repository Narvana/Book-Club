const express=require('express')

const router=express.Router()

const {Vote,getBookVote,getBookVotePercent}=require('../controller/BookVote.controller');
// const defineRole=require('../middleware/role/defineRole');
// const verifyRole=require('../middleware/role/verifyRole')
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
const {verify}=require('../middleware/verifyToken')
 
router.post('/Add',Vote);

router.get('/Count',getBookVote);

router.get('/Percent',getBookVotePercent);

module.exports=router