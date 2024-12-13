const express=require('express')

const router=express.Router()

const {EnterBook,GetBooks,RemoveBook,UpdateBook}=require('../controller/Book.controller');
// const defineRole=require('../middleware/role/defineRole');
// const verifyRole=require('../middleware/role/verifyRole')
const upload=require('../middleware/ImageUpload/imageUploadMiddleware');
 
router.post(
    '/Enter',
    upload.fields([
        { name: 'authorImage', maxCount: 1 },
        { name: 'BookCover', maxCount: 1 }
    ]),
    EnterBook);

router.get('/Get',GetBooks);

router.put('/Update',upload.single('BookCover'),UpdateBook);

router.delete('/Delete',RemoveBook);

module.exports=router