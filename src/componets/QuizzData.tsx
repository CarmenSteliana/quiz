import { useEffect } from "react"
import { useState } from "react"
import { decode } from 'html-entities';
import Question from "./Question";
import { Answer, AnswerState, QuestionModel } from "./types";
import { nanoid } from "nanoid";



export default function QuizzData() {
    const [questions, setQuestions] = useState<QuestionModel[]>([])

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5")
            .then(res => res.json())
            .then(data => data.results)
            .then(data => data.map(mapQuestion))
            .then(data => setQuestions(data))
    }, [])




    function mapQuestion(item: any): QuestionModel {
        let allAnswers = [item["correct_answer"], ...item["incorrect_answers"]]

        let allRandomAnswers: Answer[] = [];
        let counter = 0;

        while (counter < allAnswers.length) {

            let randomAnswer = allAnswers[Math.floor(Math.random() * allAnswers.length)]

            if (containAnswer(allRandomAnswers, randomAnswer) === false) {
                allRandomAnswers.push({
                    text: randomAnswer,
                    state: AnswerState.Default
                })

                counter = counter + 1;
            }
        }

        return {
            question: item["question"],
            allAnswers: allRandomAnswers,
            correctAnswerText: allRandomAnswers.find(m => m.text == item["correct_answer"])?.text || "",
        }
    }



    function containAnswer(array: Answer[], answer: string): boolean {
        for (let i = 0; i < array.length; i++) {
            if (answer === array[i].text) {
                return true
            }
        }

        return false
    }




    // const [allQuestions, setAllQuestions] = useState(generateAllNewQuestions())

    // function generateNewQuestion() {
    //     let newQuestion = randomQuestion()
    //     return newQuestion

    // }

    // function generateAllNewQuestions(){
    //     let allNewQuestions = [];
    //     let counter = 0;
    //     while(counter < 10){
    //         allNewQuestions.push(generateNewQuestion())
    //         counter = counter + 1
    //     }
    //     return allNewQuestions
    // }

    // function randomQuestion(): QuestionModel {

    //     if (allQuizzData.length > 0) {
    //         let randomObject = allQuizzData[Math.floor(Math.random() * allQuizzData.length)]
    //         let allAnswers = [randomObject["correct_answer"], ...randomObject["incorrect_answers"]]

    //         let allRandomAnswers: any[] = [];
    //         let counter = 0;
    //         while (counter < allAnswers.length) {
    //             let randomAnswer = allAnswers[Math.floor(Math.random() * allAnswers.length)]
    //             if (containAnswer(allRandomAnswers, randomAnswer) === false) {
    //                 allRandomAnswers.push(randomAnswer)

    //                 counter = counter + 1;
    //             }
    //         }

    //         return {
    //             question: randomObject["question"],
    //             answers: allRandomAnswers,
    //             correctAnswer: randomObject["correct_answer"]
    //         }
    //     }

    //     return {
    //         question: "",
    //         answers: [],
    //         correctAnswer: ""
    //     }
    // }

    // const allAnswers = generateNewQuestion();
    // console.log(allAnswers.answers)

    // const buttons = allAnswers.answers.map(answer => <button>{answer}</button>)
    // console.log(buttons)


    // const questions = allQuestions.map((item, i) => {
    //     return (<Question question={generateNewQuestion()} key={i} />)
    // })


    function isEvaluated(questions: QuestionModel[]) {
        return questions[0].allAnswers[0].state == AnswerState.Wrong ||
            questions[0].allAnswers[0].state == AnswerState.Correct ||
            questions[0].allAnswers[0].state == AnswerState.Disabled

    }

    function selectedAnswer(question: any, answer: Answer) {
        if (!isEvaluated([question])) {
            setQuestions(prev => {
                const result = [...prev]
                const q = result.find(m => m.question == question.question)
                if (q) {
                    q.allAnswers.forEach(a => a.state = AnswerState.Default)
                    const a = q.allAnswers.find(m => m.text == answer.text)

                    if (a) {
                        a.state = AnswerState.Selected
                    }
                }
                return result
            })
        }
    }

    function checkAnswers() {
        setQuestions(prev => {
            const result = [...prev]

            if (!isEvaluated(result)) {

                for (const q of result) {
                    for (const a of q.allAnswers) {
                        if (a.state === AnswerState.Selected && a.text === q.correctAnswerText) {
                            a.state = AnswerState.Correct
                        } else if (a.state === AnswerState.Selected && a.text != q.correctAnswerText) {
                            a.state = AnswerState.Wrong
                        } else if (a.text === q.correctAnswerText) {
                            a.state = AnswerState.Correct
                        } else {
                            a.state = AnswerState.Disabled
                        }
                    }
                }
            }
            return result
        })
    }
    return (
        <>
            {questions.map((question, index) =>
                <Question
                    question={question}
                    key={index}
                    selectAnswer={(answer) => selectedAnswer(question, answer)}
                />
            )}

            <div className='checkAnswers'>
                <button onClick={() => {
                    checkAnswers()
                }}>Check answers</button>
            </div>


        </>
    )

}