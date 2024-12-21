const express=require('express')

const router=express.Router()

const {AddBookDiscussion, getBookDiscussion}=require('../controller/BookDiscussion.controller');
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
const {verify}=require('../middleware/verifyToken')

router.post('/Create',verify(['ADMIN']),AddBookDiscussion);
router.get('/Get',getBookDiscussion);



module.exports=router