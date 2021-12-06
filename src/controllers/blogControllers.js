const BlogsModel = require("../models/blogModel")
const AuthorModel = require("../models/authorModel")
const mongoose = require("mongoose")

// this is the second api where we can create ablog blog
const createBlogs = async function (req, res) {
  try {
    if (!(req.body.authorId === req.body.tokenId)) {
      res.status(400).send({ status: false, msg: "unauthorized access" })
    }
    let authorid = req.body.authorId
    let date = Date()
    let Author = await AuthorModel.findById(authorid);
    if (!Author) {
      res.status(400).send({ status: false, message: "Author_Id not found" });
    }
    req.body.publishedAt = date;
    req.body.isPublished = true;
    let createdBlog = await BlogsModel.create(req.body);
    res.status(201).send({ status: true, data: createdBlog });
  } catch (error) {
    res.status(500).send({ status: false, msg: error });
  }
}

// (3rd api)that is my third api to get all blogs data and the some codition base data
// (3rd api)that is my third api to get all blogs data and the some codition base data
const getBlogs = async function (req, res) {
  try {
    const check = await BlogsModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] });
    if (Object.keys(req.query).length === 0) {
      res.status(200).send({ status: true, data: check });
    }
    else {
      let result = await BlogsModel.find({ $or: [{ authorId: req.query.authorId }, { tags: req.query.tag }, { category: req.query.category }, { subcategory: req.query.subcategory }] });
      res.status(200).send({ status: true, data: result });
    }
  } catch (error) {
    res.status(400).send({ status: false, error: error });
  }
}

// that is 4th api to update a blog details which is given in the req body
const updateBlogs=async function(req,res){
  try {
    const data = await BlogsModel.findById(req.params.blogId)
    
    if (!(data.authorId == req.body.tokenId)) {
      return res.status(400).send({ status: false, msg: "unauthorized access" })
    }
    if (!data) {
      return res.status(404).send({ msg: "data not found" });
    }
    let data1 = await BlogsModel.findOneAndUpdate({ _id: req.params.blogId }, { title: req.body.title, body: req.body.body, tags: req.body.tags, subCategory: req.body.subCategory, PublishedAt: Date(), isPublished: true })
    res.status(200).send({ msg: "successfully updated", data: data1 });
  }
  catch (error) {
    res.status(500).send({ status: false, msg: "error-response-status" });
  }
}


//(5th api) that is my fifth api to delete a data which blog id is given
const deleteBlogByid = async function (req, res) {
  try {
    let check = await BlogsModel.findOne({ _id: req.params.blogId, isDeleted: false });
    if (!check) {
      res.status(404).send({ status: false, msg: "blog dosnt exist" });
    }
    if ((req.body.tokenId == check.authorId)) {
      await BlogsModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted: false }, { isDeleted: true, deletedAt: Date() });
      res.status(200).send({ status: true, msg: "sucessfully deleted" });
    } else {
      res.status(400).send({ status: false, msg: "unauthorized access" })
    }
  } catch (error) {
    res.status(400).send({ status: false, msg: error });
  }
}
// (6th api)last api to delete a blog by search givin condition i that api
//  i can use or condition to find the data and 
// in updatemany i can use the same condition
const deleteBlogByQuerConditoin = async function (req, res) {
  try {
    let check = await BlogsModel.find({ $or: [{ authorId: req.query.authorid }, { tags: req.query.tag }, { subcategory: req.query.subcategory }, { isPublished: req.query.isPublished }] });
    if (!check) {
      res.status(400).send({ status: false, msg: "!No blog found" });
    }
    await BlogsModel.updateMany({ $or: [{ authorId: req.query.authorid }, { tags: req.query.tag }, { subcategory: req.query.subcategory }, { isPublished: req.query.isPublished }] }, { isDeleted: true });
    res.status(200).send({ status: true, msg: "sucessfully deleted" });
  } catch (error) {
    res.status(400).send({ status: false, msg: error });
  }
}
module.exports.createBlogs = createBlogs;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deleteBlogByid = deleteBlogByid;
module.exports.deleteBlogByQuerConditoin = deleteBlogByQuerConditoin