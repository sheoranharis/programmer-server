const Blog = require('./models/blog');
const Discuss = require('./models/discussion');
const requireLogin = (req, res, next) => {
    if (!req.session.userID) {
        return res.redirect('/login')
    }
    next();
}

// validating auth middleware 


module.exports = requireLogin;
//module.exports = isAuthorised;