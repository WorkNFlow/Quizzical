import "./Start.css"

export default function Start({onClick}) {
    return (
        <main className="start-page">
            <h1>Quizzical</h1>
            <p className="description">Five questions about <strong>EVERYTHING</strong></p>
            <button onClick={onClick}>Start quiz</button>
        </main>
    )
}