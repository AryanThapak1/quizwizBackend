const mongoose=require("mongoose")
const marksSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required:[true,"A quiz should have a name"],
  },
  username:{
    type:String,
    required:[true,"A user should have a name"],
  },
  obtainedMarks:{
    type:Number,
    required:[true,"A quiz should have marks"]
  },
  totalMarks:{
    type:Number,
    required:[true,"A quiz should have total marks"]
  },
  attempted:{
    type:Boolean
  }
});

const marksModel=mongoose.model("Marks",marksSchema);

module.exports=marksModel;