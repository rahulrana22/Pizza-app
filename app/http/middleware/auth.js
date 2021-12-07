
//This middleware is used so to protect all the routes where only a logged in user can go



function auth(req,res,next)
{   
    //Checking if the user is Logged In 
    if(req.isAuthenticated())
    {
        return next()
    }

    return res.redirect('/login');
}

module.exports = auth;