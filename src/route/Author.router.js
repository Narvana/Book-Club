const express=require('express')

const router=express.Router()

const {GetAuthor,UpdateAuthor}=require('../controller/author.controller');
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
const {verify}=require('../middleware/verifyToken');
 
router.get('/Get',GetAuthor);
router.put('/Update',verify(['ADMIN']),upload.single('authorImage'),UpdateAuthor);

module.exports=router