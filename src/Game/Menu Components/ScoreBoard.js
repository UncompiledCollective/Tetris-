import * as React from "react";
import placeHolderPNG from "./Menu PNGs/placeholder.png";
import { ReactComponent as CheckMark } from "./Menu SVGs/checkmark3.svg"
import { ReactComponent as PlusSign } from "./Menu SVGs/plus1.svg";
import {
    calculateScore, useUpdateScore, useRefreshScore, useDisplayError,
    remakeScoreObj, isNameTrue, 
} from "./ScoreHooksFuncs.js";
import { avatarObj } from "./Avatars/Avatars.js";

const ScoreBoard = ({ currentLevel, linesCleared, resetLinesCleared, gameOn, Text, lang, setHoldScore }) => {
    const FirstRenderRef = React.useRef(true);
    const ScoreObj = React.useRef({
        Score: 0,
        lines_4: 0,
        lines_3: 0,
        lines_2: 0,
        lines_1: 0,
        lines_total: 0,
        name: "",
        avatar: "",
    }
    )
    useUpdateScore(FirstRenderRef, linesCleared, ScoreObj, currentLevel, resetLinesCleared, calculateScore);
    useRefreshScore(FirstRenderRef, gameOn, ScoreObj, setHoldScore, remakeScoreObj);
    return (
        <div className="scoreBoard">
            <table className="scoreBoardTable">
                <tbody>
                    <tr>
                        <th colSpan="2">{Text[lang].scoreBoard.score }</th>
                    </tr>
                    <tr>
                        <td>{Text[lang].scoreBoard.total}</td>

                        <td>{ScoreObj.current.Score}</td>
                    </tr>
                    <tr>
                        <td>
                            <InternalTable whichOn={[true, true, true, true]}/>
                        </td>
                        <td>{ScoreObj.current.lines_4}</td>
                    </tr>
                    <tr>
                        <td>
                            <InternalTable whichOn={[true, false, true, true]} />
                        </td>
                        <td>{ScoreObj.current.lines_3}</td>
                    </tr>
                    <tr>
                        <td>
                            <InternalTable whichOn={[true, false, true, false]} />
                        </td>
                        <td>{ScoreObj.current.lines_2}</td>
                    </tr>
                    <tr>
                        <td>
                            <InternalTable whichOn={[false, false, true, false]} />
                        </td>
                        <td>{ScoreObj.current.lines_1}</td>
                    </tr>
                    <tr>
                        <td>{Text[lang].scoreBoard.lines_total}</td>
                        <td>{ScoreObj.current.lines_total}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        )
}
const InternalTable = ({ whichOn, varClass = "internalTableDiv", varClass2 ="internalTable"}) => {
    const first = whichOn[0]
    const second = whichOn[1]
    const third = whichOn[2]
    const forth = whichOn[3]
    return (
        <div className={varClass }>
            <table className={varClass2 }>
                <tbody>
                    <tr>
                        <IndicatorCell lightUp={first} />
                        <IndicatorCell lightUp={second}/>
                    </tr>
                    <tr>
                        <IndicatorCell lightUp={third} />
                        <IndicatorCell lightUp={forth} />
                    </tr>
                </tbody>
            </table>
        </div>
        )
}
const IndicatorCell = ({lightUp}) => {
    return (
        <>
        <td className={`${lightUp ? "light" : ""}`}>&nbsp;</td>
        </>
            )
}
const LevelIndicator = ({currentLevel, Text, lang}) => {

    return (
        <div className="levelIndicator">
            <span className="levelIndicatorText">{Text[lang].scoreBoard.level} {currentLevel}</span>
        </div>
        )
}

