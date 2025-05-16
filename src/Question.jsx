import he from "he"
import {useEffect, useState} from "react";
import {nanoid} from "nanoid"
import "./Question.css"

export default function Question({question, correctAns, questionsOrder, id, changeFunc, isChecked, usersAns}) {
    const [answersEls, setAnswersEls] = useState([])
    console.log(questionsOrder)
    useEffect(() => {
        if (isChecked) {
            setAnswersEls(() => {
                return questionsOrder.map((el) => {
                    const nid = nanoid()
                    if (usersAns === he.decode(el) && usersAns !== correctAns) {
                        return (
                            <>
                                <input id={nid} value={he.decode(el)} type="radio" name={"question" + id}/>
                                <label htmlFor={nid} className="wrong">{he.decode(el)}</label>
                            </>
                        )
                    } else if (he.decode(el) === correctAns) {
                        return (
                            <>
                                <input id={nid} value={he.decode(el)} type="radio" name={"question" + id}/>
                                <label htmlFor={nid} className="right">{he.decode(el)}</label>
                            </>
                        )
                    } else {
                        return (
                            <>
                                <input id={nid} value={he.decode(el)} type="radio" name={"question" + id}/>
                                <label htmlFor={nid} className="neutral">{he.decode(el)}</label>
                            </>
                        )
                    }
                })
            })
        } else {
            setAnswersEls(() => {
                return questionsOrder.map((el) => {
                    const nid = nanoid()
                    return (
                        <>
                            <input id={nid} value={he.decode(el)} type="radio" name={"question" + id}
                                   onChange={changeFunc}/>
                            <label htmlFor={nid}>{he.decode(el)}</label>
                        </>
                    )
                })
            })
        }
    }, [])

    return (
        <section>
            <h4>{he.decode(question)}</h4>
            <div className="buttons">
                {answersEls}
            </div>
            <div className="horizontal-line"></div>
        </section>
    )
}