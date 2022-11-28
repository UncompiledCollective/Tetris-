import * as React from "react"
const StartScreen = ({ board, setBoard }) => {
    const handleClick = () => {
        setBoard(!board);
    }
    return (
        <div>
            <button className={`${board ? "startButton hidden": "startButton"   }`} type="button" onClick={handleClick}>Start</button>
        </div>
        )
}
export { StartScreen };