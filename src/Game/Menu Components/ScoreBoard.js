import * as React from "react";
import { ReactComponent as CheckMark } from "./Menu SVGs/checkmark3.svg"
import { ReactComponent as PlusSign } from "./Menu SVGs/plus1.svg";
import { ReactComponent as Cross } from "./Menu SVGs/cross4.svg"
import { ReactComponent as CheckMark2 } from "./Menu SVGs/checkmark5.svg"
import { ReactComponent as Cross2 } from "./Menu SVGs/cross2.svg"
import { ReactComponent as Refresh } from "./Menu SVGs/refresh2.svg"
import { ReactComponent as Internet } from "./Menu SVGs/globe_internet2.svg"
import {
    calculateScore, useUpdateScore, useRefreshScore, useDisplayError,
    remakeScoreObj, isNameTrue, useCloseCropper, useWrongFormat, onImageLoad,
    handleFileUpload, useCloseAvatarSelector, useSendAvatar, useGetAvatars,
    filterImportedIDs, divideIntoPages, movePageAvatar, useShowFileError,
    useGetAvsForSelector, useRefreshPages
} from "./ScoreHooksFuncs.js";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import { centerAspectCrop, canvasPreview, canvasPreview100 } from "./cropCanvas.js";
import { LeaderSlot, Loading, ArrowLeft, ArrowRight, ErrorPopup} from "./leaderBoard.js";
import { useClosePopUpGeneric } from "./settingsHooks.js";
const ScoreBoard = ({ currentLevel, linesCleared, resetLinesCleared, gameOn, Text, lang, setHoldScore, score,
    setNewGlobalScore, setIsChanged, errorState, setErrorState }) => {
    const FirstRenderRef = React.useRef(true);
    const ScoreObj = React.useRef({
        Score: 0,
        lines_4: 0,
        lines_3: 0,
        lines_2: 0,
        lines_1: 0,
        lines_total: 0,
        name: "",
        avatar_id: 0,
    }
    )
    useUpdateScore(FirstRenderRef, linesCleared, ScoreObj, currentLevel, resetLinesCleared, calculateScore);
    useRefreshScore(FirstRenderRef, gameOn, ScoreObj, setHoldScore, remakeScoreObj, score, setNewGlobalScore, setIsChanged, setErrorState);
    useClosePopUpGeneric(errorState, setErrorState, 2500);
    return (
        <>
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
        </>
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

const ScoreScreen = ({ gameOn, setGameOn, score, Text, lang, user, setUser, handleFocus, setNewScore, setHoldScore, getMemory,
    setMemory, importedAvatars, setImportedAvatars, avatarObj }) => {
    const [errorMessage, setErrorMessage] = React.useState("right");
    const [apiError, setApiError] = React.useState(false); // displays arror (failed API request)
    const [isInCorrect, setIsIncorrect] = React.useState(false);
    const [isAvUp, setIsAvUp] = React.useState(false); // state for avatar selector
    const [isAvatarCropper, setIsAvatarCropper] = React.useState(false) //state for avatar cropper. Need to be here to close respectible ones with escape.
    const [currentAv, setCurrentAv] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [sendErrorState, setSendErrorState] = React.useState(false);
    const [madeAvs, setMadeAvs] = React.useState(
        (getMemory("funk_tetris-made-avs") !== null) ? getMemory("funk_tetris-made-avs") : []
    )
    const [avatarState, setAvatarState] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [isSelectorLoading, setIsSelectorLoading] = React.useState(false);
    const [selectorState, setSelectorState] = React.useState(false); //used to trigger a hook. The react way (instaed of calling a single callback)
    const canvasRef = React.useRef(null);
    const handleClick = () => {
        if (isLoading) {
            return;
        }
        if (isNameTrue(user) !== true) {
            setIsIncorrect(true);
            setErrorMessage(isNameTrue(user))
            return;
        }
        setErrorMessage("right")
        score.name = user;
        score.avatar_id = currentAv;
        setHoldScore(JSON.parse(JSON.stringify(score)));
        setNewScore(true);
        setGameOn(false);
        return;
    }
    function sendAvatar(canvas) {
        setIsAvUp(false)
        setIsAvatarCropper(false) 
        canvasRef.current = canvas;
        setAvatarState(true);
        return;
    }
    function getAvatars() {
        if (isLoading !== false) { return };
        setIsSelectorLoading(true);
        setSelectorState(true);
        return;
    }
    useDisplayError(isInCorrect, setIsIncorrect); //display incorrect nickname
    useCloseAvatarSelector(isAvUp, setIsAvUp, isAvatarCropper, isSelectorLoading); //close with escape
    useSendAvatar(avatarState, setAvatarState, setIsLoading, canvasRef, madeAvs, setMadeAvs, setMemory, getMemory, setCurrentAv); //post new avatar
    useGetAvatars(avatarState, importedAvatars, setImportedAvatars, madeAvs, setIsLoading, setAvatarState,apiError, setApiError, 2500); //fetch avatars from API
    useGetAvsForSelector(selectorState, setSelectorState, setIsSelectorLoading, setMadeAvs, importedAvatars, setImportedAvatars,apiError, setApiError, 2000); // pass avatars to selector
    useClosePopUpGeneric(apiError, setApiError, 2500);//simply closes api error popup. 2000 seconds is animation duration, and the length of debounce.
    return (<>
        <div className="scoreScreenHolder">
            {
                isLoading && (
                    <Loading nameTheClass="loading score" popUp={true} popUpClass="popUp score"
                        Text={Text[lang].general.loading} isHidden="" loading={true} delay={500 } />
                )
            }
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
                }}> {currentAv < 7 ?
                    (
                            <AvatarContainer source={avatarObj.avatars[currentAv]} nameOfClass="scoreAvatarWrapper" avatarObj={avatarObj }/>
                    ) : isLoading ?(
                            <div className="scoreAvatarWrapper loading">
                                <Refresh/>
                            </div>
                        ) : 
                            (<AvatarContainer source={currentAv} nameOfClass="scoreAvatarWrapper" importedAv={importedAvatars["av" + currentAv]}
                                avatarObj={avatarObj }
                            />)
                    }
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
            {(isAvUp && !isLoading) ? (
                <ScoreAvatarSelector avatarObj={avatarObj} isUp={isAvUp} setIsUp={setIsAvUp} currentAv={currentAv} setCurrentAv={setCurrentAv}
                    Text={Text} lang={lang} cropperUp={isAvatarCropper} setCropperUp={setIsAvatarCropper} avatarCallback={sendAvatar}
                    avatarArray={madeAvs} importedAvObj={importedAvatars} currentPage={currentPage}
                    setCurrentPage={setCurrentPage} isSelectorLoading={isSelectorLoading} callbackForSelector={getAvatars}
                    selectorState={selectorState} setIsSelectorLoading={setIsSelectorLoading} setSelectorState={setSelectorState}
                />
            ) : (<></>)
            }
        </div>
        <ErrorPopup span={[Text[lang].general.server, Text[lang].general.again]} name4class="scoreScreen" state={apiError} twinkle={true} sudden="close"  keyprop="score-error-1"/>
    </>
        )
}
const ScoreInput = ({ isAutofocused, setUser, user, handleFocus }) => {
    const [inWidth, setWidth] = React.useState(0);
    return (
        <>
            <input type="text" id="nameInput" className="inputDiv"
                autoFocus={isAutofocused} onChange={function (e) {
                    setWidth(e.target.value.length);
                    setUser(e);
                }
                } onFocus={handleFocus}
                onBlur={handleFocus} value={user} style={{
                    width: inWidth > 10 ? 
                        inWidth*0.9 + "em" :
                        "10em"
                }}
            />
        </>
        )
}
const ScoreAvatarSelector = ({ avatarObj, isUp, setIsUp, currentAv, setCurrentAv, Text, lang, cropperUp, setCropperUp,
    avatarCallback, importedAvObj, avatarArray, currentPage, setCurrentPage, isSelectorLoading, callbackForSelector,
    selectorState, setIsSelectorLoading, setSelectorState
}) => {
    const [isFileError, setIsFileError] = React.useState(false);
    const [fileErrorMessage, setFileErrorMessage] = React.useState(false);
    const [imageSource, setImageSource] = React.useState(null);
    const [aspectRatio, setAspectRatio] = React.useState(1);
    const [crop, setCrop] = React.useState({});
    const [completeCrop, setCompleteCrop] = React.useState(null);
    const [pages, setPages] = React.useState(divideIntoPages(avatarObj.avatars, avatarArray, importedAvObj))
    useWrongFormat(isFileError, setIsFileError);
    useCloseCropper(cropperUp, setCropperUp, setImageSource);
    useRefreshPages(selectorState, setSelectorState, setPages, avatarObj.avatars, avatarArray, importedAvObj, setIsSelectorLoading);
    return (
        <div className={"scoreAvatarSelector " + `${(pages.length > 1) || (filterImportedIDs(avatarArray, importedAvObj) + avatarObj.avatars.length > 18) ? "large" : "" }`} >
            <Loading nameTheClass="refreshContainer avatar" Text={Text[lang].scoreBoard.refresh_avatar} popUp={true}
                popUpClass="refreshPopUp avatar" svg={Internet} callback={function () {
                    if (selectorState) {
                        return;
                    }
                    callbackForSelector();
                    return;
                }} popUpDelay={750 }
            />
            {
                isSelectorLoading ? (<div className="avatarPageContainer">
                    <div className="avatarPage">
                    <Loading nameTheClass="loading selector" Text={Text[lang].general.loading} popUp={true} popUpClass="popUp selector"
                        isHidden="" loading={true} delay={500}
                    />
                    <div className="loaderFiller">
                        <canvas className="loaderCanvas" width="100px" height="100px" />
                    </div>
                    <div className={"loaderFiller " + `${(filterImportedIDs(avatarArray, importedAvObj) + avatarObj.avatars.length > 6) ? "" : " hidden"}`} >
                        <canvas className="loaderCanvas" width="100px" height="100px" />
                    </div>
                    <div className={"loaderFiller " + `${(filterImportedIDs(avatarArray, importedAvObj) + avatarObj.avatars.length > 12) ? "" : " hidden"}`} >
                        <canvas className="loaderCanvas" width="100px" height="100px" />
                        </div>
                    </div>
                </div>
                ) :
                    (
                    <AvatarPages avatarObj = { avatarObj } avatarArray = { filterImportedIDs(avatarArray, importedAvObj) } importedAvatarObj = { importedAvObj }
                currentPage = { currentPage } setCurrentAv = { setCurrentAv }
                currentAv = { currentAv } setIsUp = { setIsUp } pages = { pages }
                modulo = {avatarObj.avatars.length % 24} pageOfConflict={parseInt(String(avatarObj.avatars.length / 24)[0])}
            setError={setIsFileError} setErrorMessage={setFileErrorMessage} setCropper={setCropperUp} setImageSource={setImageSource}
            setCrop={setCrop} Text={Text} lang={lang}
            />
                )
            }
            {cropperUp &&(
                <Cropper imageSource={imageSource} crop={crop} aspect={aspectRatio} setCrop={setCrop} setImageSource={setImageSource}
                    setIsAvatarCropper={setCropperUp} setCompleteCrop={setCompleteCrop} setErrorMessage={setFileErrorMessage}
                    setError={setIsFileError} setCropper={setCropperUp} Text={Text} lang={lang} completeCrop={completeCrop}
                    avatarCallback={avatarCallback}
                />
                )
            }

            <ArrowButton condition={pages.length > 1 && !isSelectorLoading}
                callback={()=>movePageAvatar(pages, currentPage, setCurrentPage, false)}
                svg={ArrowLeft} direction="left"
            />
            <ArrowButton condition={pages.length > 1 && !isSelectorLoading}
                callback={()=>movePageAvatar(pages, currentPage, setCurrentPage, true)}
                svg={ArrowRight} direction="right"
            />
            {
                (isFileError) ? (
                    <PopupChangeling state={isFileError} name4class="wrongFormatPopup" Text={Text} lang={lang} tab="scoreBoard" line={fileErrorMessage} secondClass=" pop" />
                ) : (<></>)
            }
            </div>
        )
}

