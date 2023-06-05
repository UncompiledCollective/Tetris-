import * as React from "react";
import { CanvasGame } from "./main canvas/canvas brain.js"
import { NextPiece } from "./Menu Components/NextPiece.js"
import { ScoreBoard, LevelIndicator, ScoreScreen } from "./Menu Components/ScoreBoard.js"
import { StartArray, createNextPieceArray } from "./main canvas/array.js"
import { Timer } from "./Timer.js";
import { MusicPlayer } from "./Music/music.js";
import { LeaderBoardButton, LeaderBoard, NewLeaderUniversal, ErrorPopup } from "./Menu Components/leaderBoard.js";
import { useDisplayNewLeader, useUpdateLevel, useDynamicMemory, useGameOver, handleNameChange, handleFocus } from "./GameHooksFuncs.js"
import { avatarObj } from "./Menu Components/Avatars/Avatars";

const GameContainer = ({ gameOn, setGameOn, isSettingsOpen, ghost, mVol, isMute, Text, lang, setMemory, getMemory,
     songList, songState, setSongState, oneTime }) => {
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
    const [importedAvatars, setImportedAvatars] = React.useState({});
    const [sendScoreError, setSendScoreError] = React.useState(false);
    useUpdateLevel(firstRenderRef, linesCleared, rowsTo10, setCurrentLevel);
    useDisplayNewLeader(firstRenderRef, newGlobalScore, setNewGlobalScore, newGlobalScore, setNewGlobalScore, isChanged, setIsChanged, true, false)
    useGameOver(firstRenderRef, gameOn, setCurrentLevel, setNextPieceState, rowsTo10, setLinesCleared)
    return (
        <div className="GameContainer">
            <LeaderBoard leaderUp={isLeaderUp} setLeader={setIsLeaderUp} setMemory={setMemory}
                getMemory={getMemory} scoreObj={holdScore} newScore={noteNewScore} setNewScoreLocal={setNewLocalScore}
                setNoteNewScore={setNoteNewScore} setHoldScore={setHoldScore} Text={Text} lang={lang}
                importedAvatars={importedAvatars} setImportedAvatars={setImportedAvatars} avatarObj={avatarObj}
            />
            {newGlobalScore[0] ? (
                <NewLeaderUniversal tab="global" Text={Text} lang={lang} state={newGlobalScore} />
                    ): (<></>)
            }
            {newLocalScore[0] ? (
                <NewLeaderUniversal tab="local" Text={Text} lang={lang} state={newLocalScore} />
            ) : (<></>)
            }
            {(gameOn === "over") ? (
                <ScoreScreen gameOn={gameOn} setGameOn={setGameOn} score={holdScore} lang={lang}
                    Text={Text} user={userName} setUser={(event) => handleNameChange(event, setUserName)}
                    handleFocus={(event) => handleFocus(event, setIsInputFocused)} setNewScore={setNoteNewScore}
                    setHoldScore={setHoldScore} getMemory={getMemory} setMemory={setMemory} importedAvatars={importedAvatars}
                    setImportedAvatars={setImportedAvatars} avatarObj={avatarObj}
                />
                ): (<></>)}
            <div className="box center">
                
                <div className="BoardPermament">
                    <LevelIndicator currentLevel={currentLevel} Text={Text} lang={lang }/>
                    <CanvasGame array_prop={StartArray} sendNextPiece={setNextPieceState} setLinesCleared={setLinesCleared}
                        gameOn={gameOn} setGameOn={setGameOn} getMovement={sendMovement} setSendMovement={setSendMovement}
                        isSettingsOpen={isSettingsOpen} ghost={ghost} overText={Text[lang].general.over }></CanvasGame>
                </div>
                
                
            </div>
            <div className="box right">
                <ScoreBoard currentLevel={currentLevel} linesCleared={linesCleared} resetLinesCleared={setLinesCleared}
                    gameOn={gameOn} Text={Text} lang={lang} setHoldScore={setHoldScore} score={holdScore}
                    setNewGlobalScore={setNewGlobalScore} setIsChanged={setIsChanged}
                    setErrorState={setSendScoreError} errorState={sendScoreError }
                />
                <NextPiece getNextPiece={nextPieceState} createMutableArray={createNextPieceArray} gameOn={gameOn} />
                <LeaderBoardButton handler={setIsLeaderUp} />
            </div>
            <Timer gameOn={gameOn} setSendMovement={setSendMovement} currentLevel={currentLevel}
                sendMovement={sendMovement} />
            <MusicPlayer mVol={mVol} isMute={isMute} Text={Text} lang={lang} isFocused={isInputFocused} oneTime={oneTime}
                songList={songList} songState={songState} setSongState={setSongState} oneTime={oneTime }
            />
            <ErrorPopup span={[Text[lang].general.score_fail, Text[lang].general.again]} state={sendScoreError} name4class="scoreScreen" twinkle={true} offsetTwinkle={lang === "eng" ? true : false} keyprop="gamecontainer-error-1"/>
        </div>
        );
}
export { GameContainer };   