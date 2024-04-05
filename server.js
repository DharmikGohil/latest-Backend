import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import connectToMongoDB from "./DB/connectToMongoDB.js";

import authRoutes from "./Routes/auth.route.js";
import userRoutes from "./Routes/user.route.js";
import messageRoutes from "./Routes/message.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
//console.log(userName)
// app.get("/", (req, res) => {
//     // root route https://localhost:5000
//     res.send("hello world!");
// })

//express gives use middleware for routes we no need to use this route
// app.get('/api/auth/signup', (req, res) => {
//     console.log("signup route");
// });
// app.get('api/auth/login', (req, res) => {
//     console.log("login route");
// })
// app.get('api/auth/logout', (req, res)=>{
//     console.log("logout route");
// })
//always put this json body parser above middle ware (you know how much time you wasted)
//to parse incoming request with json payloads (fromo req.body)
app.use(express.json());

//this middleware used to check if user is logged in or not
app.use(cookieParser());


//lets use express middleware
//auth route
app.use('/api/auth',authRoutes);

//message route
app.use('/api/messages',messageRoutes);

//user route
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname,"frontend/dist")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

app.listen(PORT,() =>{
    connectToMongoDB();
    console.log("connected to DB")
    console.log('listening on port ' + PORT);
});
