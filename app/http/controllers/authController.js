//This is controller file for the Login and Registration Page

//Requiring User Model
const User = require('../../models/user');

// Requiring Bcrypt package to store the password as the HashedPassword
const bcrypt = require('bcrypt');
const passport = require('passport');





function authController(){

    return{
       
      login: (req,res) => {
          
        res.render("auth/login");
      },


      postLogin :(req,res,next)=>{
         
           
       const {email,password} = req.body;
      
       
       // Validating the request
         
       if(!email||!password)
       {
              req.flash('error' , 'All fields are required');
              

         return res.redirect("/login")
         }
 

        
        passport.authenticate('local',(err,user,info)=>{

            if(err){
              req.flash('error',info.message)

              return next(err)
            }
            
            if(!user)
            {
              req.flash('error',info.message)
              return res.redirect('/login')
            }
            
            // For this controler always look in the passport.js file for understanding
            req.logIn(user,(err)=>{

              if(err){
                req.flash('error',info.message)
                return next(err);
              }
              
              
              //This method will check if the user is admin it will redirect to admin orders page 
              // else  if it is a customer then it will redirect to customer's orders page  
              const _getRedirectUrl = (req)=>{
                return req.user.role==='admin' ? '/admin/orders':'/customer/orders'
              }
              


              return res.redirect(_getRedirectUrl(req))
            
            
            })
       //This  passport.authenticate is a function when called it returns another function which we are calling below i.e (req,res,next)
        })(req,res,next)
                  

      },
                                                
      register: (req,res) => {
          
        res.render("auth/register");
      },
      
      async postRegister(req,res){
          
        
       const {name,email,password} = req.body;
      
       
       // Validating the request
         
       if(!name||!email||!password)
       {
              req.flash('error' , 'All fields are required');
              req.flash('name',name);
              req.flash('email',email);     

         return res.redirect("/register")
         }
      
       //Check if the email entered already exists
        
       User.exists({email: email},(err,result)=>{
         
        if(result)
        {
            req.flash('error' , 'Email already taken');
            req.flash('name',name);
            req.flash('email',email);  

            return res.redirect("/register") 
        
              }
       })

       
       // Hashing the Password
       const hashedPassword = await bcrypt.hash(password,10)




     
       //Create a User if everything is fine and validated

     const user = new User({
          
      name,
      email,
     password: hashedPassword
      
     })


      user.save().then((user)=>{
        // Logic so that the customer get's Logged in immediately after being registered
        
        
        
        return res.redirect('/');
      
      }).catch(err=>{
          
      req.flash('error','Something went Wrong' )
        
      return res.redirect('/');

      })
      
      console.log(user);
      } ,
      
      //For Logout
      logout (req,res){
       
        //Below method is provided by Passport js
        req.logout()

        return  res.redirect('/login')
      }
      
      
     
    }
       

}


module.exports = authController;