var express = require("express"),
mongoose = require("mongoose"),
methodOverride = require("method-override");
sanitizer = require("express-sanitizer");
app = express();

//APP CONFIG
//mongoose config
mongoose.connect("mongodb://localhost/restfull_blog_app");
//view engine
app.set("view engine", "ejs");
//public directory for cutome style sheets
app.use(express.static("public"));
//use body parser
// app.use(bodyParser.urlencoded({extended: true})); - deprecated
app.use(express.urlencoded());
//use method-override
app.use(methodOverride("_method"));
app.use(sanitizer());

//create blog schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    created: {type: Date, default: Date.now}
});
//compile into a model
var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(error, blogs){
        if(error){
            console.log(error);
        } else{
            res.render("index", {blogs: blogs});
        }
    })
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.content = req.sanitize(req.body.blog.content);
    Blog.create(req.body.blog, function(error, newBlog) {
        if (error){
            res.render("new");
        } else {            
            res.redirect("/blogs")
        }
    });
});

//SHOW A BLOG
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(error, foundBlog){
        if(error){
            res.redirect("/");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(error, foundBlog){
        if(error){
            console.log(error);
            res.redirect("/blogs/"+req.params.id);
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.content = req.sanitize(req.body.blog.content);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedBlog){
        if(error){
            console.log(error);
            res.redirect("/blogs/"+req.params.id);
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(error){
        if(error){
            console.log(error);              
        }
        res.redirect("/");
    })
});

//listen on port
app.listen(3000, function(){
    console.log("Blog App is running.");
})
