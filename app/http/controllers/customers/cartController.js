//This is the Controller for the cart.ejs and /cart route
 


function cartController(){

    return{
       
      index: (req,res) => {
          
        res.render("customers/cart");
                      
      }
      
      ,


      update:(req,res)=>{
         
        // This is the whole structure of the cart being saved or created inside the session

        // let cart = {

        //   items:{
            
             //     pizzaId:{
                
                   //       item: pizzaObject ,
                  //       qty : 0
                 //              }
        //                  },

        //        totalQty:0,
        //        totalPrice : 0         
        // }

        
      // Checking if there is any cart or not ,
       // if not then create an empty cart
      
// To check or access the session data you can go into the request object
       if(!req.session.cart){
         
        req.session.cart = {

          items: {} ,

          totalQty: 0,
          totalPrice:0
         }
         
       }
       


    // NOW if there is a cart already then we are recieving that in our variable cart 
       let cart = req.session.cart;


    //check if item does not exist in cart
       if(!cart.items[req.body._id]){
         
        cart.items[req.body._id]={

          item: req.body ,
          qty:1
        }
       
        cart.totalQty = cart.totalQty + 1,
        cart.totalPrice = cart.totalPrice + req.body.price
       } 
            
      

       //Now checking what to do if the item is there in the cart

       else{
                
         cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
           
         cart.totalQty =  cart.totalQty + 1;
         
         cart.totalPrice = cart.totalPrice + req.body.price;
       }
       


        return res.json({totalQty: req.session.cart.totalQty});
      }
       
    }


}


module.exports = cartController;
