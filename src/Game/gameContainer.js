import * as React from "react";
import { CanvasGame } from "./main canvas/canvas brain.js"
import { NextPiece } from "./Menu Components/NextPiece.js"
import { ScoreBoard, LevelIndicator } from "./Menu Components/ScoreBoard.js"
import { StartArray, createNextPieceArray } from "./main canvas/array.js"
import { Timer } from "./Timer.js";
const GameContainer = ({gameOn,setGameOn }) => {
    const [currentLevel, setCurrentLevel] = React.useState(0); //tracks current level.
    const [nextPieceState, setNextPieceState] = React.useState(null); // tracks the next piece.Passed to nextPiece.js
    const [linesCleared, setLinesCleared] = React.useState(0); // number of lines cleared at a single instance. Used by This component to calculate level and ScoreBoard to count points.
    const firstRenderRef = React.useRef(true); //first render - skip side effects
    const rowsTo10 = React.useRef(0); // Tracks the number of rows deleted. Resets upon reaching 10 in changeLevel function.
    const [sendMovement, setSendMovement] = React.useState(false); // used by timer
    const changeLevel = () => { // level up occurs after every 10 lines deleted
        rowsTo10.current += linesCleared;
        if (rowsTo10.current>=10) {
            rowsTo10.current -= 10;
            setCurrentLevel((x) => x + 1);
        }
        return;
    }
    React.useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        if (!linesCleared) {
            return;
        }
        changeLevel();
    },[linesCleared])
    return (
        <div className="GameContainer">
            <div className="box center">
                
                <div className="BoardPermament">
                    <LevelIndicator currentLevel={currentLevel }/>
                    <CanvasGame array_prop={StartArray} sendNextPiece={setNextPieceState} setLinesCleared={setLinesCleared} gameOn={gameOn} setGameOn={setGameOn} getMovement={sendMovement }></CanvasGame>
                </div>
            </div>
            <div className="box right">
                <ScoreBoard currentLevel={currentLevel} linesCleared={linesCleared} resetLinesCleared={setLinesCleared} />
                <NextPiece getNextPiece={nextPieceState} createMutableArray={createNextPieceArray}  />
            </div>
            <Timer gameOn={gameOn} setSendMovement={setSendMovement} currentLevel={currentLevel}/>
        </div>
        );
}
export { GameContainer };   