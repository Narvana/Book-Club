const express=require('express')

const router=express.Router()

const {Vote,getBookVote,getBookVotePercent,CreateAdminBookVote,RemoveBookVote}=require('../controller/BookVote.controller');
// const defineRole=require('../middleware/role/defineRole');
// const verifyRole=require('../middleware/role/verifyRole')
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
const {verify}=require('../middleware/verifyToken')

router.post('/List/Add/Admin',verify(['ADMIN']),CreateAdminBookVote)
 
router.post('/Add',Vote);

router.get('/Count',getBookVote);

router.get('/Percent',getBookVotePercent);

router.delete('/Delete/Admin',verify(['ADMIN']),RemoveBookVote);

module.exports=router