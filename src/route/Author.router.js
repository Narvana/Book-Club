const express=require('express')

const router=express.Router()

const {GetAuthor,UpdateAuthor}=require('../controller/author.controller');
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
 
router.get('/Get',GetAuthor);
router.put('/Update',upload.single('authorImage'),UpdateAuthor);

module.exports=router