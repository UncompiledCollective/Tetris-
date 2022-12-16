import * as React from "react"
import { ReactComponent as StartTriangle } from "./game SVGs/play_button2.svg";
import { ReactComponent as RefreshButton } from "./game SVGs/refresh1.svg";
import { ReactComponent as PauseButton } from "./game SVGs/pause2.svg";
const StartScreen = ({ board, setBoard }) => {
    const handleClick = () => {
        setBoard(true);
    }
    return (
        <div className={`${board ? "startButton hidden" : "startButton"}`} id="startButton" >
            <StartTriangle className="startButtonSvg" onClick={handleClick } id="startButtonSvg"/>
        </div>
        )
}
const OverScreen = ({gameOn, callback}) => {
    const handleClick = () => {
        callback()
    }
    return (
        <div className={`${(gameOn === "over")?"overScreenContainer": "overScreenContainer hidden"}` }>
            <div className="fuckYou">YOU SUCK</div>
            <div className={`${(gameOn === "over") ? "replayButtonHolder" : "replayButtonHolder"}`}>
                <RefreshButton className="refreshButtonSvg" onClick={handleClick }/>
            </div>
        </div>
        )
}
const PauseScreen = ({ gameOn,setGameOn }) => {
    const handleClick = () => {
        setGameOn(true);
    }
    return (
        <div className={`${(gameOn === "pause") ? "pauseScreen" : "pauseScreen hidden"}`}>
            <PauseButton className="pauseButton" onClick={handleClick} />
        </div>
        )
}
export { StartScreen, OverScreen, PauseScreen };