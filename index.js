const express = require("express");
const app = express();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { pseudoRandomBytes } = require("crypto");
app.use(express.static(path.join(__dirname, 'public')));
var methodOverride = require('method-override');
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const multer = require("multer"); //multer setup

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


const port = 3030;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));


app.listen(port, () => {
    console.log("INSTA API STANDBY");
});

let posts = [{
    id: uuidv4(), 
    username : "Nishank Raisinghani",
    followers : 100,
    following : 200,
    content: "your nishu"
}, 

{   
    id : uuidv4(), 
    username : "Nishank Raisinghani",
    followers : 100,
    following : 200,
    content: "your nishu"
}, 

{
    id : uuidv4(), 
    username : "Jai Raisinghani",
    followers : 112,
    following : 267,
    content: "im jai"
}, 

{
     id : uuidv4(), 
    username : "Sangeeta Raisinghani",
    followers : 754,
    following : 265,
    content: "my name is sangeeta"
}, 

];

app.get("/posts", (req, res) => {
    res.render("index.ejs", {posts});
})

app.get("/posts/newpost", (req, res) => {
    res.render("new.ejs");
})

app.post("/posts", upload.single("image"), (req, res) => {
    let { username, content } = req.body;
    let image = req.file ? "/uploads/" + req.file.filename : null;
    let id = uuidv4();

    posts.push({ username, id, content, image });
    res.redirect("/posts");
});

app.post("/posts", (req, res) => {
    let {username, content} = req.body;
    let id = uuidv4();
    posts.push({username, id, content});
    res.redirect("/posts")
})

app.get("/posts/:id/editpost", (req, res) => {
    let {id} = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", {post});
});

app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    let post = posts.find(p => p.id === id);
    if (post) {
        post.content = content;
    }

    res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
    let {id} = req.params;
    posts = posts.filter((p) => id !== p.id);
     res.redirect("/posts");
});



