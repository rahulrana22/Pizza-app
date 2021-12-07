//This controller is for the purpose , for example like when you change the order status from placed to confirmed

const Order =  require ('../../../models/order')


function statusController(){
  
    return {


     update(req,res) {
        

        //this "orderId" is the name that is coming from the input that is hidden with name "orderId" the markup inside the generateMarkup method in admin.js, 
        //here we are updating the order that has the id which we are getting from req object
        //and then updating the current status to the status which we are getting from req object
        Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data)=> {
            
            if(err) {
                return res.redirect('/admin/orders')
            }
                
            // Emit event
            // This eventEmmiter is provided from Node.js
           // THIS event Emmiter
            //In this whenever the status is updated an event 'orderUpdated' is emitted
            const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders')
        })

         

     }


    }

}

module.exports = statusController;