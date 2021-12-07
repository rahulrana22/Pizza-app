// It is the main file from where we will start running our code

// Due to the line written below we can now access all the variables from the .env file

require('dotenv').config()
const express = require("express");
const app = express();

const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");

const flash = require("express-flash");

const passport = require('passport');



const MongoDbStore = require("connect-mongo"); // this is done so that we can connect to our mongo database and save the session storage in that
const Emitter = require('events');







// when we will deploy the app this port 3000 might not be available to fix this we do the following
const PORT = process.env.PORT || 3000;





//Moongoose
const mongoose = require("mongoose");
//database connection
mongoose.connect('mongodb://localhost/pizza', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true, useFindAndModify:true})
const  connection = mongoose.connection;


// here open is an event listener (kind of)
//it means once the connection opens
connection.once('open',()=>{
    console.log("Database is connected..")
}).catch(err=>{
    console.log("Connection failed..")
});



// Requiring Strategy (passport-local) for passsport.js from config folder
const passportInit = require('./app/config/passport');

passportInit(passport);



app.use(flash()); 






//Event emitter configuration

//you have to use this same instance "eventEmitter"
//everywhere in order to emit or listen events using
//Event emiter

const eventEmitter = new Emitter();

//Now we are binding this eventEmiter to the app with a keyword "eventEmiter"
// Now we will be using this keyword eveywhere to use this eventEmiter
app.set('eventEmitter',eventEmitter);







// In order to work Session needs Cookies
//Express-Session configuration
app.use(session({

    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl:'mongodb://localhost/pizza'
    }),
    saveUninitialized : false,
    cookie:{maxAge:1000 * 60 * 60 * 24} // this defines the life time for the cookie (here it is  24 hrs)
}));


// This configuration should be written after the session configuration
//Passport Configuration
app.use(passport.initialize())
app.use(passport.session())





//Global middlewares : these middlewares gets executed on each request made
// Now this session is available(globally) throughout our frontend
//And the other is to avail user throughout the frontend
app.use((req,res,next)=>{
  
    res.locals.session = req.session;
    
    res.locals.user = req.user
    
    next();
})



// config  For static files (assets) :- for getting a css response
app.use(express.static("public"));



// By default our server doesn't know how to recieve
// JSON data , for that we have to use the middleware below 
app.use(express.json());


app.use(express.urlencoded({extended:false}))






//Setting Template engine
app.use(expressLayout);
app.set("views" ,  path.join(__dirname,'/resources/views'));

app.set("view engine" ,"ejs");


// Here we are requiring the web.js file which has all the routes
// this module will give us a function and we are directly calling it here and passing app(instance of express in it)
// which will call all the routes
require('./routes/web')(app);



const server = app.listen(PORT, ()=>{

    console.log(`Server started at Port ${PORT}`);
})







//                   SOCKET.IO

//Creating and configuring the socket.io 
//CONFIGURATION

//when we will require the socket.io , we will recieve a 
// function and we are calling the function and we are passing our server in that function
const io = require('socket.io')(server);

io.on('connection', (socket) =>{
      // When any client will be connected
      // we have to make the client ot join a private room 
      // to watch the order status
      // JOIN
      //in this oderId we will recieve 
      //the data passed from 
      //the socket.emit in the APP.JS

      socket.on('join', (orderId) => {
        
        // a private room will be created with the name orderId
        // where the client can join
        //here this join() is used to join a particular room or channel
        
        socket.join(orderId)
     
    })
})

//we are Emiting the event orderPlaced ( we willlisten it in app.js)
// in this data : we will recieve id and status from statusController
eventEmitter.on('orderUpdated', (data) => {
    
    //In this below we are emiting a message to the private room
    io.to(`order_${data.id}`).emit('orderUpdated', data)

})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})







