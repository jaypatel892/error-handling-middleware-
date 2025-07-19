const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");


app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended:true }));
app.use(methodOverride("_method"));


main().then(()=>{
    console.log("Connection successful");
})
.catch((err)=>{
    console.log(err);
    
});

// from mongoose documentation
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// Index Route
// whenever using awaits need to use async because it returs the promise
app.get("/chats", async(req,res)=>{
    try{
         let chats = await  Chat.find();
//  console.log(chats);
 res.render("index.ejs",{chats});
    } catch(err){
        next(err);
    }

 
});

//For create New Route
app.get("/chats/new",(req,res)=>{
    // throw new ExpressError(404, "Page not found");
    res.render("new.ejs")
})


//Create Route
app.post("/chats",(req,res)=>{
    try{
        let {from , to , msg} = req.body;
    let newChat = new Chat({
        from: from,
        to:to,
        msg:msg,
        created_at: new Date(),
    });

    // It is a asynchronous process which is used to save or update or delete database .save()
    //And imp note whenever we are using .then() we will not use async()
   newChat
   .save()
   .then((res)=>{
    console.log("chat was saved");
   }).catch((err)=>{
    console.log(err);
   });
    res.redirect("/chats")
    } catch(err){
        next(err);
    }
    
    
});


// HAndling errors using WrapAsync function  I had only used for
//  one route that is NEW - SHOW ROUTE if anyone needs to apply to all 
// then need to remove try and catch block from all route and add asyncWrap to all of them  
function asyncWrap(fn){
    return function(req,res,next){
        fn (req,res,next ).catch((err)=>next(err));
    };
}


//NEW -  SHOW ROUTE
app.get("/chats/:id",asyncWrap(async(req,res,next)=>{

        let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat){
            next(new ExpressError(500, "Chat not found"));

    }
    res.render("edit.ejs",{chat});
    
}));

//Edit route
app.get("/chats/:id/edit", async (req,res)=>{
    try{
         let {id} = req.params;
    let chat =  await Chat.findById(id);
    res.render("edit.ejs", {chat});
    } catch(err){
        next(err);
    }
   
});

//Update Route
app.put("/chats/:id",async (req,res)=>{
    try{
        let {id} = req.params;
        let{msg: newMsg} = req.body;
        console.log(newMsg);
        
        let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg},
             {runValidators:true, new:true}
            );
            console.log(updatedChat);
            res.redirect("/chats");
    } catch(err){
         next(err);
    }
   
        
            

});

// Destroy or Delete Route
app.delete("/chats/:id", async (req,res)=>{
    try{
          let {id} = req.params;
        let deletedChat = await  Chat.findByIdAndDelete(id);
        console.log(deletedChat);
        res.redirect("/chats");
        
    } catch(err){
        next(err);
    }
          

});



app.get("/",(req,res)=>{
    res.send("root is working")
});

//MONGOOSE ERRORS


const handleValidationErr =(err)=>{
        console.log("This was a Validation error . Please follow rules");
        console.dir(err.message);;
        
    return err;
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if (err.name== "ValidationError") {
       err  =  handleValidationErr(err);
    }
    next(err);
    
});



// ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    let {status = 500, message = "Some error Occured"} = err;
    res.status(status).send(message);
})


app.listen(8085, () =>{
    console.log("Server started at port 8085");
    
});