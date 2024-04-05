import jwt  from "jsonwebtoken";

const generateTokenAndSetCookie =(userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{ //sign(payload, secret,options)
        expiresIn:'15d' 
    })

    res.cookie("jwt",token,{ //res.cookie(name, value [, options])
        maxAge: 15*24*60*60*1000, //15 days millsecond
        httpOnly: true, // prevent XSS attacks, by defining true is can not accessably by javascript, If the user is on your-project.github.io and requests an image from my-project.github.io that's a cross-site request
        sameSite :"strict", //If the user is on www.web.dev and requests an image from static.web.dev, that's a same-site request
        secure : process.env.NODE_ENV !== "development" //secure when we are in development mode
    })
}

export default generateTokenAndSetCookie
