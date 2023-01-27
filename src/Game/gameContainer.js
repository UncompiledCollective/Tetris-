import * as React from "react";
import { CanvasGame } from "./main canvas/canvas brain.js"
import { NextPiece } from "./Menu Components/NextPiece.js"
import { ScoreBoard, LevelIndicator, ScoreScreen } from "./Menu Components/ScoreBoard.js"
import { StartArray, createNextPieceArray } from "./main canvas/array.js"
import { Timer } from "./Timer.js";
import { MusicPlayer } from "./Music/music.js";
import { LeaderBoardButton, LeaderBoard, NewLeaderUniversal } from "./Menu Components/leaderBoard.js";
import { useDisplayNewLeader } from "./GameHooksFuncs.js"
/*import { OverScreen } from "./main canvas/StartScreen.js";*/
const GameContainer = ({ gameOn, setGameOn, isSettingsOpen, ghost, mVol, isMute, Text, lang, setMemory, getMemory }) => {
    const [currentLevel, setCurrentLevel] = React.useState(0); //tracks current level.
    const [nextPieceState, setNextPieceState] = React.useState(null); // tracks the next piece.Passed to nextPiece.js
    const [linesCleared, setLinesCleared] = React.useState(0); // number of lines cleared at a single instance. Used by This component to calculate level and ScoreBoard to count points.
    const firstRenderRef = React.useRef(true); //first render - skip side effects
    const rowsTo10 = React.useRef(0); // Tracks the number of rows deleted. Resets upon reaching 10 in changeLevel function.
    const [sendMovement, setSendMovement] = React.useState(false); // used by timer
    const [holdScore, setHoldScore] = React.useState({});
    const [isLeaderUp, setIsLeaderUp] = React.useState(false); //opens and closes leaderboard
    const [userName, setUserName] = useDynamicMemory("user", "player :)") //tracks user name input field
    const [isInputFocused, setIsInputFocused] = React.useState(false)
    const [noteNewScore, setNoteNewScore] = React.useState(false); // necessary to force a rerender of LeaderBoard after a new score is obtained
    const [newLocalScore, setNewLocalScore] = React.useState([false, 0]); // used to inform player after new best local score!
    const [newGlobalScore, setNewGlobalScore] = React.useState([false, 0]);
    const [isChanged, setIsChanged] = React.useState(false); // used to force a rerender
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
    }, [linesCleared])
    React.useEffect(() => {
        console.log(noteNewScore, "newScore is being logged")
    },[noteNewScore])
    useDisplayNewLeader(firstRenderRef, newLocalScore, newGlobalScore, setNewLocalScore, setNewGlobalScore, isChanged, setIsChanged);
    useGameOver(firstRenderRef, gameOn, setCurrentLevel, setNextPieceState, rowsTo10, setLinesCleared)
    return (
        <div className="GameContainer">
            <LeaderBoard leaderUp={isLeaderUp} setLeader={setIsLeaderUp} setMemory={setMemory}
                getMemory={getMemory} scoreObj={holdScore} newScore={noteNewScore} setNewScoreLocal={setNewLocalScore}
                setNoteNewScore={setNoteNewScore} setHoldScore={setHoldScore} Text={Text} lang={lang }
            />
            {newLocalScore[0] ? (
                <NewLeaderUniversal tab="local" Text={Text} lang={lang} state={newLocalScore} />
                    ): (<></>)
            }
            {newGlobalScore[0] ? (
                <NewLeaderUniversal tab="global" Text={Text} lang={lang} state={newGlobalScore} />
                    ): (<></>)
                }
            {(gameOn === "over") ? (
                <ScoreScreen gameOn={gameOn} setGameOn={setGameOn} score={holdScore} lang={lang}
                    Text={Text} user={userName} setUser={(event) => handleNameChange(event, setUserName)}
                    handleFocus={(event) => handleFocus(event, setIsInputFocused)} setNewScore={setNoteNewScore}
                    setHoldScore={setHoldScore }
                />
                ): (<></>)}
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
                    gameOn={gameOn} Text={Text} lang={lang} setHoldScore={setHoldScore} />
                <NextPiece getNextPiece={nextPieceState} createMutableArray={createNextPieceArray} gameOn={gameOn} />
                <LeaderBoardButton handler={setIsLeaderUp} />
            </div>
            <Timer gameOn={gameOn} setSendMovement={setSendMovement} currentLevel={currentLevel}
                sendMovement={sendMovement} />
            <MusicPlayer mVol={mVol} isMute={isMute} Text={Text} lang={lang} isFocused={isInputFocused} />
            
        </div>
        );
}
const useGameOver = (firstRender, gameOn, setCurrentLevel, setNextPieceState, rowsTo10, setLinesCleared) => {
    React.useEffect(() => {
        if (firstRender.current) {
            return;
        }
        if (gameOn === false) {
            setCurrentLevel(0);
            setNextPieceState(null);
            rowsTo10.current = 0;
            setLinesCleared(0);
            return;
        }
    },[gameOn])
}
const useDynamicMemory = (key, defaultName) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) !== null ?
            localStorage.getItem(key) : defaultName
    );
    React.useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key]);
    return [value, setValue];
}
const handleNameChange = (event, func) => {
    func(event.target.value);
    return;
}

const handleFocus = (event, func) => {
    func((x) => !x);
    return;
}
export { GameContainer };   