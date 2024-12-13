require('dotenv').config();
const mongoose = require('mongoose')

const uri=process.env.URI;
 
// mongoose.connect(uri)
mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
})
.then(()=>{
    console.log('Connection Successfull with MongoDB')
})
.catch((error)=>{
    console.log(`No Connection with MongoDB. Error: ${error}`)
})
  