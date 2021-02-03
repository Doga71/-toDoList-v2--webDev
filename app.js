//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');  // mongoose step 1
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose step 2
mongoose.connect('mongodb+srv://Doga_71:mustanggt500@cluster0-hzmjf.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

// mongoose step 3
const itemsSchema = {
  name: String
};

// mongoose step 3
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome"
});
const item2 = new Item({
  name: "hello"
});
const item3 = new Item({
  name: "yo yo yo"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List" , listSchema);




app.get("/", function(req, res) {

// const day = date.getDate();
Item.find({},function(err, foundItem){ // find all the items

  if(foundItem.length === 0){

     // if foundItem length is 0,only then item will get added.
    Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("sucessfully saved items to database");
      }
    });
    res.redirect("/");
  } else {
    res.render("list", {listTitle: "Today", newListItems: foundItem});
    }

  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }

  const item = new Item({
    name: itemName
  });


  item.save();
  res.redirect("/");

});

app.post("/delete", function(req,res){
  const checkedItemID = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemID , function(err){ // findByIdAndRemove find & remove simontenoesly,callback function is necessary
    if(!err){
      console.log("sucessfuly delete checked item");
      res.redirect("/");
    }
  });


});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/:customListName", function(req, res){ //dynamic routing
  const customListName = req.params.customListName;

  List.findOne({name: customListName}, function(err, foundList){
    if(!err){
      if(!foundList){
        //create new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      } else {
        // show existing list
        res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
      }
    }

  });


});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
