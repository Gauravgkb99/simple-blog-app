const {Router} = require('express');
const Blog = require('../models/blog.models');
const multer = require('multer');
const path = require('path');
const Comments = require('../models/comments.models');

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: function(req, file, cb){
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName)
    },
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
});

router.post('/', upload.single('coverImage'), async (req, res) => {
    const {title, body} = req.body;
    const coverImageUrl = `/uploads/${req.file.filename}`

    try {
        const user = req.user;
    
        const newBlog = await Blog.create({
            title,
            body,
            coverImageUrl,
            createdBy: user._id,
        })
    
        return res.redirect(`/blog/${newBlog._id}`)
    } 
    catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const allComments = await Comments.find({ blogId : req.params.id}).populate('createdBy')
    return res.render('blog', {
        user: req.user,
        blog,
        allComments,
    })
})

router.post('/comment/:blogId', async (req, res) => {
    
   try {
        const comment = await Comments.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,

    })
    
        console.log('comment created: ', comment)
        return res.redirect(`/blog/${req.params.blogId}`)
   } 
   catch (error) {
        console.log('Error while registering comment: ', error)

        return res.redirect(`/blog/${req.params.blogId}`)
   }
})

module.exports = router;