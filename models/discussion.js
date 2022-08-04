const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;

const discussionSchema = new Schema({
    discuss:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})
const Discuss = mongoose.model('Discuss', discussionSchema)
module.exports = Discuss;