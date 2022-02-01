const express = require('express');
const AuthorController= require('../controllers/authorController')
const BlogConctroller= require('../controllers/blogControllers')
const loginController= require('../controllers/loginController')
const middleware=require('../middlewares/middleware')

const router = express.Router();



router.post('/createAuthor',AuthorController.createAuthor);
router.post('/login', loginController.login);
router.post('/createBlog', middleware.mid,BlogConctroller.createBlogs);
router.get('/getblogs',middleware.mid, BlogConctroller.getBlogs);
router.put('/blogs/:blogId' , middleware.mid,BlogConctroller.updateBlogs);
router.get('/deleteBlogById/:blogId',middleware.mid, BlogConctroller.deleteBlogByid);
router.get('/deletBlogByQuerCondition',middleware.mid, BlogConctroller.deleteBlogByQuerConditoin);

module.exports = router;
