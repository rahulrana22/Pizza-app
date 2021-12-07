//In his middleware we are basically checking if the user is logged in then he should not be
// allowed to open the Register and Login Page
//Only if the user is not logged in , then he should be able to open the Login and Register Page
 

function guest (req,res,next){

    //what to do whn the user is not logged in(meaning the user should now be able to open theLogin and Register Page )
    if(!req.isAuthenticated()){

        return next();
    }
   
    //Now what to do if the user is logged in (he should not be able to open the Login and Register Page 
    // and should be redirected to the home page)
    return res.redirect('/');
}

module.exports = guest;