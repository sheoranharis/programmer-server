const express = require('express');
const router = express.Router();
const validationBlog = require('../DB/validation');
const ServerError = require('../error');
const Blog = require('../models/blog');
const looggedIn = require('../authmiddle');
const User = require('../models/users');

/*const validateBlog = (req, res, next) => {
    const result = validationBlog.validate(req.body);
    if (result.error) {
        //error.details is array
        const msg = result.error.details.map(el => el.message).join(',')
        throw new ServerError(msg, 400)
    } else {
        next();
    }
}*/

const isAuthorised = async(req,res,next) => {
    const {blogid} = req.params;
    const blogpost = await Blog.findById(blogid);
    
    if(!blogpost.owner._id.equals(req.session.userID)){
        req.flash("error", "Permission Denied!!!")
        return res.redirect('/blogserver');
    }
    next();
};

router.get('/', async(req, res,next) => {
    try{
        const blogs = await Blog.find({}).populate('owner');
        const profile = await User.findById(req.session.userID);
        if(!profile){
            throw new ServerError("No Blog Posts", 404);
        }
        if(!blogs){
            throw new ServerError("No Blog Posts", 404);
        }
        res.render('../views/blog/blog', {blogs, profile});
    }
    catch(e){
        next(e)
    }
});

router.get('/create',looggedIn, (req, res) => {
    res.render('../views/blog/create');
});

router.post('/', /*validateBlog*/ looggedIn, async(req, res, next) => {
   
    try{
        const blogData = new Blog(req.body.blog);
        blogData.owner = req.session.userID;
        await blogData.save();
        req.flash('success', 'Blog posted successfully');
        res.redirect('/blogserver');
    }catch(e){
        next(e);
    }
   
});

router.get('/:blogid', async(req,res,next) => {
    try{
         const { blogid } = req.params;
         const blogpost = await Blog.findById(blogid).populate({
            path:'comment', 
            populate:{
                path:'author'
                }
            }).populate('owner');
         if(!blogpost){
              //throw new ServerError("Blog Post not found", 404);
              res.flash('error', 'Not found');
              return res.redirect('/blogserver')
         }
         res.render('../views/blog/blogpost', {blogpost});
     }
     catch(e){
         next(e);
     }
       
});
 
router.get('/:blogid/edit',looggedIn,isAuthorised, async(req,res,next) => {
     try{
         const  { blogid } =req.params;
         const blogpost = await Blog.findById(blogid);
         if(!blogpost){
             //throw new ServerError("Form not found", 404);
             res.flash('error', 'Not found');
             return res.redirect('/blogserver')
         }
       
         res.render('../views/blog/blogedit', { blogpost });
     }
     catch(e){
         next(e);
     }
});
 
router.put('/:blogid', /*validateBlog,*/looggedIn,isAuthorised, async(req,res,next) => {
     try{
         const {blogid} = req.params;
        // first query blog post then validate owner of this blog post
        const  blogpost = await Blog.findByIdAndUpdate(blogid, {...req.body.blog});
        if(!blogpost){
            //throw new ServerError("Blog Post Not Found", 404);
            res.flash('error', 'Not found');
            return res.redirect('/blogserver')
        }
       
        //const = await Blog.findByIdAndUpdate(blogid, {...req.body.blog});

        await blogpost.save();
        req.flash('success', 'Successfully updated');
        res.redirect(`/blogserver/${blogid}`);
     }
     catch(e){
         next(e)
     }
});
 
router.delete('/:blogid/delete', looggedIn,isAuthorised, async(req,res,next) => {
     try{
        const { blogid } = req.params;
        const  blogpost = await Blog.findByIdAndDelete(blogid);
        if(!blogpost){
            res.flash('error', 'Not found');
            return res.redirect('/blogserver');
        }
        
        await blogpost.delete();
        req.flash('success', 'Blog Post successfully deleted');
        res.redirect('/blogserver');
     }
     catch(e){
         next(e)
     }
});

module.exports = router;