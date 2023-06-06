import * as React from "react";
import { ReactComponent as LeaderBoardSvg } from "./Menu SVGs/leaderboard4.svg"
import { ReactComponent as SettingsCross } from "./Menu SVGs/cross4.svg";
import local from "./Menu SVGs/computer_desktop3.svg";
import global from "./Menu SVGs/globe_internet1.svg";
import { ReactComponent as Global } from "./Menu SVGs/globe_internet1.svg";
import { ReactComponent as Local } from "./Menu SVGs/computer_desktop3.svg"
import { ReactComponent as ArrowLeft } from "./Menu SVGs/arrow_left_circle1.svg";
import { ReactComponent as ArrowRight } from "./Menu SVGs/arrow_right_circle1.svg";
import { ReactComponent as RefreshCircle } from "./Menu SVGs/refresh2.svg";
import {
    sortOfObj, movePage, useCloseOpenWindow, setterCallback, leaderCallBack, useUpdateLocalScore,
    useRefereshGlobalScores, useImportAvatars, useClosePopUp, useDotCount
} from "./LeaderBoardHooksFuncs.js";
import "./leaderBoard.scss";
import { useClosePopUpGeneric } from "./settingsHooks.js";
import { InternalTable, AvatarContainer } from "./ScoreBoard.js";
const LeaderBoardButton = ({ handler }) => {
    const handleClick = () => {
        handler((x) => !x);
        return;
    }
    return (
        <div className="leaderBoardButtonHolder" id="leaderBoardButtonHolder">
            <LeaderBoardSvg className="leaderBoardButton" id="leaderBoardButton" onClick={handleClick} />
        </div>
        )
}
const LeaderBoard = ({ leaderUp, setLeader, setMemory, getMemory, scoreObj, newScore, setNewScoreLocal,
    setNoteNewScore, setHoldScore, Text, lang, importedAvatars, setImportedAvatars, avatarObj, setIsChanged
}) => {   //leaderUp and setLeader are passed from GameContainer. They opena and close the menu.
    const [pageUp, setPageUp] = React.useState("local");
    const [currentPageLocal, setCurrentPageLocal] = React.useState(0); //controls which page currently we have of local/global scoreboard
    const [currentPageGlobal, setCurrentPageGlobal] = React.useState(0);
    const [localScoreBoard, setLocalScoreBoard] = React.useState(
        getMemory("localScore") !== null ? getMemory("localScore") : []
    )
    const [globalScoreBoard, setGlobalScoreBoard] = React.useState(
        []
    )
    const [isLoading, setIsLoading] = React.useState(false)
    const [refreshScore, setRefreshScore] = React.useState(false);
    const [errorState, setErrorState] = React.useState(false);
    const firstRender = React.useRef(true);
    useUpdateLocalScore(scoreObj, setMemory, getMemory, sortOfObj, newScore, setLocalScoreBoard, setNewScoreLocal, setNoteNewScore,
        setHoldScore, setIsChanged
    );
    useCloseOpenWindow("Escape", leaderUp, leaderCallBack, setLeader, setErrorState);
    useRefereshGlobalScores(refreshScore, globalScoreBoard, setGlobalScoreBoard, setIsLoading, setRefreshScore);
    useImportAvatars(refreshScore, setIsLoading, importedAvatars, setImportedAvatars, setRefreshScore, 2500, setErrorState);
    useClosePopUpGeneric(errorState, setErrorState, 2500); //2000 is the animation duration;
    //useClosePopUp(errorState, setErrorState, true, false, true, 1500);
    return (
        <div className={`${leaderUp ? "leaderBoardContainer" : "leaderBoardContainer hidden"}` }>
            <div className="leaderBoardProper">
                <div className="leaderTabHolder">
                    <LeaderBoardTab name="global" source={global} callback={(x) => { setterCallback(x, pageUp, setPageUp) }}
                        pageUp={pageUp} svg={Global} />
                    <LeaderBoardTab name="local" source={local} callback={(x) => { setterCallback(x, pageUp, setPageUp) }}
                        pageUp={pageUp} svg={Local} />
                    <LeaderBoardCross callback={() => { leaderCallBack(setLeader) } }/>
                </div>
                
                {(pageUp === "local" && !isLoading) && (
                    <LeaderBoardSpotsHolder name="local" pages={[0, 1]} currentPage={currentPageLocal} score={localScoreBoard}
                        Text={Text} lang={lang} importedAvatars={importedAvatars} avatarObj={avatarObj}
                    />
                ) }
                {(pageUp === "global" && leaderUp && !isLoading) &&( 
                    <LeaderBoardSpotsHolder name="global" pages={[0, 1, 2, 3]} currentPage={currentPageGlobal}
                        score={globalScoreBoard} Text={Text} lang={lang} importedAvatars={importedAvatars}
                        avatarObj={avatarObj}
                    />
                    )
                }
                {isLoading && (
                    <div className="spotsHolder">
                        <Loading nameTheClass="loading leader" popUp={true} popUpClass="popUp leader"
                            Text={Text[lang].general.loading} isHidden="" loading={true}
                        />
                    </div>
                    )}
                <LeaderBoardArrowHolder callback={(direction) => {
                    movePage(direction, pageUp, currentPageLocal, currentPageGlobal,
                        setCurrentPageLocal, setCurrentPageGlobal)
                }} />
            </div>
            {(pageUp === "global" && !isLoading) && (
                <Loading nameTheClass="refreshContainer leader" callback={function () {
                    if (refreshScore === false) {
                        setRefreshScore(true);//this right here is a very simple way to debounce API calls
                        // I simply disable the button for as long as state that controls API calls is being updated;
                    }
                    return;
                }} popUp={true} Text={Text[lang].leader.refreshPopUp} popUpClass="refreshPopUp leader"/>
                )
            }
            <ErrorPopup state={errorState} name4class="leader global" span={[Text[lang].general.wrong, Text[lang].general.again]}
                twinkle={true} offsetTwinkle={lang === "pl" ? true : false } keyprop="leader-error-first"/>
        </div>
        )
}
const LeaderBoardTab = ({ name, source, callback, pageUp, svg }) => {
    const Icon = svg;
    const isUp = name === pageUp ? [" up"] : [""];
    const handleClick = () => {
        callback(name);
    }
    return (
        <div className={"leaderTab " + name + isUp}>
            <div className={"leaderImgContainer " + name} onClick={handleClick}>
                <Icon className={"leaderSVG " + name}/>
            </div>  
        </div>
        )
}

