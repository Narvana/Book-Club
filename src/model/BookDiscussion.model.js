const mongoose=require('mongoose');
const validator=require('validator');

const DiscussionSchema= new mongoose.Schema({
    BookID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: [true,'Book ID is required']
    },
    Theme:{
        type: String,
        default:null
    },
    DiscussionDate:{
        type:Date,
        required: [true,'Discussion Date is required'],
        validate:
        {
            validator:function(value){
                return value >= new Date();
            },
            message: 'Disscussion Date should be equal to or later than today Date.'
        }
    },
    DiscussionStartTime: {
        type: String,
        required: [true,'Discussion Start Time is required'],
        validate:
        {
            validator:function(value){
                return /^([1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/.test(value);
            },
            message: 'Invalid time format. Please use "hh:mm AM/PM".'
        }
    },
    DiscussionEndTime: {
        type: String, 
        required: [true,'Discussion End Time is required'],
        validate:
        [
            {
                validator: function (value) {
                    return /^([1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/.test(value);
                },
                message: 'Invalid time format. Please use "hh:mm AM/PM".'
            },
            // {
            //     validator: function (value) 
            //     {
            //         const startTime = parseTime(this.DiscussionStartTime);
            //         const endTime = parseTime(value);
            //         return startTime < endTime; // Ensure start time is before end time
            //     },
            //     message: 'Discussion Start Time must be earlier than Discussion End Time.'
            // }
        ]
    },
    DiscussionLink:{
        type:String,
        required:[true,"Please Provide Discussion Link"]
    }
})

const BookDiscussion= mongoose.model('BookDiscussion',DiscussionSchema);

module.exports = BookDiscussion;