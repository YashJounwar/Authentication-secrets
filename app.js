require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//connect to the database using mongoose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true})

// create schema for the collection
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields : ["password"]})
// create a collection to store the user credentials
const User = mongoose.model("User",userSchema);

// store the user credentials in the data base using the body-parser
app.post("/register",function(req,res){


    const newUser = new User({
        email: req.body.username,
        password:  req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log(err)
        }
        else{
            res.render("secrets")
        }
    })
})

app.post("/login",function(req,res){

    const username  = req.body.username;
    const password  = req.body.password;
    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err)
        }
        else{
            if(foundUser)
            {if(foundUser.password === password){
                res.render("secrets")
            }}

        }
    });
});

app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login")
})
app.get("/register",function(req,res){
    res.render("register")
})


// listen to the 3000 port
app.listen(3000,function(req,res){
    console.log("server is running on port 3000");
})