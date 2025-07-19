const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

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

let allChats =[
    {
     from:"neha",
    to:"preeti",
    msg:"send me your exam sheets",
    created_at: new Date(),
   },

     {
     from:"rohit",
    to:"mohit",
    msg:"send me your exam sheets",
    created_at: new Date(),
   },

     {
     from:"amit",
    to:"sumit",
    msg:"send me your exam sheets",
    created_at: new Date(),
   },

     {
     from:"anita",
    to:"ramesh",
    msg:"send me your exam sheets",
    created_at: new Date(),
   },

     {
     from:"tony",
    to:"peter",
    msg:"send me your exam sheets",
    created_at: new Date(),
   },

];


Chat.insertMany(allChats);
  
