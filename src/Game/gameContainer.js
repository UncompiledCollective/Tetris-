import * as React from "react";
import { CanvasGame } from "./main canvas/canvas brain.js"
import { NextPiece } from "./Menu Components/NextPiece.js"
import { ScoreBoard, LevelIndicator } from "./Menu Components/ScoreBoard.js"
import { StartArray, createNextPieceArray } from "./main canvas/array.js"
import { Timer } from "./Timer.js";
import { MusicPlayer } from "./Music/music.js";
/*import { OverScreen } from "./main canvas/StartScreen.js";*/
const GameContainer = ({ gameOn, setGameOn, isSettingsOpen, ghost, mVol, isMute, Text, lang }) => {
    const [currentLevel, setCurrentLevel] = React.useState(0); //tracks current level.
    const [nextPieceState, setNextPieceState] = React.useState(null); // tracks the next piece.Passed to nextPiece.js
    const [linesCleared, setLinesCleared] = React.useState(0); // number of lines cleared at a single instance. Used by This component to calculate level and ScoreBoard to count points.
    const firstRenderRef = React.useRef(true); //first render - skip side effects
    const rowsTo10 = React.useRef(0); // Tracks the number of rows deleted. Resets upon reaching 10 in changeLevel function.
    const [sendMovement, setSendMovement] = React.useState(false); // used by timer
    const changeLevel = () => { // level up occurs after every 10 lines deleted
        console.log(currentLevel, "logging currentLevel at GAmeContainer")
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
    }, [linesCleared])
    useGameOver(firstRenderRef, gameOn, setCurrentLevel, setNextPieceState, rowsTo10, setLinesCleared)
    return (
        <div className="GameContainer">
            <div className="box center">
                
                <div className="BoardPermament">
                    <LevelIndicator currentLevel={currentLevel} Text={Text} lang={lang }/>
                    <CanvasGame array_prop={StartArray} sendNextPiece={setNextPieceState} setLinesCleared={setLinesCleared}
                        gameOn={gameOn} setGameOn={setGameOn} getMovement={sendMovement} setSendMovement={setSendMovement}
                        isSettingsOpen={isSettingsOpen} ghost={ghost}></CanvasGame>
                </div>
            </div>
            <div className="box right">
                <ScoreBoard currentLevel={currentLevel} linesCleared={linesCleared} resetLinesCleared={setLinesCleared}
                    gameOn={gameOn} Text={Text} lang={lang } />
                <NextPiece getNextPiece={nextPieceState} createMutableArray={createNextPieceArray} gameOn={gameOn }  />
            </div>
            <Timer gameOn={gameOn} setSendMovement={setSendMovement} currentLevel={currentLevel}
                sendMovement={sendMovement} />
            <MusicPlayer mVol={mVol} isMute={isMute} Text={Text} lang={lang} />
        </div>
        );
}
const useGameOver = (firstRender, gameOn, setCurrentLevel, setNextPieceState, rowsTo10, setLinesCleared) => {
    React.useEffect(() => {
        if (firstRender.current) {
            return;
        }
        if (gameOn === false) {
            console.log("inside reset at GameContainer")
            setCurrentLevel(0);
            setNextPieceState(null);
            rowsTo10.current = 0;
            setLinesCleared(0);
            return;
        }
    },[gameOn])
}
export { GameContainer };   