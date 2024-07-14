const express = require('express');
const path = require('path');
const userRoute = require('./routers/user.routes')
const blogRoute = require('./routers/blog.routes')
const mongoose = require('mongoose'); 
const cookieParser = require('cookie-parser');
const checkForAuthenticationCookie = require('./middlewares/auth.middleware');
const Blog = require('./models/blog.models')


const app = express();
const PORT = 3003

mongoose.connect('mongodb://localhost:27017/blog-site')
 .then(() => console.log('Connected to MongoDB'))
 .catch(err => console.error('Could not connect to MongoDB', err))

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))
app.use(express.urlencoded( { extended: false }))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlogs,
    })
})

app.listen( PORT, () => console.log(`Server running on port ${PORT}`))
