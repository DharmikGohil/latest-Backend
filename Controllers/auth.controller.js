import User from "../Models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../Utils/generateToken.js";



export const signup = async(req,res)=>{
    try {
        const {fullName,userName,password,confirmPassword,gender}= req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error:"Password is not matched"});
        }

        //if username already there in db
        const user = await User.findOne({userName});
        if(user){
            return res.status(400).json({error:"Username is already exsits"})
        }

        //Hashing the password
        const salt = await bcrypt.genSalt(10); //higher gensalt value decrypt in long but it also slow
        const hashedpassword = await bcrypt.hash(password,salt);



        //https://avatar.iran.liara.run/public/boy?username=scoot
        // const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        // const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

        
        //gettin user input data from response body
        const newUser = new User({
            fullName,
            userName,
            password: hashedpassword,
            gender,
            profilePic: gender==="male" ?boyProfilePic: girlProfilePic
        })

        if(newUser){

             generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
        
            //201 use for success
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                userName:newUser.userName,
                profilePic:newUser.profilePic
            });
        }
        else{
            res.status(400).json({error:"Invalid user data"});
        }
        //save new user to the database
      
    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({error:"Internal server error"});
        
    }
}

export const login = async(req,res)=>{
    try {
        const {userName,password}= req.body;
        const user= await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password||""); //user.password from database is same or not, compare with null password is user not exsists
        // console.log(userName)
        if(!user || !isPasswordCorrect){
            res.status(400).json({error:"Invalid Username or password"})
        }
        generateTokenAndSetCookie(user._id,res);


        res.status(200).json({ 

            //here not use newuser because user is already there in database so
            _id:user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic,
        })
        
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({error:"Internal server error login"});
        
    }
}
export const logout = (req,res)=>{ //here async is not
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({error:"Logged out Successfully"})
        
    } catch (error) {
        console.log("Error in logout" + error.message);
        res.status(500).json({error:"Internal logout server error"})

        
    }
}