const AvatarPages = ({ avatarObj, avatarArray, importedAvatarObj, currentPage, currentAv ,
    setCurrentAv, setIsUp, pages, pageOfConflict, modulo, setError, setErrorMessage, setCropper,
    setImageSource, setCrop, Text, lang
}) => {
    return (
        <div className="avatarPageContainer">
            {
                pages.map(function (x) {
                    if (x === pageOfConflict && x === pages.length - 1) {
                        return (
                            <AvatarPage key={"page_" + x} avatarObj={avatarObj.avatars.slice(x * 24, (x * 24) + modulo + 1)}
                                importedAvatars={importedAvatarObj} avatarArray={avatarArray} last={true}
                                currentAv={currentAv} setCurrentAv={setCurrentAv} setIsUp={setIsUp} state={currentPage}
                                page={x}
                                setError={setError} setErrorMessage={setErrorMessage} setCropper={setCropper}
                                setImageSource={setImageSource} setCrop={setCrop} Text={Text} lang={lang }
                            />
                        )
                    }
                    if (x === pageOfConflict) {
                        return (
                            <AvatarPage key={"page_" + x} avatarObj={avatarObj.avatars.slice(x * 24, (x*24) + modulo + 1)} importedAvatars={importedAvatarObj}
                                avatarArray={avatarArray.slice(0, 24 - modulo)}
                                currentAv={currentAv} setCurrentAv={setCurrentAv} setIsUp={setIsUp} state={currentPage} page={x}
                            />
                            )
                    }
                    
                    if (x === pages.length - 1) {
                        return (
                            <AvatarPage key={"page_" + x} importedAvatars={importedAvatarObj}
                                avatarArray={avatarArray.slice((x - pageOfConflict)*24 - modulo + 1)} last={true}
                                currentAv={currentAv} setCurrentAv={setCurrentAv} setIsUp={setIsUp} state={currentPage} page={x}
                                setError={setError} setErrorMessage={setErrorMessage} setCropper={setCropper}
                                setImageSource={setImageSource} setCrop={setCrop} Text={Text} lang={lang}
                            />
                            )
                    }
                    if (x > pageOfConflict) {
                        return (
                            <AvatarPage key={"page_" + x} importedAvatars={importedAvatarObj}
                                avatarArray={avatarArray.slice((x - pageOfConflict) * 24 - modulo, ((x - pageOfConflict) * 24) + modulo + 1)}
                                currentAv={currentAv} setCurrentAv={setCurrentAv} setIsUp={setIsUp} state={currentPage} page={x}
                            />
                            )
                    }
                    return (
                        <AvatarPage key={"page_" + x} avatarObj={avatarObj.avatars.slice(x * 24, 24 * (x + 1))}
                            currentAv={currentAv} setCurrentAv={setCurrentAv} setIsUp={setIsUp} state={currentPage} page={x}
                        />)
                })
            }
        </div>
        
    )
}
const AvatarPage = ({
    state, page, avatarObj = false, importedAvatars = false, avatarArray = false, last = false, Text=false, lang=false,
    currentAv, setCurrentAv, setIsUp, setError = false, setErrorMessage = false, setCropper = false, setImageSource = false, setCrop = false
}) => {
    return (
        <div className={"avatarPage" + `${(state === page) ? "" : " hidden"}`}>
            {
                avatarObj ? (
                    avatarObj.map(function (x, index) {
                        return (
                            <AvatarContainer key={"av-" + page + "-" + index} source={x} index={index}
                                isOnClick={true} callback={setCurrentAv} secondCallback={setIsUp}
                                ranVariable={currentAv} avatarObj={avatarObj}
                            />
                        )
                    })
                ) : (<></>)
            }
            {
                avatarArray ? (
                    avatarArray.map(function (x, index) {
                        return (
                            <AvatarContainer key={"av-" + page + "-" + x} source={x} index={index}
                                importedAv={importedAvatars["av"+x]}
                                isOnClick={true} callback={setCurrentAv} secondCallback={setIsUp}
                                ranVariable={currentAv} avatarObj={avatarObj}/>
                        )
                    })
                ) : (<></>)
            }
            {
                last ? (
                    <AddAvatar setError={setError} setErrorMessage={setErrorMessage} setCropper={setCropper}
                        setImageSource={setImageSource} setCrop={setCrop} Text={Text[lang].scoreBoard }
                    />
                    ): (<></>)
            }
        </div>
        )
}

