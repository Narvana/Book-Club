const mongoose=require('mongoose');

const filterSchema=new mongoose.Schema({
    poll: {
        type:Boolean,
        default:false
        // required:[true,'Author Name is required']
    },
    month: {
        type:String,
        default:null
    },
    year:{
        type:String,
        default:null
    }
})

const Filter = mongoose.model('Filter',filterSchema);

module.exports = Filter;