const jwt = require("jsonwebtoken");
const JWTSECRET = "This is the secret key";
const fetchuser = (req , res , next) =>{
    // Get the user from the jwt token and add id to the req
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error : "Please  authenticate using a InValid Token"});
    }

    try {
        const data = jwt.verify(token , JWTSECRET);
        req.user = data.user;
        next() 
    } catch (error) {
        res.status(401).send({error : "Please  authenticate using a InValid Token"});
    }
    
}
module.exports = fetchuser;