const Cropper = ({ imageSource, crop, aspect, setCrop, setImageSource, setIsAvatarCropper, setCompleteCrop,completeCrop,
    setCropper, Text, lang, avatarCallback
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
    return (
        <div className="avatarCropperContainer" ref={cropRef }>
            <div className="cropControls">
                <AddAvatar setCropper={setCropper} setImageSource={setImageSource} Text={Text[lang].scoreBoard }
                    setCrop={setCrop} nameClass="addContainer2" id="file-button-2" optionalCallback={setSwitchPreview }/>
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
                                <LeaderSlot page={"0"} slot="0" score={previewSlot} Text={Text} lang={lang} source_exception={true }/>
                            </div>
                        </div>
                       
                    </div>

                        </>
                ) : <></>}
            </div>
            <div className="previewSmall">
                <div className="cropHoldButtons">
                    <div className="cropButton">
                        <Cross2 onClick={() => {
                            setImageSource(null);
                            setSwitchPreview(true);
                        }} />
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
                                    let temp = canvasRef2.current.toDataURL("image/jpeg");
                                    x.avatar.path = JSON.parse(JSON.stringify(temp));
                                    return x;
                                })
                            }
                            if (!switchPreview) {
                                console.log("sending callback")
                                avatarCallback(canvasRef2.current);
                            }
                            return;
                        } }/>
                    </div>

                </div>
            </div>
                </div >
        )
}

