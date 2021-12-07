const  Mongoose  = require('mongoose');
const Order = require('../../../models/order');
const moment = require('moment')

function orderController(){
 


    return{
      
        store:( req,res)=>{

        //    console.log(req.body);
          const{phone, address} = req.body;
           if(!phone||!address)
           {
              req.flash('error',"All fields are Required")

              return res.redirect('/order');
           }
        
           const order = new Order({

            customerId : req.user._id,
            items: req.session.cart.items,
            phone: phone,
            address:address
           })
            

           order.save().then((result) =>{
               
            
             Order.populate(result , {path : 'customerId'},(err,placedOrder)=>{
                 
                req.flash('success','Order Placed Sucessfully')
              
              //due to this the cartcounter will disappear when your orders are successfully placed
             delete req.session.cart
              

             //Emit the event for the admin panel
             const eventEmitter = req.app.get('eventEmitter')
             eventEmitter.emit('orderPlaced', placedOrder)
              

              return res.redirect('/customer/orders')
             
            })

              
           })
           .catch((err) => {
            //  console.log(err);
            req.flash('error' , 'Something Went Wrong')
            return res.redirect('/cart')
           })


        }
        
        ,

   //This is for the Customer Order Page
        async index (req,res){
           
            const orders = await Order.find({customerId: req.user._id}, null,
                //This is for sorting the orders placed by Time in descending
                {sort:{'createdAt': -1}})
           
             
                

            //Here moment is the package for Converting Time format
           res.render('customers/orders', {orders : orders ,moment: moment})
            
        }
        ,

         //This method is used for showing the Status of the Order
        async show(req,res){
             
            //This id in req.params.id  is what we are getting from the paramater
            // in the route of '/customer/orders/:id' in web.js 
           //In this we are finding the order in database from the given id to us           
            const order = await Order.findById(req.params.id)
            
                         // AUTHORIZING the USER
            //this authorization is done so that , let's say you have an id of someone else's order,
            //then you would be able to see the status of their's orders also
            // so this authorization will restrict you such that you would be able to see the status of only
            //Your's order.

            //here we are checking the id of the user that is logged in
            //with the customerId present in the order (this id will be of the customer who ordered)
            //If these both match, That means the logged in user is the same user who ordered that particular order
        // we are converting it to string because these both are present in ObjectId format
        //to compare you have to convert it into string
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order : order })
            }
            else{ 
            
                return  res.redirect('/')
            }
            
          


        }
    }
}


module.exports = orderController;