const LeaderBoardCross = ({ callback }) => {
    const handleClick = () => {
        callback();
    }
    return (
        <div className="leaderBoardCrossHolder" onClick={handleClick }>
            <SettingsCross className="settingsCross leader"/>
        </div>
        )
}

const LeaderBoardSpotsHolder = ({ name, pages, currentPage, score, Text, lang, importedAvatars, avatarObj }) => {
    return (
        <div className={"spotsHolder " + name}>
            {pages.map(function (x, index) {
                return (
                    <LeaderSlotsTab key={"randKey" + index + pages + "name"} page={index} currentPage={currentPage}
                        score={score} Text={Text} lang={lang} importedAvatars={importedAvatars} avatarObj={avatarObj}/>
                    )
            })

            }
        </div>
        )
}

const LeaderSlotsTab = ({ page, currentPage, score, Text, lang, importedAvatars, avatarObj }) => {
    const immutableArray = [0, 1, 2, 3, 4];
    var isHidden = page === currentPage ? [""] : ["hidden"];
    return (
        <div className={"leaderSlotHolder " + isHidden + " unselectable"}>
            {immutableArray.map((x) => {
                return (
                    <LeaderSlot key={"slot " + page + x} page={page} slot={x} score={score[x + page*5] ? score[x + page*5] : false}
                        Text={Text} lang={lang} importedAvatars={importedAvatars} avatarObj={avatarObj}/>
                    )
            })}
        </div>
        )
}
const LeaderSlot = ({ page, slot, score, Text, lang, source_exception = false, avatarObj, importedAvatars }) => {
    return (
            <div className={"leaderSlotProper"}>
                {score ? (
                <div className="leaderSlot">
                    {source_exception ? (<div className="slotAvatarContainer">
                        <img src={score.avatar.path ? score.avatar.path : avatarObj?.default?.path} />
                    </div>) //instead of rewriting entire component I added this exception clause. In a single instance
                        // (Cropper) I need this component to pass base64 string as image source, instead of index of an array of objects.
                        : score?.avatar_id < 7 ? (
                            <AvatarContainer nameOfClass="slotAvatarContainer" source={avatarObj.avatars[score?.avatar_id]} avatarObj={avatarObj }/>
                        ) : (
                                <AvatarContainer nameOfClass="slotAvatarContainer" source={score?.avatar_id} avatarObj={avatarObj }
                                    importedAv={importedAvatars["av" + score.avatar_id]} />
                            )
                        }
                        <div className="slotStatContainer">
                            <div className="slotScore">
                                <span>{Text[lang].scoreBoard.total}</span>
                                <div>{score.Score ? score.Score : 0}</div>
                            </div>
                            <div className="slotTitle">
                                <span>{score.name ? score.name : "player :)" }</span>
                            </div>
                            <div className="slotBig">
                            <div className="slotTableAndNumber">
                                <InternalTable whichOn={[true, true, true, true]}  />
                                    <span>{score.lines_4 ? score.lines_4 : 0}</span>
                            </div>
                            <div className="slotTableAndNumber">
                                <InternalTable whichOn={[true, false, true, true]} />
                                    <span>{score.lines_3 ? score.lines_3 : 0}</span>
                            </div>
                            <div className="slotTableAndNumber">
                                <InternalTable whichOn={[true, false, true, false]} />
                                <span>{score.lines_2 ? score.lines_2 : 0}</span>
                            </div>
                            <div className="slotTableAndNumber">
                                <InternalTable whichOn={[false, false, true, false]} />
                                    <span>{score.lines_1 ? score.lines_1: 0}</span>
                            </div>
                            </div>
                            <div className="slotSmall">
                                <span id="first">{Text[lang].scoreBoard.lines_total }</span>
                                <span id="second">{score.lines_total ? score.lines_total: 0}</span>
                            </div>
                        </div>
                    </div>
                    ):<></> }
        </div>        
        )
}