const AvatarContainer = ({ source, index, nameOfClass = "avatarContainer", isOnClick = false, callback = false, avatarObj,
    secondCallback = false, ranVariable = false, importedAv = false }) => {
    return (
        <div className={nameOfClass} {...(isOnClick ? {
            onClick: function () {
                if (ranVariable !== source) {
                    callback(source);
                }
                secondCallback(false);
                return;
            }
        } : {})}>
            {
                importedAv ? (
                    <img src={importedAv }/>
                ) : (
                        <img src={typeof source === "object" ?
                            (source.path)
                            : avatarObj.default.path} />
                    )
            }
            
        </div>
        )
}

const AddAvatar = ({ nameClass = "addContainer", id = "file-button", setCropper,
    setImageSource, setCrop, optionalCallback = false, Text }) => {
    const [errorMessage, setErrorMessage] = React.useState(false);
    const [classState, setClassState] = React.useState("")
    useShowFileError(errorMessage, setErrorMessage, classState, setClassState, 3000);
    return (
        <div className={nameClass}>
            {
                errorMessage && (
                    <div className={"filePopUp" + classState}>
                        <span>{Text[errorMessage]}</span>
                    </div>
                    )
            }
            <label htmlFor={id} className="addWraper">
                <PlusSign />
            </label>
            <input type="file" id={id }
                onChange={(event) => {
                    handleFileUpload(event, setErrorMessage, setCropper, setImageSource, setCrop);
                    if (typeof optionalCallback === "function") {
                        optionalCallback(true);
                    }
                    return;
                }}
               
            />
            
        </div>
        )
}
const PopupChangeling = ({state, name4class, secondClass=" ", Text, lang, tab, line }) => {
    return (
        <div className={`${state === true? name4class : name4class+secondClass}` }>
            <span>{Text[lang][tab]?.[line]}</span>
        </div>
        )
}
const ArrowButton = ({ condition, callback, svg, direction}) => {
    const Icon = svg;
    return (
        <div className={"avatarArrow " + direction + `${condition ? "" : " hidden"}`}>
            <Icon onClick={callback}/>
        </div>
        )
}
export { ScoreBoard, LevelIndicator, ScoreScreen, InternalTable, AvatarContainer };