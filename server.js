if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const engine = require('ejs-mate');
const ServerError = require('./error');
const blogRouter = require('./routes/blogs');
const discussRouter = require('./routes/discuss');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/users')
const userRouter = require('./routes/user');
const { renderFile } = require('ejs');
const dbUrl = process.env.DB_URL;
//const localDB = "mongodb://127.0.0.1/server"
const MongoDBStore = require('connect-mongo');

// connecting the mongo db
// const mongoDB = '';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", () => {
    console.log("Database Connected");
})

// middlewares
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('tiny'));


app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const secret = process.env.SECRET || 'blahblahblah'
// session // default store of sessions is memory store
app.use(session({
    //session storage, this is diff collection from other collecction
    store: MongoDBStore.create({
        mongoUrl:dbUrl,
        secret,
        //updating the session after a period of time,
        //prevent unneccessary resave
        touchAfter:24*60*60
    }).on("error", function(e){
        console.log("Session store Error.", e)
    }),

    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly:true, // cant access cookies on client side
       // secure: true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7,
        
    }
}));

// flash messages
app.use(flash());

app.use((req,res,next) => {
    // add to every response object so these req.flash has access to every response object
    res.locals.currentUser = req.session.userID;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// routes
app.use('/blogserver', blogRouter);
app.use('/comment/:blogid', discussRouter);
app.use('/', userRouter);

// 404 route
app.all('*', (req,res,next) => {
    next( new ServerError("Not Found", 404));
});

// Error Handler
app.use((err, req, res, next) => {
    console.dir(err);
    console.log(err);
    const { status, message } = err;
    console.log(status, " - STATUS IS")
    console.log(message, " - MESSAGE IS")
    res.render('./blog/error', {message, err, status});
});

const port = process.env.PORT || 3000;
// server listening
app.listen(port, () => {
    console.log(`erver listening on port ${port}`);
});