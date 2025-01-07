const mongoose=require('mongoose');
const validator = require('validator');

const podcastSchema= new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required: true
    },
    dateTime: {
        type: Date, 
        required: true
    },
    videoLink: {
        type: String,
        required: true,
        // validate: {
        //     validator: function(v) {
        //         const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(\.[a-zA-Z]{2,})+)(\/[^\s]*)?$/;
        //         return urlRegex.test(v);
        //     },
        //     message: props => `${props.value} is not a valid URL!`
        // }
    },
    latest:{
        type:Boolean,
        default:false
    }
});

const Podcast = mongoose.model('Podcast',podcastSchema);

module.exports=Podcast;