const NewLeaderUniversal = ({tab, Text, lang, state}) => {
    return (
        <div className={"newLeaderContainer " + tab + `${state[0]==="pop"?" pop": ""}`}>
            <span>{Text[lang].general.congratulations}</span>
            <span>{Text[lang].scoreBoard.new_score[tab]}</span>
            <span>{Text[lang].scoreBoard.your_slot}{state[1]+1}</span>
        </div>
        )
}
const LeaderBoardArrowHolder = ({ callback }) => {
    const handleClickRight = () => {
        callback("right")
    }
    const handleClickLeft = () => {
        callback("left")
    }
    return (
        <div className="leaderArrowHolder">
            <div className="leaderArrowContainer">
                <div className="leaderArrowMiniHolder left">
                    <ArrowLeft className="leaderArrow left" onClick={handleClickLeft} />
                </div>
            </div>
            <div className="leaderArrowContainer">
                <div className="leaderArrowMiniHolder right">
                    <ArrowRight className="leaderArrow right" onClick={handleClickRight} />
                </div>
            </div>
        </div>
    )
}

const Loading = ({ nameTheClass = "loadingContainer", Text = false, callback = false, popUp = false,
    popUpClass = "refreshPopUp unselectable", popUpDelay = 1500, isHidden = " hidden",
    loading = false, delay = 200, svg = false }) => {
    // every prop from callback on refers to popUp, which is used if you decide to make this component a refresh button
    const [classState, setClassState] = React.useState(isHidden);
    const [dots, setDots] = React.useState(0);
    const Icon = svg ? svg : false
    useClosePopUp(classState, setClassState, popUp, " out", " hidden", popUpDelay);
    useDotCount(loading, dots, setDots, 3, delay);
    return (
        <div className={nameTheClass}>
            {popUp && (
                <div className={popUpClass + classState}>
                    <span>{Text}</span>
                    {loading && (
                        <span style={{ letterSpacing: "2px" }}>{loading ? (dots > 2 ? "..." : dots > 1 ? ".." : dots > 0 ? "." : "") : ""}</span>
                    )}
                    {loading && (
                        <span style={{ color: "transparent", letterSpacing: "2px" }}>{dots > 2 ? "" : dots > 1 ? "." : dots > 0 ? ".." : "..."}</span>
                    )}
                </div>
            )}
            {
                svg ? (
                    <Icon {...(callback !== false ? {
                        onClick: function () {
                            callback();
                            return;
                        },
                        onMouseEnter: function () {
                            setClassState("")
                        },
                        onMouseLeave: function () {
                            setClassState(" out")
                        }
                    } : {})} />
                ) : (
                        <RefreshCircle {...(callback !== false ? {
                            onClick: function () {
                                callback();
                                return;
                            },
                            onMouseEnter: function () {
                                setClassState("")
                            },
                            onMouseLeave: function () {
                                setClassState(" out")
                            }
                        } : {})} />
                        )
            }
        </div>
        )
}
const ErrorPopup = ({ span, name4class = "", state, stateExecTrue = true, twinkle = false, offsetTwinkle = false,
    sudden = false, keyprop = "" }) => {
    //span should be an array.
    return (
        <div className={"errorPopup container " + name4class + `${state === stateExecTrue ? "" : " hidden"}`
            + `${sudden && state === sudden ? " close" : ""}`}>
            <div className={"errorPopup animation " + name4class}/>
            <div className={"errorPopup wrapper " + name4class}>
            {span && (
                    span.map(function (x, index) {
                        if (index === 0 && twinkle) {
                            return (
                                <span key={name4class + "-span-" + index + "-"+keyprop}>{x}
                                    <Twinkle name4class={"errorPopup " + name4class + `${offsetTwinkle ? " offset" : ""}`}  />
                                </span>
                                )
                        }
                    return (
                        <span key={name4class + "-span-" + index +"-"+keyprop}>{x}</span>)
                })
                )}
            </div>
            
        </div>
        )
}
const Twinkle = ({ name4class }) => {
    return (
        <div className={name4class + " twinkle"}>
            <svg width="0" height="0" viewBox="6 6 30 30">
                <symbol id="twinkle" viewBox="0 0 100 100">
                    <g className={name4class + " twinkle group"} opacity="0.8">
                        <g className={name4class + " twinkle large"}>
                            <path className={name4class + " twinkle path" } id="large" d="M41.25,40 L42.5,10 L43.75,40 L45, 41.25 L75,42.5 L45,43.75
                  L43.75,45 L42.5,75 L41.25,45 L40,43.75 L10,42.5 L40,41.25z " fill="white" />
                        </g>
                        <g className={name4class + " twinkle large-2"} transform="rotate(45)">
                            <use xlinkHref="#large" />
                        </g>
                        <g className={name4class + " twinkle small"}>
                            <path className={name4class + " twinkle path"} id="twinkle small" d="M41.25,40 L42.5,25 L43.75,40 L45,41.25 L60,42.5 L45,43.75
                        L43.75,45 L42.5,60 L41.25,45 L40,43.75 L25,42.5 L40,41.25z" fill="white" />
                        </g>
                    </g>
                </symbol>
                <use xlinkHref="#twinkle" x="0" y="0" width="50" height="50" />
            </svg>
        </div>
        )
}
export {
    LeaderBoardButton, LeaderBoard, NewLeaderUniversal, LeaderSlot, Loading,
    ArrowLeft, ArrowRight, ErrorPopup, Twinkle
};