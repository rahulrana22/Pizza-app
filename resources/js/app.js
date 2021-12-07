// This is where we will write for the client side 
// i.e all the events like onclick, on submit etc.

 

import axios from 'axios';


// This package is uused to display the quick message that we see on the screen "Item added to cart " when we order something

import Noty from 'noty';


import { initAdmin } from './admin';

import moment from 'moment'



// catching the add button from the home.ejs
let addToCart = document.querySelectorAll('.add-to-cart');
// In this addToCart we will recieve an array of all the buttons that have add-to-cart class to them
// i.e all those buttons under the pizzas on the home page

// here we are caching the counter inside the cart button on the navbar
let cartCounter = document.querySelector('#cartCounter');


//Defining the UpdateCart Method
function updateCart(pizza)
{
 
  //here we are using axios for sending the AJAX request
  axios.post('/update-cart', pizza)
  .then((res)=>{
     
    // console.log(res);
    cartCounter.innerText = res.data.totalQty;
      
    new Noty({
      type: 'success',
      timeout: 1000,
      progressBar: false,
      text: 'Item added to cart'
   }).show();       
}).catch(err => {
    new Noty({
        type: 'error',
        timeout: 1000,
        progressBar: false,
        text: 'Something went wrong'
    }).show();
})
    
 
  } 






addToCart.forEach((btn)=>{
    
  // Adding a click event on each button (btn)    
    btn.addEventListener('click', (e)=>{
    
      // Getting that data-pizza in String 
      // and converting it back into an Object to Bind it properly and then use it   
      
      // we use "dataset" to get that data attribute
      let pizza = JSON.parse(btn.dataset.pizza);
      
      updateCart(pizza);
    
    })
})



//To Remove alert Message after 2 seconds

const alertMsg = document.querySelector('#success-alert')

if(alertMsg){

  setTimeout(() => {
    
    alertMsg.remove();
  },2000)

}










                         //Change Order Status

 //Catching all the li items from singleOrder.ejs using "status_line" class                        
 let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector("#hiddenInput");

//here we are checking if the hiddden input exists then give us it's value otherwise give us NULL
let order = hiddenInput ? hiddenInput.value : null

//Parsing the order , i.e from string to an object
order = JSON.parse(order);

// let time = document.createElement('small')









function updateStatus(order) {

   
  //This small logic we are writing so that when we 
  //update the status so the status on which we were previous
  //that was orange color earlier turns to gray
   
  statuses.forEach((status) => {
    status.classList.remove('step-completed')
    status.classList.remove('current')
})






let stepCompleted = true;
 
  // in this we are getting the status from the data attributes in the li items of singleOrder.ejs
  statuses.forEach((status) => {
     
  //we are getting the statuses using dataset.status
  let dataProp = status.dataset.status
    
  //this below means if the step is completed then change its color using the class we defined in css file
  if(stepCompleted)
  {
    status.classList.add('step-completed')
  }

  if(dataProp === order.status) {
    stepCompleted = false
   
   if(status.nextElementSibling) {
    status.nextElementSibling.classList.add('current')
   }
}

})



}



//We are getting this order from the input that is hidden inside the singleOrder.ejs
updateStatus(order);



//          SOCKET

//This socket is connected to the "LAYOUT.EJS" for the client side
//SOCKET for the client side

// this "io" is a function which contains all the useful methods we will be requiring
// we will be using it through our variable socket
let socket = io()

initAdmin(socket)

 //basically what we will be doing here is when we land on the order status page
 // we will be sending a message to the server through socket
 //that take the order id and create a private room for it
//and then join that room 

// Join 


//checking if there is an order or not
if(order)
{
  
  //here this 'join' is a custom event , that we are emiting from here
  // and we are sending the data "order id" in the next parameter 
  socket.emit('join', `order_${order._id}`)
}

//This below so that we can recieve the customers order in admin panel
//whenever a customer orders in realtime the 
//admin panel will not refresh adn the new order will be added to it in real time

let adminAreaPath = window.location.pathname
//this below will check that whether we are in admin panel or not
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}







//Here we are listening the orderUpdate event we emmited from the server file
socket.on('orderUpdated', (data) => {
      
  // here ...order is nothing but , we are copying the order (whose status we are seeing)
  // and we put that order into updatedOrder (only the status is being updated in this) 
  const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status


  //Now we will call the updateStatus() , so that it can take care of showing 
  // on which stage(or status) we are currently
   // after the admin updates the status
   
   updateStatus(updatedOrder)
   
   
   new Noty({
     type:'success',
     timeout:1000,
     text:'Order Status Updated',
     progressBar:false,
   }).show(); 
  
})



