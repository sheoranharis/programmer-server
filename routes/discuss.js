const express = require('express');
const router = express.Router({ mergeParams: true });
const Blog = require('../models/blog');
const Discuss = require('../models/discussion');
const validationDiscuss = require('../DB/discussValidation');
const loggedIn = require('../authmiddle');
const blogSchema = require('../DB/validation');

const validateDiscussion = (req,res,next) => {
    const result = validationDiscuss.validate(req.body);
    if (result.error) {
        //error.details is array
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ServerError(msg, 306);
    } else {
        next();
    }
};



// discussion routes
router.post('/', validateDiscussion,loggedIn, async(req,res) => {
    const { blogid } = req.params;
    const blog = await Blog.findById(blogid);
    const Comment = new Discuss(req.body);
    blog.comment.push(Comment);
    Comment.author = req.session.userID;
    await Comment.save();
    await blog.save();
    res.redirect(`/blogserver/${blogid}`);
});

router.put('/:commid/update',loggedIn, async(req,res,next) => {
    try{
        const { blogid, commid } = req.params;
        const Comment = await Discuss.findById(commid);
        if(!Comment){
            req.flash("error", "Can't find comment.");
            return res.redirect(`/blogserver/${blogid}`);
        }
        if(!Comment.author._id.equals(req.session.userID)){
            req.flash("error", "Permission Denied!!!");
            return res.redirect(`/blogserver/${blogid}`);
        }
        await Discuss.findByIdAndUpdate(commid, req.body);
        await Comment.save();
        req.flash('success', 'updated successfully');
        res.redirect(`/blogserver/${blogid}`);
    }
    catch(e){
        next(e)
    }
});

router.get('/:commid/edit',loggedIn, async(req, res,next) => {
    try{
        const { blogid, commid} = req.params;
        const Comment = await Discuss.findById(commid);
        if(!Comment.author._id.equals(req.session.userID)){
            req.flash("error", "Permission Denied!!!");
            return res.redirect(`/blogserver/${blogid}`);
        }
        res.render('./discussion/formedit', {Comment, commid, blogid});
    }
    catch(e){
        next(e);
    }
});

router.delete('/:commid',loggedIn, async(req,res,next) => {
    try{
        const {blogid, commid} = req.params;
        const blogpost = await Blog.findById(blogid);
        const Comment = await Discuss.findById(commid);
        if(!blogpost && !Comment){
            req.flash("error", "Not Found!!!");
            return res.redirect(`/blogserver/${blogid}`);
        }
        if(!Comment.author._id.equals(req.session.userID)){
            req.flash("error", "Permission Denied!!!");
            return res.redirect(`/blogserver/${blogid}`);
        }
        await Blog.findByIdAndUpdate(blogid,{$pull:{comment:commid}});
        await Discuss.findByIdAndDelete(commid);
        req.flash('success', 'deleted successfully');
        res.redirect(`/blogserver/${blogid}`);
    }catch(e){
        next(e);
    }
});

module.exports = router;