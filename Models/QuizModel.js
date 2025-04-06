const mongoose=require("mongoose");
const quizSchema=new mongoose.Schema({
    quizName:{
      type:String,
      required:[true,"Quiz must have a value"]
    },
    Option1:{
      type:String,  
    }
    ,
    Option2:{
      type:String,
      
    },
    Option3:{
      type:String,
      
    },
    Option4:{
      type:String,
    },
    Question:{
      type:String,
    },
    CorrectOption:{
      type:String,
    }
  })
  
const quizModel=mongoose.model("Quiz",quizSchema);

module.exports=quizModel;