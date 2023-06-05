const jwt = require('jsonwebtoken')

let DecodeUser = (req,res,next)=>{
    let token = req.headers['token']
    jwt.verify(token, process.env.SECRET ,(err , decoded)=>{
       if(!err){
        req.decoded = decoded;
        next();
       }else{
        res.status(403).send({"Message":"You are not authorized"})
       }
    })
}

let checkUser = (req,res,next)=>{
    if(req.decoded.role=='user'){
        next()
    }else
    res.status(403).send({"Message":"You are not user"})
}

let checkSuperAdmin = (req,res,next)=>{
    if(req.decoded.role=="admin"){
        next()
    }else
    res.status(403).send({"Message":"You are not an super admin"})
}

module.exports = {
    DecodeUser,checkUser, checkSuperAdmin
}