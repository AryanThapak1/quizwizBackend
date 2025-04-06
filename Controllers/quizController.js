const quiz=require("./../Models/QuizModel")
const marks=require("./../Models/MarksModel");
exports.createQuiz=async(req,res,next)=>{
    const data=req.body;
    console.log(data);
    const newQuiz=await quiz.create(data);
    res.status(200).json(newQuiz)
    next()
}

exports.getQuizzes=async (req,res,next)=>{
    const quizes = await quiz.find().select('quizName');
    const uniqueQuizNamesSet = new Set(quizes.map(quiz => quiz.quizName));
    const uniqueQuizNamesArray = Array.from(uniqueQuizNamesSet);
    res.status(200).json(uniqueQuizNamesArray);
    next();
}

exports.getQuiz=async(req,res)=>{
    const id=req.params.id;
    console.log(id);
    const Quiz=await quiz.find({quizName:id});
    res.status(200).json(Quiz)
}

exports.deleteQuiz=async (req,res)=>{
    const id=req.params.id;
    const deletedQuiz=await quiz.deleteMany({quizName:id});
    if(deletedQuiz.ok)
    {
    res.status(201).json({
      status:"Success",
    })
    }
}

exports.deleteQuestion=async (req,res)=>{
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
}

exports.getQuizStudent=async(req,res)=>{
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
  }


exports.attemptQuiz=async(req,res)=>{
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
  };

exports.submitQuiz=async(req,res)=>{
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
    console.log(err);
  }
  }

exports.getMarks=async(req,res)=>{
    const id=req.params.id;
    const markData=await marks.find({username:id});
    res.status(200).json(markData);
}

