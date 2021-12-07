// This file will contain all our routes so the maintainence is easy
// We moved all the routes into this web.js file inside routers folder
//then we will require this module in the server.js file add use this initRoutes function there directly



//here we are requiring controllers

const authController = require("../app/http/controllers/authController");
const homeController = require("../app/http/controllers/homeController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");


const adminOrderController = require("../app/http/controllers/admin/orderController");
//Requiring the Status Controller
const statusController = require("../app/http/controllers/admin/statusController");


//MiddleWares

//Requiring the guest middleware we have defined in guest.js inside the middleware folder
const guest = require('../app/http/middleware/guest')

// Requiring the Auth middleware
const auth = require("../app/http/middleware/auth")

//Requiring the Admin middleware
const admin = require("../app/http/middleware/admin")

function initRoutes(app){

   
   
 //Root route for the home page with homeController
app.get("/", homeController().index )//

    
   
// We are also passing the guest middlewares inside it
//Login page route with authController
app.get("/login", guest  , authController().login)

   
//POST :-Login page route with authController
app.post("/login",authController().postLogin)


//Post : for the LogOut functionality
app.post("/logout",authController().logout)




// We are also passing the guest middlewares inside it
//GET:-Register page route with authController
app.get("/register", guest , authController().register);

//Post Request on registeration
app.post("/register",authController().postRegister);





//Cart page route with cartController
app.get("/cart",cartController().index)



app.post("/update-cart",cartController().update)




//Customer routes :-

//POST : Route to show Orders Page


//here auth middleware will check if the user is logged otherwise it will not let you access the page
app.post('/orders', auth , orderController().store)


//here auth middleware will check if the user is logged otherwise it will not let you access the page
app.get('/customer/orders',  auth , orderController().index)

app.get('/customer/orders/:id',  auth , orderController().show )



// ADMIN routes
//This is the route for the ADMIN Orders Page


app.get('/admin/orders', admin , adminOrderController().index)


//this is for the status(eg:- when you change status from Placed to Confirmed)
app.post('/admin/orders/status', admin , statusController().update )






}


//Exporting this web.js
module.exports = initRoutes;