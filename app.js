const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer=require('multer');
const PDFParser=require('pdf-parse')
const storage=multer.memoryStorage();
const upload=multer({storage:storage})

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/myapp",
    { useNewUrlParses: true, useCreateIndex: true, useFindAndModify: false }
  )
  .then(() => {
    console.log("Connection Established");
  });

const app = express();
app.use(cors());
app.use(express.json());

const credentialsModel = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Credential must have a password"],
    unique:true
  },
  password: {
    type: String,
    required: [true, "Crendentials must have a password"],
  },
  firstName: {
    type: String,
    required: [true, "Credentials must have a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Credentials must have a last name"],
  },
});

const marksModel = new mongoose.Schema({
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


const quizModel=new mongoose.Schema({
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
const tokenGenerator = (email) => {
  return new Promise((resolve, reject) => {
      if (email) {
          let manipulatedEmail = '';
          for (let i = 0; i < email.length; i++) {
            
              let charCode = email.charCodeAt(i);
              // Increment the character code by 5
              if(charCode==='.'||charCode==='@')
              {
                continue;
              }
              charCode += 5;
              manipulatedEmail += String.fromCharCode(charCode);
          }
          resolve(manipulatedEmail);
      } else {
          reject(new Error("Invalid email"));
      }
  });
};

function decryptEmail(manipulatedEmail) {
  let originalEmail = '';
  for (let i = 0; i < manipulatedEmail.length; i++) {
      let charCode = manipulatedEmail.charCodeAt(i);
      // Decrement the character code by 5
      charCode -= 5;
      originalEmail += String.fromCharCode(charCode);
  }
  return originalEmail;
}


const quiz=new mongoose.model('Quiz',quizModel);
const credentials = new mongoose.model("credentials", credentialsModel);
const marks=new mongoose.model("Marks",marksModel);

app.route("/api/v1/users/").post(async (req, res) => {
  const credential = await credentials.findOne(req.body);
  const email=req.body.email;
  const token=await tokenGenerator(email);
  
  if (credential) {
    res.status(200).json({
      message: "Success",
      token
    });
  }
  else{
    res.status(404).json({
      message:"User Not Found"
    })
  }
});

app.route("/api/v1/users/").get((req,res)=>{
  console.log(req.body)
  
})

app.listen(8080, () => {
  console.log("App is listening on 8080");
});

app.route('/api/v1/students').get((req,res)=>{
  const arr=['archit','rakshit','harshit','dameon'];
  res.status(200).json({
    status:"Success",
    data:arr
  })
})

app.route('/api/v1/teachers/quiz').post(async(req,res)=>{
  const data=req.body;
  console.log(data);
  const newQuiz=await quiz.create(data);
  res.status(200).json(newQuiz)}
  ).get(async (req,res)=>{
    const quizes = await quiz.find().select('quizName');
    const uniqueQuizNamesSet = new Set(quizes.map(quiz => quiz.quizName));
    const uniqueQuizNamesArray = Array.from(uniqueQuizNamesSet);
    res.status(200).json(uniqueQuizNamesArray);
})

app.route('/api/v1/teachers/quiz/:id').get(async(req,res)=>{
  const id=req.params.id;
  console.log(id);
  const Quiz=await quiz.find({quizName:id});
  res.status(200).json(Quiz)
}).delete(async (req,res)=>{
  const id=req.params.id;
  const deletedQuiz=await quiz.deleteMany({quizName:id});
  if(deletedQuiz.ok)
  {
  res.status(201).json({
    status:"Success",
  })
}
})

app.route('/api/v1/teachers/quiz/:id/:Question')
  .delete(async (req,res)=>{
    try{
      const id=req.body.id;
      const Question=req.body.Question;
      console.log(req.body)
    const deletedQuiz=await quiz.findOneAndDelete({quizName:id,Question:Question});
    if(deletedQuiz)
    {
    res.status(201).json({
      status:"Success",
    })

    }
}
catch(err){
  res.status(501).json({
    status:"Failed",
    err
  })
}


})


app.route('/api/v1/students/quiz').post(async(req,res)=>{
  const id=req.body.quizName;
  console.log(id);
  const Quiz=await quiz.find({quizName:id});
  if(Quiz.length!==0)
  {
    res.status(200).json(Quiz)
  }
  
  else{
    res.status(400).json({
      status:"Failed"
    })
  }
})

app.route('/api/v1/students/quiz/:id').get(async(req,res)=>{
  const id=req.params.id;
  console.log(id);
  const Quiz=await quiz.find({quizName:id});

  Quiz.forEach(el => {
    if (el.CorrectOption && el.CorrectOption.includes("Option")) {
      const index = parseInt(el.CorrectOption.split(" ")[1]) - 1; // Extract correct option index
      const correctOptionText = el[`Option${index + 1}`]; // Extract correct option text based on the index
      el.CorrectOption = correctOptionText; // Update CorrectOption property with the correct option text
    }
  });

  console.log(Quiz)

  res.status(200).json(Quiz);
});



app.route('/api/v1/students/quiz/:id').post(async(req,res)=>{
  try{
  const data=req.body;
  const exists=await marks.findOne({
    username:data.username,
    quizName:data.quizName
  })
  if(exists){
    res.status(400).json({
      status:"Fail"
    });
    return;
  }

  const mark=await marks.create(data);
  res.status(200).json(mark);
  console.log(mark)
}

catch(err)
{
  

}
})

app.route('/api/v1/students/analytics/:id').get(async(req,res)=>{
    const id=req.params.id;
    const markData=await marks.find({username:id});
    res.status(200).json(markData);
})
app.route('/api/v1/teachers/quiz/upload').post(upload.single('pdf_file'), async (req, res) => {

  try{
  const quizName = req.query.quizName;
  const pdfBuffer = req.file.buffer;
  const data = await PDFParser(pdfBuffer);
  const pdfText = data.text;
  console.log(pdfText)
  // New regex pattern based on the PDF screenshot provided
  const pattern = /\s*(.+?)\s*\n\s*(a\))\s*(.+?)\s*\n\s*(b\))\s*(.+?)\s*\n\s*(c\))\s*(.+?)\s*\n\s*(d\))\s*(.+?)\s*\n\s*Correct Answer\s*\((.+?)\)/gs;

  let match;
  // Use the regex pattern to find matches and push them into an array
  while ((match = pattern.exec(pdfText)) !== null) {
    // This will push an object containing the question and its options
    const CorrectAnswer=match[10].trim();
    let CorrectOption=null;
    switch(CorrectAnswer)
    {
      case 'a':{
        CorrectOption="Option 1";
        break;
      };
      case 'b':{
        CorrectOption="Option 2";
        break;
      };
      case 'c':{
        CorrectOption="Option 3";
        break;
      };
      case 'd':{
        CorrectOption="Option 4";
        break;
      };
      default:{
        CorrectOption=null;
        break;
      }

    }
    
    const questionWithOptions = {
      Question: match[1].trim(),
      Option1: match[3].trim(),
      Option2: match[5].trim(),
      Option3: match[7].trim(),
      Option4: match[9].trim(),
      CorrectOption // Correct answer capture group
    };

    // Create a Quiz object in your database
    const Quiz = await quiz.create({ ...questionWithOptions, quizName });

    // Log for debugging
    console.log(Quiz);
  }

  // Send a success response
  res.status(200).json({
    Status: "Success"
  });
}

catch(err){
  res.status(501).json({
    Status:"Failed",
    err:err
  })
}
});