const ScoreScreen = ({ gameOn, setGameOn, score, Text, lang, user, setUser, handleFocus, setNewScore, setHoldScore }) => {
    const [errorMessage, setErrorMessage] = React.useState("right");
    const [isInCorrect, setIsIncorrect] = React.useState(false);
    const [isAvUp, setIsAvUp] = React.useState(false);
    const [currentAv, setCurrentAv] = React.useState(0);
    const [localUploadAvatar, setLocalUploadAvatar] = React.useState("")
    const handleClick = () => {
        if (isNameTrue(user) !== true) {
            setIsIncorrect(true);
            setErrorMessage(isNameTrue(user))
            return;
        }
        setErrorMessage("right")
        score.name = user;
        score.avatar = avatarObj.avatars[currentAv];
        setHoldScore(JSON.parse(JSON.stringify(score)));
        setNewScore(true);
        setGameOn(false);
        return;
    }
    useDisplayError(isInCorrect, setIsIncorrect);
    return (
        <div className="scoreScreenHolder">
            {isInCorrect !== false ? (
                <div className={`${isInCorrect === "pop" ? "wrongPopUpHolder pop" : "wrongPopUpHolder"}`}>
                    <span>{errorMessage === "special" ? Text[lang].scoreBoard.special + Text.misc.chars : Text[lang].scoreBoard[errorMessage]}</span>
                </div>
                ):(<></>)
            }
            {isAvUp ? (
                <ScoreAvatarSelector avObj={avatarObj} isUp={isAvUp} setIsUp={setIsAvUp} currentAv={currentAv} setCurrentAv={setCurrentAv} />
            ): (<></>)
            }
            <div className="scoreScreenProper">
                <div className="avatarHolder" onClick={function () {
                    setIsAvUp((x) => !x);
                    return;
                }}>
                    <AvatarContainer source={avatarObj.avatars[currentAv]} nameOfClass="scoreAvatarWrapper" />
                </div>{/* closes imgDiv */}
                <div className="bigHolder">
                    <div className="nameDiv">
                        {/*<span>placeholder</span>*/}
                        <form onSubmit={function (e) {
                            e.preventDefault();
                        }} >
                            <ScoreInput isAutofocused={false} user={user} setUser={setUser}
                                handleFocus={handleFocus }/>
                        </form>
                        
                    </div>
                    <div className="scoreRow">
                        <div className="tableAndNumber">
                            <InternalTable whichOn={[true, true, true, true]}/>
                            <div className="numberDiv"><span>{(score.lines_4)?(score.lines_4):"0"}</span></div>
                        </div>
                        <div className="tableAndNumber">
                            <InternalTable whichOn={[true, false, true, true]} />
                            <div className="numberDiv"><span>{(score.lines_3) ? (score.lines_3) : "0"}</span></div>
                        </div>
                    </div>{/* closes scoreRow */}
                    <div className="scoreRow">
                        <div className="tableAndNumber">
                            <InternalTable whichOn={[true, false, true, false]} />
                            <div className="numberDiv"><span>{(score.lines_2) ? (score.lines_2) : "0"}</span></div>
                        </div>
                        <div className="tableAndNumber">
                            <InternalTable whichOn={[false, false, true, false]} />
                            <div className="numberDiv"><span>{(score.lines_1) ? (score.lines_1) : "0"}</span></div>
                        </div>
                    </div>{/* closes scoreRow */}

                </div>{/* closes bigHolder*/}

                <div className="smallHolder first">
                    <div className="constText"><span>{Text[lang].scoreBoard.lines_total}</span></div>
                    <div className="numberDiv"><span>{(score.lines_total) ? (score.lines_total) : "0"}</span></div>
                </div>{/*closes smallHolder*/}

                <div className="smallHolder">
                    <div className="constText"><span>{Text[lang].scoreBoard.total}:</span></div>
                    <div className="numberDiv"><span>{(score.Score) ? (score.Score) : "0"}</span></div>
                </div>{/*closes smallHolder*/ }
                <div className="checkMarkHolder" onClick={handleClick }>
                    <CheckMark className="checkMark" />
                </div>
            </div>
            
        </div>
        )
}
const ScoreInput = ({isAutofocused, setUser, user, handleFocus}) => {

    return (
        <>
            <input type="text" id="nameInput" className="inputDiv"
                autoFocus={isAutofocused} onChange={setUser} value={user} onFocus={handleFocus}
                onBlur={handleFocus}
            />
        </>
        )
}
const ScoreAvatarSelector = ({ avObj, isUp, setIsUp, currentAv, setCurrentAv }) => {
    return (
        <div className="scoreAvatarSelector">
            {avObj.avatars.map(function (x, index) {
                return(
                    <AvatarContainer index={index} source={avObj.avatars[index]} isOnClick={true} callback={setCurrentAv} secondCallback={setIsUp}
                        ranVariable={currentAv }
                    />
                    )
            })}
            <AddAvatar/>
        </div>
        )
}
const AvatarContainer = ({ source, index, nameOfClass = "avatarContainer", isOnClick = false, callback = false, secondCallback = false, ranVariable = false }) => {
    console.log(isOnClick)
    return (
        <div className={nameOfClass} {...(isOnClick ? {
            onClick: function () {
                if (ranVariable !== index) {
                    callback(index);
                }
                secondCallback(false);
                return;
            }
        } : {})}>
            <img src={source.path}/>
        </div>
        )
}
const AddAvatar = ({ }) => {
    return (
        <div className="addContainer">
            <label for="file-button" class="addWraper">
                <PlusSign />
            </label>
            <input type="file" id="file-button" onChange={function (e) {
                console.log(e.target.files[0]);
                return;
            }}/>
        </div>
        )
}
export { ScoreBoard, LevelIndicator, ScoreScreen, InternalTable, AvatarContainer };