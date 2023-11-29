const express = require('express');
const mongoose = require('mongoose');
const app = express();


const uri = 'mongodb+srv://smer:mercan123@cluster0.npotzxz.mongodb.net/mydatabase';
async function connect() {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error(error);
    }
  }
  connect();

  const userSchema = new mongoose.Schema(
    {
      userId :{
        type:Number,
        unique:true,
        required:true
      },
      userName:{
        type:String,
        unique:true,
        required:true
      },
      email:{
        type:String,
        unique:true,
        required:true
      },
      password:{
        type:String
      },
      age:{
        type:Number
      },
      gender:{
        type: String,
        enum: ['Male', 'Female', 'Other'],
    
      },
      height:{
        type:Number,
        required:true
      },
      weight:{
        type:Number,
        required:true
      },
      verified: {
        type: Boolean,
        default: false
    }
    }
  )



const User=mongoose.model('user',userSchema);
module.exports=User;



data1={
  userId:2,
  userName:"SEDA1",
  email:"mrcnsedaa11@gmail.com",
  height:178,
  weight:68
}


User.insertMany([data1])

app.listen(8000,() =>{
  console.log("Server started on port 8000"); 
 });
