import React from "react"
import Start from "./Start.jsx"
import Main from "./Main.jsx";

export default function App() {
    const [page, setPage] = React.useState("start")

    if (page === "start") {
        return <Start onClick={() => setPage("main")}/>
    } else if (page === "main") {
        return <Main />
    }
}

