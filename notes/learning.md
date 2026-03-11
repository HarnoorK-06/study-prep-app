# My learning Journey ---> study app

## What This Project Is
A full-stack MERN app where I can save Q&As, organize them in folders, and use AI to help me study.

## Tech Stack
- **Frontend:** React (JavaScript)
- **Backend:** Node.js + Express (JavaScript)  
- **Database:** MongoDB
- **AI:** Anthropic Claude API



## Javascript syntax crash course:

1. variables(const , let, var):
const ---- constant
let ----  can be changed later
var ---- (has weird behaviour lets not use this)


2. Require (Importing):
require('express') ---- paackage name (frm npm)

3. Functions :
//Regular function
function sayHello(name){
    return "Hello" + name;
}

//Arrow function(modern way , same thing)
const sayHello = (name) => {
    return "Hello" + name;
};

//Arrow function (short version,if only one line)
const sayHello => (name) => "Hello" + name;

4. Route pattern :
app.Method('/path', async(req,res) => {
    //do something
    //send response
})


