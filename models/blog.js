const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;
const Comment = require('./discussion')

const blogSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    write:{
        type:String,
        required:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    comment:[{
        type: Schema.Types.ObjectId,
        ref:'Discuss'
    }]
})

// when somethinf of this schema is deletd this async function have access to that deleted object
// we can access this and its comments id
blogSchema.post('findOneAndDelete', async function(doc) {
    console.log(doc);
    if(doc){
        await Comment.remove({
            // id is something like this
            _id:{
                $in:doc.comment
            }
        })
    }
})


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;