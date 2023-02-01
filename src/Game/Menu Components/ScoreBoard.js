import * as React from "react";
import { ReactComponent as CheckMark } from "./Menu SVGs/checkmark3.svg"
import { ReactComponent as PlusSign } from "./Menu SVGs/plus1.svg";
import { ReactComponent as Cross } from "./Menu SVGs/cross4.svg"
import { ReactComponent as CheckMark2 } from "./Menu SVGs/checkmark5.svg"
import { ReactComponent as Cross2 } from "./Menu SVGs/cross2.svg"
import { ReactComponent as Refresh } from "./Menu SVGs/refresh2.svg"
import {
    calculateScore, useUpdateScore, useRefreshScore, useDisplayError,
    remakeScoreObj, isNameTrue, useCloseCropper, useWrongFormat, onImageLoad, handleFileUpload, useCloseAvatarSelector
} from "./ScoreHooksFuncs.js";
import { avatarObj } from "./Avatars/Avatars.js";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import { centerAspectCrop, canvasPreview, canvasPreview100, canvasToBase64, downloadFile } from "./cropCanvas.js";
import { LeaderSlot } from "./leaderBoard.js";
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
    const [isAvUp, setIsAvUp] = React.useState(false); // state for avatar selector
    const [isAvatarCropper, setIsAvatarCropper] = React.useState(false) //state for avatar cropper. Need to be here to close respectible ones with escape.
    const [currentAv, setCurrentAv] = React.useState(0);
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
    useCloseAvatarSelector(isAvUp, setIsAvUp, isAvatarCropper);
    return (
        <div className="scoreScreenHolder">
            {isInCorrect !== false ? (
                <div className={`${isInCorrect === "pop" ? "wrongPopUpHolder pop" : "wrongPopUpHolder"}`}>
                    <span>{errorMessage === "special" ? Text[lang].scoreBoard.special + Text.misc.chars : Text[lang].scoreBoard[errorMessage]}</span>
                </div>
                ):(<></>)
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
            {isAvUp ? (
                <ScoreAvatarSelector avObj={avatarObj} isUp={isAvUp} setIsUp={setIsAvUp} currentAv={currentAv} setCurrentAv={setCurrentAv}
                    Text={Text} lang={lang} cropperUp={isAvatarCropper} setCropperUp={setIsAvatarCropper} />
            ) : (<></>)
            }
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
const ScoreAvatarSelector = ({ avObj, isUp, setIsUp, currentAv, setCurrentAv, Text, lang, cropperUp, setCropperUp}) => {
    const [isFileError, setIsFileError] = React.useState(false);
    const [fileErrorMessage, setFileErrorMessage] = React.useState(false);
    const [imageSource, setImageSource] = React.useState(null);
    const [aspectRatio, setAspectRatio] = React.useState(1);
    const [crop, setCrop] = React.useState({});
    const [completeCrop, setCompleteCrop] = React.useState(null);
    useWrongFormat(isFileError, setIsFileError);
    useCloseCropper(cropperUp, setCropperUp, setImageSource);
    return (
        <div className="scoreAvatarSelector">
            
            {avObj.avatars.map(function (x, index) {
                return(
                    <AvatarContainer key={"avatar_" + index} index={index} source={avObj.avatars[index]} isOnClick={true} callback={setCurrentAv} secondCallback={setIsUp}
                        ranVariable={currentAv }
                    />
                    )
            })}
            <AddAvatar setError={setIsFileError} setErrorMessage={setFileErrorMessage} setCropper={setCropperUp} setImageSource={setImageSource}
                setCrop={setCrop}
            />
            
            {cropperUp &&(
                <Cropper imageSource={imageSource} crop={crop} aspect={aspectRatio} setCrop={setCrop} setImageSource={setImageSource}
                    setIsAvatarCropper={setCropperUp} setCompleteCrop={setCompleteCrop} setErrorMessage={setFileErrorMessage}
                    setError={setIsFileError} setCropper={setCropperUp} Text={Text} lang={lang} completeCrop={completeCrop}
                />
                )
            }
            {
                (isFileError) ? (
                    <PopupChangeling state={isFileError} name4class="wrongFormatPopup" Text={Text} lang={lang} tab="scoreBoard" line={fileErrorMessage} secondClass=" pop" />
                ) : (<></>)
            }
        </div>
        )
}

const Cropper = ({ imageSource, crop, aspect, setCrop, setImageSource, setIsAvatarCropper, setCompleteCrop,completeCrop,
    setError, setErrorMessage, setCropper, Text, lang
}) => {
    const [switchPreview, setSwitchPreview] = React.useState(true);
    const cropRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const canvasRef2 = React.useRef(null);
    const imageRef = React.useRef(null);
    const imgWidth = cropRef.current ? cropRef.current?.children[1]?.getBoundingClientRect()?.width - 5 + "px" : "0%";
    const imgHeight = cropRef.current ? cropRef.current?.children[1]?.getBoundingClientRect()?.height - 8 + "px" : "0%";
    const dynamicClass = switchPreview ? [""] : [" hidden"];
    const dynamicClass2 = switchPreview ? [" hidden"] : [""]; 
    const [previewSlot, setPreviewSlot] = React.useState({
        avatar: {
            path: null
        }
    }); // used to preview avatar inside a slot when cropping is done by the user
    console.log(previewSlot, "here");
    return (
        <div className="avatarCropperContainer" ref={cropRef }>
            <div className="cropControls">
                <AddAvatar setError={setError} setErrorMessage={setErrorMessage} setCropper={setCropper} setImageSource={setImageSource}
                    setCrop={setCrop} nameClass="addContainer2"/>
                <div className="cropText">
                    <span>{Text[lang].scoreBoard.image_crop}</span>
                    <span>{Text[lang].scoreBoard.image_crop2}</span>
                </div>
                <div className="cropCrossWrapper" onClick={() => {
                            setImageSource(null);
                            setIsAvatarCropper(false);
                        }}>
                            <Cross/>
                        </div>
                    </div>
                    <div className="previewBig" >
                        {imageSource ? (<>
                    <ReactCrop src={imageSource} crop={crop} onChange={(crop, percentCrop) => setCrop(percentCrop)}
                        onComplete={(crop, percentCrop) => setCompleteCrop(percentCrop)} className={"cropProper" + dynamicClass}
                                aspect={aspect }
                            >
                        <img src={imageSource} ref={imageRef }
                            onLoad={(event) => {
                                onImageLoad(event, aspect, setCrop, centerAspectCrop)
                            }}
                            style={{
                                maxWidth: imgWidth,
                                maxHeight: imgHeight,
                            } }
                        />
                    </ReactCrop>
                    <div className={"canvasContainer" + dynamicClass2} >
                        <div className="previewBigCropped first">
                            <canvas ref={canvasRef} className="canvasPreview Big" ></canvas>
                        </div>
                        <div className="previewBigCropped second">
                            <canvas ref={canvasRef2} className="canvasPreview small" ></canvas>
                        </div>
                        <div className="previewBigCropped third">
                            <div className="previewWrapper">
                                <LeaderSlot page={"0"} slot="0" score={previewSlot} Text={Text} lang={lang }/>
                            </div>
                        </div>

                        <button type="button" style={{ position: "absolute", bottom: "0", left:"0", width:"200px", height:"80px"}}
                            onClick={function () {
                                let file = canvasToBase64(canvasRef2.current);
                                console.log(file);
                                downloadFile(canvasRef2.current);
                                return;
                            } }
                        >test</button>
                        
                    </div>

                        </>
                        ):<></> }
            </div>
            <div className="previewSmall">
                <div className="cropHoldButtons">
                    <div className="cropButton">
                        <Cross2 onClick={()=>setImageSource(null) }/>
                    </div>
                    <div className={"cropButton" + dynamicClass2 } onClick={() => {
                            setSwitchPreview(true);
                        }}>
                            <Refresh />
                        </div>
                    <div className="cropButton">
                        <CheckMark2 onClick={() => {
                            if (switchPreview) {
                                setSwitchPreview(false);
                                canvasPreview(imageRef.current, canvasRef.current, completeCrop)
                                canvasPreview100(imageRef.current, canvasRef2.current, completeCrop)
                                setPreviewSlot((x) => {
                                    console.log(x);
                                    let temp = canvasRef2.current.toDataURL("image/jpeg");
                                    console.log(temp);
                                    x.avatar.path = JSON.parse(JSON.stringify(temp));
                                    return x;
                                })
                            }
                            return;
                        } }/>
                    </div>

                </div>
            </div>
                </div >
        )
}

const AvatarContainer = ({ source, index, nameOfClass = "avatarContainer", isOnClick = false, callback = false, secondCallback = false, ranVariable = false }) => {
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
            <img src={source?.path ? source.path : avatarObj.avatars[0].path }/>
        </div>
        )
}

const AddAvatar = ({ nameClass = "addContainer", id="file-button", setError, setErrorMessage, setCropper, setImageSource, setCrop}) => {
    return (
        <div className={nameClass} >
            <label htmlFor={id} className="addWraper">
                <PlusSign />
            </label>
            <input type="file" id={id }
                onChange={function (event) {
                    handleFileUpload(event, setErrorMessage, setError, setCropper, setImageSource, setCrop);
                }}
               
                />
        </div>
        )
}

const PopupChangeling = ({state, secondState, name4class, secondClass=" ", Text, lang, tab, line }) => {
    return (
        <div className={`${state === true? name4class : name4class+secondClass}` }>
            <span>{Text[lang][tab]?.[line]}</span>
        </div>
        )
}
export { ScoreBoard, LevelIndicator, ScoreScreen, InternalTable, AvatarContainer };