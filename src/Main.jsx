import "./Main.css"
import {useEffect, useState} from "react"
import {nanoid} from "nanoid"
import Question from "./Question.jsx"
import Confetti from "react-confetti"

export default function Main() {
    const [questions, setQuestions] = useState([])
    const [questionEls, setQuestionEls] = useState([])
    const [formData, setFormData] = useState({
        "question0": "",
        "question1": "",
        "question2": "",
        "question3": "",
        "question4": "",
    })
    const [disabled, setDisabled] = useState(true)
    const [isChecked, setIsChecked] = useState(false)
    const [questionsOrder, setQuestionsOrder] = useState({
        "question0": [],
        "question1": [],
        "question2": [],
        "question3": [],
        "question4": [],
    })
    const [rightAnswersCount, setRightAnswersCount] = useState(-1)
    const [fetchError, setFetchError] = useState(false)

    useEffect(() => {
        let returnArr = {
            "question0": [],
            "question1": [],
            "question2": [],
            "question3": [],
            "question4": [],
        }
        for (let i = 0; i < questions.length; i++) {
            let choises = questions[i].incorrect_answers
            choises.splice(Math.floor(Math.random() * choises.length) + 1, 0, questions[i].correct_answer)
            returnArr["question" + i] = choises
        }
        setQuestionsOrder(returnArr)
    }, [questions])

    async function getDataFromApi() {
        const res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        if (res.ok) {
            const data = await res.json()
            return data.results
        } else {
            setFetchError(true)
        }

    }

    async function fetchData() {
            let data = await getDataFromApi()
            for (let i = 0; i < 5; i++) {
                data[i] = {
                    ...data[i],
                    id: i
                }
            }
            setQuestions(data)
        }

    useEffect(() => {
        fetchData()
    }, [])

    function handleChange(event) {
        const {name, value} = event.target
        setFormData(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    useEffect(() => {
        setQuestionEls(
            questions.map(el => {
                return <Question
                    key={nanoid()}
                    question={el.question}
                    correctAns={el.correct_answer}
                    questionsOrder={questionsOrder["question" + el.id]}
                    id={el.id}
                    changeFunc={handleChange}
                    isChecked={isChecked}
                    usersAns={formData["question" + el.id]}/>
            })
        )
    }, [questions, isChecked, questionsOrder])

    function checkDisabled() {
        for (const key in formData) {
            if (formData[key] === "") {
                setDisabled(true)
                return 0
            }
        }
        setDisabled(false)
    }

    useEffect(() => {
        checkDisabled()
    }, [formData])

    function checkAnswers() {
        setIsChecked(true)
        setRightAnswersCount(0)
        for (let id = 0; id < 5; id++) {
            const corAns = questions.filter(el => {
                return el.id === id
            })[0].correct_answer
            if (formData["question" + id] === corAns) {
                console.log("You're right!")
                setRightAnswersCount(prevState => prevState + 1)
            }
        }
    }

    function newGame() {
        setFormData({
            "question0": "",
            "question1": "",
            "question2": "",
            "question3": "",
            "question4": "",
        })
        setDisabled(true)
        setIsChecked(false)
        setQuestionsOrder({
            "question0": [],
            "question1": [],
            "question2": [],
            "question3": [],
            "question4": [],
        })
        setRightAnswersCount(-1)
        fetchData()
    }

    if (questionEls.length) {
        return (
            <main className="main-page">
                {rightAnswersCount === 5 && <Confetti />}
                {questionEls}
                <footer>
                    {rightAnswersCount !== -1 && <p>You scored {rightAnswersCount}/5 correct answers</p>}
                    <button disabled={disabled} className="check-btn"
                            onClick={rightAnswersCount !== -1 ? newGame : checkAnswers}>{rightAnswersCount !== -1 ? "Play again" : "Check answers"}</button>
                </footer>
            </main>
        )
    } else if (fetchError) {
        return (
            <main className="main-page">
                <h2>Ooops, something went wrong 🤨<br />
                    Try to restart the website 😅</h2>
            </main>
        )
    } else {
        return (
            <main className="main-page">
                <h2 className="loading-title">Loading...</h2>
            </main>
        )
    }
}