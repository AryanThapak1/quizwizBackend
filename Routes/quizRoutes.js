const express=require("express");
const quizController=require("./../Controllers/quizController")
const router=express.Router();

router.route("/teachers/quiz").get(quizController.getQuizzes).post(quizController.createQuiz);
router.route("/teachers/quiz/:id").get(quizController.getQuiz).delete(quizController.deleteQuiz);
router.route("/teachers/quiz/:id/:Question").delete(quizController.deleteQuestion);
router.route("/students/quiz").post(quizController.getQuizStudent);
router.route("/students/quiz/:id").get(quizController.attemptQuiz);
router.route("/students/quiz/:id").post(quizController.submitQuiz);
router.route("/students/analytics/:id").get(quizController.getMarks)
module.exports=router;