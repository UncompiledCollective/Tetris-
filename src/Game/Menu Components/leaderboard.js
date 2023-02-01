import * as React from "react";
import { ReactComponent as LeaderBoardSvg } from "./Menu SVGs/leaderboard4.svg"
import { ReactComponent as SettingsCross } from "./Menu SVGs/cross4.svg";
import { ReactSVG } from "react-svg";   
import local from "./Menu SVGs/computer_desktop3.svg";
import global from "./Menu SVGs/globe_internet1.svg";
import placeholder from "./Menu PNGs/placeholder.png"
import { ReactComponent as Global } from "./Menu SVGs/globe_internet1.svg";
import { ReactComponent as Local } from "./Menu SVGs/computer_desktop3.svg"
import { ReactComponent as ArrowLeft } from "./Menu SVGs/arrow_left_circle1.svg"
import { ReactComponent as ArrowRight } from "./Menu SVGs/arrow_right_circle1.svg"
import { sortOfObj, movePage, useCloseOpenWindow, setterCallback, leaderCallBack, useUpdateLocalScore } from "./LeaderBoardHooksFuncs.js";
import "./leaderBoard.scss"
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
    setNoteNewScore, setHoldScore, Text, lang
}) => {   //leaderUp and setLeader are passed from GameContainer. They opena and close the menu.
    const [pageUp, setPageUp] = React.useState("local");
    const [currentPageLocal, setCurrentPageLocal] = React.useState(0); //controls which page currently we have of local/global scoreboard
    const [currentPageGlobal, setCurrentPageGlobal] = React.useState(0);
    const [localScoreBoard, setLocalScoreBoard] = React.useState(
        getMemory("localScore") !== null ? getMemory("localScore") : []
    )
    const [globalScoreBoard, setGlobalScoreBoar] = React.useState(
        []
    )
    useUpdateLocalScore(scoreObj, setMemory, getMemory, sortOfObj, newScore, setLocalScoreBoard, setNewScoreLocal, setNoteNewScore,
        setHoldScore
    );
    useCloseOpenWindow("Escape", leaderUp, leaderCallBack, setLeader)
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
                {(pageUp === "local") ? (
                    <LeaderBoardSpotsHolder name="local" pages={[0, 1]} currentPage={currentPageLocal} score={localScoreBoard}
                        Text={Text} lang={lang}
                    />
                ) :
                    (
                        <LeaderBoardSpotsHolder name="global" pages={[0, 1, 2, 3]} currentPage={currentPageGlobal}
                            score={globalScoreBoard} Text={Text} lang={lang}
                        />
                        )
                }
                <LeaderBoardArrowHolder callback={(direction) => {
                    movePage(direction, pageUp, currentPageLocal, currentPageGlobal,
                        setCurrentPageLocal, setCurrentPageGlobal)
                }} />
            </div>
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

const LeaderBoardSpotsHolder = ({ name, pages, currentPage, score, Text, lang }) => {
    return (
        <div className={"spotsHolder " + name}>
            {pages.map(function (x, index) {
                return (
                    <LeaderSlotsTab key={"randKey" + index + pages + "name"} page={index} currentPage={currentPage}
                        score={score} Text={Text} lang={lang} />
                    )
            })

            }
        </div>
        )
}

const LeaderSlotsTab = ({ page, currentPage, score, Text, lang }) => {
    const immutableArray = [0, 1, 2, 3, 4];
    var isHidden = page === currentPage ? [""] : ["hidden"];
    return (
        <div className={"leaderSlotHolder " + isHidden + " unselectable"}>
            {immutableArray.map((x) => {
                return (
                    <LeaderSlot key={"slot " + page + x} page={page} slot={x} score={score[(x + 1) * (page + 1) - 1] ? score[(x + 1) * (page + 1) - 1] : false} Text={Text} lang={lang} />
                    )
            })}
        </div>
        )
}
const LeaderSlot = ({ page, slot, score, Text, lang }) => {
    return (
            <div className={"leaderSlotProper"}>
                {score ? (
                    <div className="leaderSlot">
                        <AvatarContainer nameOfClass="slotAvatarContainer" source={score?.avatar} />
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
            <span>{Text[lang].scoreBoard.your_slot}{state[1] }</span>
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

export { LeaderBoardButton, LeaderBoard, NewLeaderUniversal, LeaderSlot };