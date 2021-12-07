
//We are makin controllers


// This controller is for the home page (home.ejs)

//In this we will be using Factory Functions

// Factory functions are nothing but object instantiating functions (basically meaning they return a object)

// Factory function definition:- When a function creates an object, it is called a factory function


const Menu = require("../../models/menu");

function homeController(){

    return {
       
      //below can be written same as index: (req , res)=>{ }   but we wrote it  below like this becasue it is much cleaner
     async index(req,res){
        
    
        const pizzas = await Menu.find();
        // console.log(pizzas);
        return res.render('home',{pizzas : pizzas})
       }
      
    }


}

module.exports = homeController;