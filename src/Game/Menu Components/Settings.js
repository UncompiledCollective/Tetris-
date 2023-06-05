import * as React from "react";
import "./Menu.scss";
import "./settings.scss";
import { ReactComponent as SettingsScrew } from "./Menu SVGs/settings_screw.svg";
import { ReactComponent as SettingsCross } from "./Menu SVGs/cross1.svg"; 
import { ReactComponent as EyeOpen } from "./Menu SVGs/eye_open2.svg"
import { ReactComponent as EyeClosed } from "./Menu SVGs/eye_closed2.svg"
import { ReactComponent as Hint1 } from "./Menu SVGs/hint1.svg";
import { ReactComponent as CreditsLeft } from "./Menu SVGs/arrow_left1.svg";
import { ReactComponent as CreditsRight } from "./Menu SVGs/arrow_right1.svg";
import polishFlag from "./Menu PNGs/polish_flag2.png";
import englishFlag from "./Menu PNGs/english_flag2.png";
import aKey from "./Menu PNGs/A_key_done.png";
import dKey from "./Menu PNGs/D_key_done.png";
import sKey from "./Menu PNGs/S_key_done.png";
import qKey from "./Menu PNGs/Q_key_done.png";
import eKey from "./Menu PNGs/E_key_done.png";
import zKey from "./Menu PNGs/Z_key_done.png";
import cKey from "./Menu PNGs/C_key_done.png";
import title_done from "./Menu PNGs/title done4.png";
import arrowLeft from "./Menu PNGs/arrow_left_done.png";
import arrowRight from "./Menu PNGs/arrow_right_done.png";
import arrowDown from "./Menu PNGs/arrow_down_done.png";
import spaceBar from "./Menu PNGs/space_bar_done.png";
import escKey from "./Menu PNGs/Esc_key_done.png";
import pKey from "./Menu PNGs/P_key_done.png";
import oKey from "./Menu PNGs/O_key_done.png";
import gitHub from "./Menu PNGs/gitHub.png";
import animeSinging from "./Menu PNGs/anime singing1.png";
import { ReactComponent as ParagraphSVG } from "./Menu SVGs/paragraph3.svg";
import monitorHead from "./Menu PNGs/monitor head2.png";
import timingVariables from "./_SettingsLibrary.scss";
import {
    useCloseWindow, useKeepRotating, genArray, useLoadingSubtitle, useUpDots,
    arrowClick, refreshCreditsTab, transitionArraySetter, captureCordsSetText,
    useScrollCreditsMusic, useClosePopUpGeneric,
    useClosePopUpMouseOut,
    generateCloudOffset, generateSpin, useCloseState,
    generateDelayArray, useFadeSpansWelcome, useGetMoreSongs
} from "./settingsHooks.js";
import { ErrorPopup, Loading } from "./leaderBoard.js";
const SettingsButton = ({ setUp }) => {
    const [rotateIt, setRotate] = React.useState("rotate(0deg)");
    const [onSwitch, setSwitch] = React.useState(false);
    const [angle, setAngle] = React.useState(10);
    const [isTransition, setIsTransition] = React.useState(true);
    useKeepRotating(onSwitch, setSwitch, setRotate, angle, setAngle, 500, setIsTransition);
    return (
        <div className="settingsButton" onClick={() => { setUp(x => !x) }} onMouseEnter={function () {
            setSwitch(true);
            return;
        }} onMouseLeave={function () {
            setSwitch("third");
            return;
            }} >
            <SettingsScrew className="settingsScrew" fill="#FFFFFF" width="9%" style={{
                transform: rotateIt,
                ...isTransition ?{ transition: "transform 500ms linear" } : {}
            }} />
        </div>
        )
}
const SettingsPanel = ({ isUp, setUp, lang, setLang, ghost, setGhost, Text, mVol,
    setMVol, sfxVol, setSfxVol, mute, setMute, setMemory, about, setAbout, isCredits,
    setIsCredits, songsList, setSongsList, setSongState, apiBusy }) => {
    const [settingsUp, setSettingsUp] = React.useState("general");
    const closeSettings = () => {
        if (isUp) {
            setUp(false);
        } return;
    }
    const handleClick2 = () => {
        setUp(false);
        return;
    }
    useCloseWindow("Escape", closeSettings, isUp, about, isCredits);
    return (
        <div className={`${isUp ? "settingsPanel" : "settingsPanel hidden"}`}>
            <div className="contents">
            <div className="settingsTabs">
                    <SettingsTab tab="general" setSettingsUp={setSettingsUp} Text={Text} lang={lang }/>
                    <SettingsTab tab="sound" setSettingsUp={setSettingsUp} Text={Text} lang={lang} />
                    <SettingsTab tab="controls" setSettingsUp={setSettingsUp} Text={Text} lang={lang} />
                    <div className="crossTab">
                        <SettingsCross className="settingsCross" id="cross" onClick={handleClick2} />
                    </div>
                    
                </div>
                <GeneralScreen tab="general" settingsUp={settingsUp} lang={lang} setLang={setLang} ghost={ghost}
                    setGhost={setGhost} Text={Text} about={about} setAbout={setAbout} setMemory={setMemory}
                    setIsCredits={setIsCredits }
                />
                <SoundScreen tab="sound" settingsUp={settingsUp} Text={Text} lang={lang} mVol={mVol}
                    setMVol={setMVol} sfxVol={sfxVol} setSfxVol={setSfxVol} mute={mute}
                    setMute={setMute} setMemory={setMemory} songsList={songsList}
                    setSongsList={setSongsList} setSongState={setSongState} apiBusy={apiBusy }
                />
                <ControlsScreen tab="controls" settingsUp={settingsUp} Text={Text} lang={lang } />
            </div>
        </div>
        )
}

const SettingsTab = ({tab, setSettingsUp, Text, lang}) => {
    const handleClick = () => {
        setSettingsUp(tab);
    }
    return (
        <div className={"settingsTab tab " + tab + " unselectable"} onClick={handleClick }>
            <span>{Text[lang][tab][tab]}</span>
        </div>
        )
}

const GeneralScreen = ({ settingsUp, tab, lang, setLang, ghost, setGhost, Text, about, setAbout, setMemory,
    setIsCredits
}) => {

    const english = [];
    const polish = [];
    switch (lang) {
        case "eng":
            english.push("chosen")
            break;
        case "pl":
            polish.push("chosen");
            break;
    };
    const handleClick = () => {
        if (lang === "pl") {
            setLang("eng")
            setMemory("funk_tetris-lang", "eng")
        }
        return;
    };
    const handleClick2 = () => {
        if (lang === "eng") {
            setLang("pl")
            setMemory("funk_tetris-lang", "pl")
        }
        return;
    };
    const handleClick3 = () => {
        setGhost(!ghost);
        return;
    };
    const handleClick4 = () => {
        if (!about) {
            setAbout("loading")
            setMemory("funk_tetris-welcome", true)
        } return;
    }
    return (
        <div className={`${(settingsUp === tab) ? "settingsScreen general" : "hidden"}`}>
            <div className="generalBox">
                <div className="generalSettingContainer">
                    <div className="generalSettingBox">
                        <div className="launguage Text">{Text[lang].general.lang}</div>
                        <div className="lanuguage ButtonHolder">
                            <div className="flag" onClick={handleClick }>
                                <img src={englishFlag} alt="englishFlag" className={"englishFlag " + english} />
                                <div className="flagText unselectable"><span>{Text[lang].general.english}</span></div>
                            </div>
                            <div className="flag" onClick={handleClick2 }>

                                <img src={polishFlag} alt="polishFlag" className={"polishFlag " + polish}  />
                                <div className="flagText unselectable"><span>{Text[lang].general.polish}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="generalSettingContainer">
                    <div className="generalSettingBox">
                        <div className="ghostPiece Text">
                            <span>{Text[lang].general.ghostPiece}</span>
                            <div className="hint" id="hint"> <Hint1 /> </div>
                            <div className="helperDiv" id="helper" style={(lang === "eng") ? {
                                paddingTop: "0%"
                            } : {}}><span>{Text[lang].general.ghostDisc1}</span></div>
                        </div>
                        
                        
                        <div className="ghostPiece ButtonHolder">
                            <div className={`${ghost ? "eyeOpen" : "eyeOpen hidden"}`} onClick={handleClick3} id="eyeOpen">
                                <EyeOpen className="eyeOpenProper" />
                            </div>
                            <EyeClosed className={`${ghost ? "eyeClosed hidden" : "eyeClosed"}`} onClick={handleClick3} id="eyeClosed"/>
                        </div>
                    </div>
                </div>

            </div>
            <div className="generalBox">
                <div className="aboutContainer unselectable" onClick={handleClick4}>
                    <span>{Text[lang].about.about}</span>
                </div>
            </div>
            <div className="generalBox unselectable">
                <div className="creditsContainer" onClick={function () {
                    setIsCredits(true);
                    return;
                }}>
                    <span>{Text[lang].credits.credits }</span>
                </div>
            </div>
        </div>
        )
}
const CreditsScreen = ({ credits, setCredits, Text, lang, songList }) => {
    //random 750 added in delay is duration of modal, could have done with onAnimationEnd, probably more react way of doing it;
    const tabs = React.useRef(["general", "resources", "music"])
    const [creditsTab, setCreditsTab] = React.useState("general");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSubtitle, setIsSubtitle] = React.useState(false);
    const [string, setString] = React.useState("");
    const [dots, setDots] = React.useState(false)
    const [dotRe, setDotRe] = React.useState(false);
    const [transitionDirection, setTransitionDirection] = React.useState(false);
    const [transitionArray, setTransitionArray] = React.useState([0, 0, 0]);
    const [preventReload, setPreventReload] = React.useState(true);
    let arr = React.useRef(genArray(40));
    const closeCall = () => {
        if (credits) {
            setCredits(false);
            setIsSubtitle(false);
            setIsLoading(false);
            setString("");
            setDots(false);
            setDotRe(false);
            setCreditsTab("general");
            setTransitionArray([0, 0, 0]);
            setPreventReload(true);
        };
        return;
    }
    const arrowCall = (direction) => {
        if (preventReload) { return };
        setTransitionDirection(direction);
        setString("")
        refreshCreditsTab(setString, setDots, setDotRe, setIsLoading, setPreventReload);
        arrowClick(direction, tabs, creditsTab, setCreditsTab, setTransitionDirection);
        transitionArraySetter(direction, tabs, transitionArray, setTransitionArray, creditsTab);
        return;
    }
    useCloseWindow("Escape", closeCall, credits, false)
    /*useUpdateCreditsSubtitle(switchTab, setSwitchTab, transitionDirection, setString, setDots, setDotRe,
        setIsLoading, setPreventReload, tabs, creditsTab, setCreditsTab, setTransitionDirection,
        transitionArray, setTransitionArray
    )*/
    return (
        <>
            <div className={"credits modal" + `${credits ? "" : " hidden"}`}
            /> 
        <div className={"creditsScreen container" + `${credits ? "" : " hidden"}`}>
            <div className="creditsScreen tile-wrapper">
                {
                    arr.current.map(function (x, index) {
                        return (
                            <div className="creditsScreen tile" style={{
                                animationDelay: 500 + 50 * x + "ms"
                            }}
                                key={"tile-square-" + index}
                            ></div>
                        )
                    })
                    }
                    
                </div>
            <div className="creditsScreen cover"/>
                <div className="creditsScreen true">
               
                    <div className="creditsScreen holder title">
                        <div className="divide credits wrapper left">
                            <ParagraphSVG className="divide credits title" />
                        </div>
                        <span onAnimationEnd={function (e) {
                            if (e.animationName === "fade-in-top") {
                                setIsSubtitle(true);
                                setIsLoading(true);
                                setDots(3);
                                let timer = setTimeout(() => setPreventReload(false), 1000);
                                return () => clearTimeout(timer);
                            }
                        }}>{Text[lang].credits.credits}</span>
                        <div className="divide credits wrapper right">
                            <ParagraphSVG className="divide credits title" />
                        </div>
                    </div>
                    <CreditsSubtitle state={creditsTab} Text={Text[lang].credits[creditsTab]} state={isSubtitle}
                        loading={isLoading} setLoading={setIsLoading} string={string} setString={setString}
                        dots={dots} setDots={setDots} dotRe={dotRe} setDotRe={setDotRe}
                    />
                    <div className="credits holder tab">
                        <CreditsArrow svg={CreditsLeft} direction="left" callback={arrowCall}/>
                        <div className="credits tab wrapper">
                            <CreditsBox name4class="general" key="credits-box-tab-1" state={creditsTab}
                                secondState={transitionArray[0]} transitionDir={transitionDirection}
                                setPreventReload={setPreventReload} setTransitionArray={setTransitionArray}
                                Component={CreditsGeneral}
                                children={{
                                    src: monitorHead,
                                    title: Text[lang].credits.general,
                                    Text: Text[lang].credits.general_text,
                                    popUp_text: {
                                        name4class: "credits tab general",
                                        Text: Text.misc.name,
                                    }
                                }}
                                
                            />
                            <CreditsBox name4class="resources" key="credits-box-tab-3" state={creditsTab}
                                secondState={transitionArray[1]} transitionDir={transitionDirection}
                                setPreventReload={setPreventReload} setTransitionArray={setTransitionArray}
                                Component={CreditsAssets} children={{
                                    title: Text[lang].credits.resources,
                                    Text:Text[lang].credits.resources_text
                                }}
                            />
                            <CreditsBox name4class="music" key="credits-box-tab-2" state={creditsTab}
                                secondState={transitionArray[2]} transitionDir={transitionDirection}
                                setPreventReload={setPreventReload} setTransitionArray={setTransitionArray}
                                Component={CreditsMusic}
                                children={{
                                    title: Text[lang].credits.music,
                                    array: songList,
                                    error: Text[lang].general.wrong,
                                    popUp: Text[lang].general.copied,

                                }}
                                src={animeSinging}
                            />
                        </div>
                        <CreditsArrow svg={CreditsRight} direction="right" callback={arrowCall}/>
                    </div>
                </div>
                <CloseCross name4class="credits" callback={closeCall} />
            </div>
        </>
        )
}

const CreditsAssets = ({title, Text}) => {
    //let Elements = [
    //    { rW: 1, ofL: 0.05, ofT: 0.15, sW: 0.2 },
    //    { rW: 2, ofL: 0.05, sW: 0.2 },
    //    { rW: 1, ofL: 0.05, ofT: 0.15, sW: 0.2 },
    //];
    //const inlineStyle = React.useRef(generateProceduralBlocks(Elements, 0.3, 0.6, 0, false, 0,
    //    document.getElementById("procedural"), document.getElementById("procedura-container")))
    return (
        <>
           
            <div className="credits tab title resources"><span>{title}</span></div>
            <ResourcesTextHolder Text={[Text.assets]} keyprop="first"/>
            <ResourcesTextHolder Text={[Text.svg_p, Text.svg_repo]} keyprop="second" aHref="https://www.svgrepo.com/"/>
            <ResourcesTextHolder Text={[Text.png_p, Text.png_repo]} keyprop="third" aHref="https://icons8.com/"/>
            <ResourcesTextHolder Text={[Text.special_thanks, Text.codepen]} keyprop="fourth" aHref="https://codepen.io/" />
            <ResourcesTextHolder Text={[Text.inspire] } keyprop="fith"/>
            {/*
            <img src={src} id="procedural" style={{display:"none"} }/>
            <span style={{ animationDelay: "1500ms" }}>{Text}{Text2}{Text3}</span>
            <div className="credits tab image assets" id="procedura-container">
                {Elements.map(function (x, index) {
                    return (
                        <div className="procedural"
                            style={generateProceduralBlocks(Elements, 0.3, 0.6, 0, false, 0,
                                document.getElementById("procedural"), document.getElementById("procedura-container"))[index][0]}>
                            <div className="element main"
                                style={generateProceduralBlocks(Elements, 0.3, 0.6, 0, false, 0,
                                    document.getElementById("procedural"), document.getElementById("procedura-container"))[index][1][0] }
                            >
                                <img src={src }/>
                            </div>
                            <div style={generateProceduralBlocks(Elements, 0.3, 0.6, 0, false, 0,
                                document.getElementById("procedural"), document.getElementById("procedura-container"))[index][1][1] }
                                className="element side">
                                <img src={src }/>
                            </div>
                        </div>
                        )
                })}
            </div>
            //this is 2B procedural tiles
             */}
        </>
        )
}

const ResourcesTextHolder = ({ name4class = "", Text, aHref = false, keyprop = "" }) => {
    //keyprop literally to generate unique key for every one.
    return (
        <div className={"credits tab assets text-holder " + name4class}>
            {Text && (
                Text.map(function (x, index) {
                    if (aHref && index === Text.length - 1) {
                        return (
                            <span key={"span-"+keyprop+"-"+index+"-last" }><a href={aHref} target="_blank">{Text[index]}</a></span>
                        )
                    }
                    return (
                        <span key={"span-" + keyprop + "-" + index}>{Text[index]}</span>
                    )
                })
                )}
        </div>
        )
}

const CreditsBox = ({ name4class = "credits tab", state, secondState, src, transitionDir, setTransitionArray,
    setPreventReload, Component, children = {} }) => {
    return (
        <>
            {src && (
                <div className={"credits tab image " + name4class + `${(state === name4class) || secondState ?
                    "" : " hidden "}` + `${(secondState !== 0) ? transitionDir === "left" ? " left " : " right " : ""}`
                    + `${secondState === 2 ? "float-in" : "" + `${secondState === 1 ? " float-out " : ""}`}`
                }>
                    <img src={src} alt="" />
                    <div className={"credits tab helper-holder " + name4class + `${secondState === 1 ? " float-out " : ""}`}>
                        <div className={"credits tab helper " + name4class} />
                        <div className={"credits tab helper2 " + name4class} />
                            <div className={"credits tab helper3 " + name4class} />   
                    </div>
                    
                </div>
                )}
        <div className={"credits tab wrapped " + name4class + `${(state === name4class) || secondState ?
            "" : " hidden "}` + `${(secondState !== 0) ? transitionDir === "left" ? " left " : " right " : ""}`
            + `${secondState === 2 ? "float-in" : "" + `${secondState === 1 ? " float-out " : ""}`}`
        }
            {...secondState === 2 ? {
                onAnimationEnd: function (e) {
                    if (e.animationName === "float-tab-in-right" || e.animationName === "float-tab-in-left") {
                        setPreventReload(false);
                        setTransitionArray([0, 0, 0]);
                    }
                    return;
                }
            } : {}}
            id={"credits-wrapper-"+name4class}
        >
            {Component && (
                <Component state={secondState} {...children} />
                )}
            </div>
        </>
    )
}
const CreditsMusic = ({ state, title, array, error, popUp }) => {
    const cords = React.useRef([0, 0]);
    const [status, setStatus] = React.useState(false); //status of the popup
    useScrollCreditsMusic(state);
    useClosePopUpGeneric(status, setStatus, 3000);
    return (
        <>
            <div className="credits tab title" id="credits music title">
                <span>{title}</span>
            </div>
            {array.length > 0 ? (
                array.map(function (x, index) {
                    return (
                        <span style={{
                            animationDelay: 1500 + 200 * index + "ms"  //1000 seconds is float in animation time
                        }}
                            onClick={function (e) {
                                captureCordsSetText(e, x.title, cords, setStatus, status, "credits-wrapper-music");
                                return;
                            }}
                            key={"credits-song-author-" +index}
                        >{x.title}</span>
                        )
                })
            ): (
                    <div>{error}</div>
            )}
            <div className={"credits music popUp " + `${status ? "" : "hidden"}`}
                style={{
                    left: `${cords.current[0] + 2}px`,
                    top: `${cords.current[1]}px`,
                }}
            >
                <span>{popUp}</span>
            </div>
        </>
        )
}
const CreditsGeneral = ({ src, title, Text, popUp_text }) => {
    const arr = [0, 1, 2, 3, 4, 5]
    return (
        <>
            <div className="credits tab general image">
                <div className="credits tab title" id="credits music title">
                    <span>{title}</span>
                </div>
                <div className="credits tab general text-holder author">
                    <span>{Text.made}</span>
                    <span>{Text.author}
                        <ToGitPopup name4class={popUp_text.name4class} Text={popUp_text.Text} />
                    </span>
                </div>
                <CreditsGeneralTextHolder name4class="smaller" Text={{
                    s1: Text.with
                }
                } keyprop="1"/>
                <CreditsGeneralTextHolder Text={{
                    s1: Text.javascript,
                    s2: Text.javascript_frame,
                    s3: Text.react_libs_used
                }}
                    span={Text.react_libs_list}
                    keyprop="2"
                />
                <CreditsGeneralTextHolder Text={{
                    s1: Text.style,
                    s2: Text.sass
                }}
                    span={{ s: "sus" }} optional={true}
                    keyprop="3"
                />
                <CreditsGeneralTextHolder Text={{
                    s1: Text.api,
                    s2: Text.api_frame,
                    s3: Text.api_libs_used
                }}
                    span={Text.api_libs_list}
                    keyprop="4"
                />
                <CreditsGeneralTextHolder Text={{
                    s1: Text.database,
                    s2: Text.mysql
                }} span={{ s: "</>" }} optional={true}
                    keyprop="5"
                />
                <div className="credits general image container">
                    {arr.map(function (x, index) {
                        if (x === 0) {
                            return (
                                <div className="credits general contained main" key={"credits-general-img-" + index} >
                                    <img src={src} alt=""/>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className="credits general contained glitch" key={"credits-general-img-" + index} >
                                    <img src={src} alt=""/>
                                </div>
                            )
                        }
                            
                    })}
                    <div className="credits general contained static"></div>
                </div>
                {/*<div className="block">*/}
                {/*    <div className="side main"><img src={src }/></div>*/}
                {/*    <div className="side left"><img src={src }/></div>*/}
                {/*</div>*/}
                {/*<div className="block">*/}
                {/*    <div className="side main"><img src={src} /></div>*/}
                {/*    <div className="side left"><img src={src} /></div>*/}
                {/*</div>*/}
                {/*<div className="block">*/}
                {/*    <div className="side main"><img src={src} /></div>*/}
                {/*    <div className="side left"><img src={src} /></div>*/}
                {/*</div> */}
                {/*this was 2b tiles image*/ }
            </div>
        </>
        )
}
const ToGitPopup = ({ name4class = "", Text }) => {
    return (
        <div className={name4class + " container toGit"}>
            <div className={name4class + " toGit"}>
                <img src={gitHub} alt="" />
                <span><a href="https://github.com/UncompiledCollective" target="_blank">{Text}</a></span>
            </div>
        </div>
        )
}
const CreditsGeneralTextHolder = ({ name4class = "", Text, span, optional, keyprop="" }) => {
    const [state, setState] = React.useState(false);
    const offset = React.useRef(null);
    const spin = React.useRef(span ? generateSpin(Object.keys(span).length) : null );
    useClosePopUpMouseOut(state, setState, 2000);
    return (
        <div className={"credits tab general text-holder paragraph " + name4class}>
            {Object.keys(Text).map(function (x, index) {
                if (index !== 0 && index === Object.keys(Text).length-1) {
                    return (
                        <span onMouseEnter={() => setState(0)}
                            onMouseOutCapture={() => setState("close")}
                            id={span ? `${span[Object.keys(span)[0]]}` : ""}
                            onClick={() => generateCloudOffset(span[Object.keys(span)[0]])}
                            ref={offset}
                            className="disco-span"
                            key={"special-span-" + index + "-holder-"+keyprop }
                        >{Text[x]}</span>
                    )
                }
                return (
                    <span key={"regular-span-" + index + "-holder-" + keyprop}>{Text[x]}</span>
                    )
            })}
            {span && (
                Object.keys(span).map(function (x, index) {
                    let temp = generateCloudOffset(offset, 6.4, Object.keys(span).length, 1.4, 0.4, 2);
                    return (
                        <div className={"credits tab general lib-container " +
                            `${state !== false ? "" : " hidden"}` + `${state === true ? "show" : ""}` +
                            `${optional ? " optional" : ""}`
                        }
                            style={temp && !optional ? { left: temp[index][0], top: temp[index][1] } : {}}
                            key={"special-div-" + index + "-holder-" + keyprop}
                        >
                            <div className="credits tab general lib-spin"
                                style={span ? {
                                    animationDirection: spin.current[index] ? "alternate" : "alternate-reverse"
                                } : {}}
                            >
                                <div className="credits tab general lib-disco"
                                    style={span ? {
                                        animationDirection: spin.current[index] ? "alternate" : "alternate-reverse"
                                    } : {}}
                                />
                                <div className="credits tab general lib-shape">
                                    <div className="credits tab general lib-text"
                                        style={span ? {
                                            animationDirection: spin.current[index] ? "alternate-reverse" : "alternate"
                                        } : {}}
                                    >
                                        <span className={`${ optional ? "optional" : "" }` }>{span[x]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                })
                )}
        </div>
        )
}

const CreditsArrow = ({ svg, name4class="credits arrow", direction=false, callback, setString }) => {
    let Icon = svg;
    return (
        <div className={name4class + " " + direction} onClick={function () {
            callback(direction);
        } }>
            <div className={"credits animation first " + direction} />
            <div className={"credits animation second " + direction } />
            <div className={"credits svg wrapper first " + direction}>
                <Icon />
            </div><div className={"credits svg wrapper second " + direction}>
                <Icon />
            </div>
        </div>
        )
}

const CreditsSubtitle = ({ state, name4class = "credits holder subtitle", Text, loading, setLoading, string, setString,
    dots, setDots, dotRe, setDotRe
}) => {
    useLoadingSubtitle(loading, setLoading, Text, string, setString)
    useUpDots(dots, setDots, loading, 750, dotRe, setDotRe)
    return ( 
        <div className={name4class + `${state ? " fadeIn" : ""}`}>
            <span className="left">{"<"}</span>
            <span>{string}</span>
            {dots !== false && (
            <span style={{letterSpacing:"2px"}}>{dots > 2 ? "..." : dots >1 ? ".." : dots > 0 ? "." : ""}</span>
            )}
            {(dots !== false && !dotRe) && (
            <span style={{ letterSpacing: "2px", color: "transparent" }}>{dots > 2 ? "" : dots > 1 ? "." : dots > 0 ? ".." : "..."}</span>
                )}
            <span className="right" style={{ letterSpacing: "1px" }}>{"/"}</span>
            <span className="right" >{">"}</span>
        </div>
        )
}
const AboutScreen = ({ about, setAbout, lang, setLang, Text, setMemory, logo }) => {
    const arr = React.useRef(genArray(40));
    const [doneState, setDoneState] = React.useState(true); //closes the done logo after animation. Otherwise it's like an overlay.
    const [fadeState, setFadeState] = React.useState(false);
    const closeCallback = () => {
        if (about === "loading") {
            setAbout(false);
            setMemory("funk_tetris-welcome", false)
            setDoneState(true);
            setFadeState(false);
        }
        if (about === true) {
            setAbout("close")
            setMemory("funk_tetris-welcome", false)
            setDoneState(true);
            setFadeState(false);
        }
        if (about === "close") {
            setMemory("funk_tetris-welcome", false)
            setDoneState(true);
            setAbout(false);
            setFadeState(false);
        }
        return;
    }
    const changeLang = (x) => {
        if (fadeState === false && lang !== x) {
            setFadeState(true);
        }
        return;
    }
    useCloseWindow("Escape", closeCallback, about, false);
    useCloseState(about, setAbout, "close", false, 1500);
    useFadeSpansWelcome(fadeState, setFadeState, setLang, [0, timingVariables.fadeSpanOutDuration,timingVariables.fadeSpanInDuration,])
    return (
        <>
            <div className={"welcome screen modal " + `${about ? "" : "hidden"}` + `${about === "close" ? " close-welcome-modal" : ""}`}>
            <div className={"welcome screen modal-wrapper "}>
                <div className="welcomeScreen starry-sky"/>
                <div className="welcomeScreen starry-sky"/>
                <div className="welcomeScreen starry-sky"/>
                </div>
            </div>
            <div className={"welcomeScreen large wrapper " + `${about ? "" : "hidden "}` + `${about === "close" ? " close-welcome" : ""}`}>
            <div className={"welcomeScreen container main "}>
                <div className="welcomeScreen lights container">
                    <div className="welcomeScreen lightWrapper">
                    <div className="welcomeScreen lamp container left">
                        <div className="welcomeScreen lightSource left">
                            <div className="welcomeScreen light-proper"/>
                        </div>
                        <div className="welcomeScreen lamp proper main left">
                            <div className="welcomeScreen lamp guts"/>
                            <div className="welcomeScreen lamp guts" />
                            
                        </div>
                    </div>
                    <div className="welcomeScreen lamp container right">
                        <div className="welcomeScreen lightSource right">
                            <div className="welcomeScreen light-proper" />
                        </div>
                        <div className="welcomeScreen lamp proper main right">
                            <div className="welcomeScreen lamp guts" />
                            <div className="welcomeScreen lamp guts" />
                        </div>
                    </div>
                    </div>
                    </div>
                <div className={"welcomeScreen tiles container "}>
                    <div className="welcomeScreen tiles wrapper">
                        {arr.current.map(function (x, index) {
                            if (index < Math.floor(arr.current.length / 2)) {
                                if (index % 2) {
                                    return (
                                        <div className="welcomeScreen tile odd"
                                            style={{ animationDelay: 500 + 50 * x + "ms" }}
                                            key={"skewed-tile" + index + "-odd"}
                                        />
                                    )
                                } else {
                                    return (
                                        <div className="welcomeScreen tile even"
                                            style={{ animationDelay: 500 + 50 * x + "ms" }}
                                            key={"skewed-tile" + index + "-even"}
                                        />
                                    )
                                }
                            } else {
                                if (index % 2) {
                                    return (
                                        <div className="welcomeScreen tile odd"
                                            style={{ animationDelay: 500 + 50 * (Math.floor(arr.current.length / 2) -x + 20) + "ms" }}
                                            key={"skewed-tile" + index + "-odd"}
                                        />
                                    )
                                } else {
                                    return (
                                        <div className="welcomeScreen tile even"
                                            style={{ animationDelay: 500 + 50 * (Math.floor(arr.current.length / 2) - x + 20) + "ms" }}
                                            key={"skewed-tile" + index + "-even"}
                                        />
                                    )
                                }
                            }
                        
                    })}
                    </div>
                </div>

                    <WelcomeMainPage state={fadeState} Text={Text} lang={lang} callback={changeLang}
                        closePage={closeCallback}
                    />
                </div>
            
            <LogoTransition state={about} src={[logo]} secondState={doneState }/>
            <TitleDone state={about} setState={setAbout} src={title_done} secondState={doneState} setSecondState={setDoneState} />
            <FireWorks state={about} secondState={doneState} />
            </div>
        </>
        )
}

const WelcomeMainPage = ({ state, Text, lang, callback, closePage }) => {
    const delayArray = React.useRef(generateDelayArray(100, 20));
    return (
        <div className={"welcomeScreen proper container "}>
            <CloseCross callback={closePage} name4class="welcomePage" />
            <div className="welcomeScreen title-rel container">
                <div className="welcomeScreen title-rel wrapper">
                    <img src={title_done} alt="" />
                </div>
            </div>
            
            <WelcomeSpans spans={
                [
                    [
                        [
                            Text[lang].about.greetings
                        ], {
                            name: "greetings",
                            join: false,
                        }
                    ],

                    Text[lang].about.welcome,

                    [
                        [
                            Text.misc.title_funk,
                            Text.misc.title_tetris,
                            Text.misc.title_night,
                            Text.misc.title_reloaded,
                        ],
                        {
                            name: "title",
                            join: false,
                            children: {
                                name4class: "welcomeScreen toGit",
                                Text: Text.misc.name
                            }
                        }

                    ],


                    [
                        [
                            Text[lang].about.span1 + " " + Text[lang].about.span2,
                            Text.misc.name,
                            "."
                        ],
                        {
                            name: "span-name",
                            join: true,
                            popUp: 1,
                            children: {
                                name4class: "welcomeScreen toGit",
                                Text: Text.misc.name
                            }
                        },
                        ToGitPopup

                    ],
                    [
                        [
                            Text[lang].about.span3,
                            Text[lang].about.span4,
                        ],
                        {
                            name: "span-name-2",
                            join: true
                        }
                    ],
                    [[Text[lang].about.span5], { name: "span-name-3", join: true }],
                    Text[lang].about.enjoy

                ]
            } delay={delayArray.current} state={state} />
            <div className="welcomeScreen launguage selector container">
                <div className="welcomeScreen launguage selector wrapper">
                    <div className="welcomeScreen launguage box left">
                        <div className="welcomeScreen launguage-proper left" onClick={function (e) {
                            callback("eng")
                        }}>
                            <HoverTricklang />
                            <span className={"left lang-span" + `${state === "fade-out" ? " fade-span-out" : ""}` + `${state === "fade-in" ? " fade-span-in" : ""}`}>{Text[lang].about.eng}</span>
                        </div>
                    </div>
                    <div className="welcomeScreen launguage box">
                        <div className="welcomeScreen launguage-proper" onClick={function (e) {
                            callback("pl")
                        }}>
                            <HoverTricklang />
                            <span className={"lang-span" + `${state === "fade-out" ? " fade-span-out" : ""}` + `${state === "fade-in" ? " fade-span-in" : ""}`}>
                                {Text[lang].about.pl}</span>
                        </div>
                    </div>
                </div>

            </div>
           
        </div>
    )
}
const CloseCross = ({ callback, name4class = "" }) => {
    return (
        <div className={"close-cross " + name4class + " container"}>
            <div className={"close-cross wrapper " + name4class} onClick={callback}>
            </div>
        </div>
        )
}
const WelcomeSpans = ({ spans = null, delay = false, state }) => {
    return (
        <div className={"welcomeScreen spans container"}>
     
            {spans && spans.map(function (x, index) {
                if (typeof x === "object") {
                    var Component = 0;
                    if (x.length === 3) {
                        Component = x[2];
                    }
                    return (
                        <div key={"welcome-span-welcome-special-container" + index} className={"welcomeScreen special span " + x[1].name }>
                            {x[1]?.join ? (
                                <div className={"common-wrapper" + `${state === "fade-out" ? " fade-span-out" : ""}`+ `${state === "fade-in" ? " fade-span-in" : ""}`}
                                    style={{ animationDelay: delay[index] }} key={"welcome-span-welcome-special-joined-common-wrapper" + index}
                                >{
                                    x[0].map(function (y, index2) {
                                        if (x.length === 3 && index2 === x[1].popUp) {
                                            return (<span key={"special-joined-span-1-" + index + "-" + index2}
                                                className={"welcome special joined-span" + index + "-" + index2}
                                            >
                                                <Component {...x[1].children} key={"component-span-special-" + index }/>
                                                {y}
                                            </span>)

                                        }
                                        return (<span key={"special-joined-span-2-" + index + "-" + index2}
                                            className={"welcome special joined-span" + index + "-" + index2 + `${state === "fade-out" ? " fade-span-out" : ""}` + `${state === "fade-in" ? " fade-span-in" : ""}`}
                                            style={{ animationDelay: delay[index] }}
                                        >{y}</span>)
                                    })
                                }</div>
                            ) : (
                                    x[0].map(function (y, index2) {

                                        return (<div className={"wrapper" + `${state === "fade-out" ? " fade-span-out" : ""}` + `${state === "fade-in" ? " fade-span-in" : ""}`}
                                            style={{ animationDelay: delay[index] }} key={"special-div-wrapper-" + index + "-" + index2}
                                        ><span key={"special-span-wrapped-" + index + "-" + index2}
                                        >{y}</span></div>)
                                    })
                                    )
                                    
                                    }
                        </div>
                        )
                }
                return (
                    <div className={"welcome-regular span-" + index}
                        style={{ animationDelay: delay[index] }}
                        key={"welcome-regular-span" + index }
                    >
                        <div key={"welcome-div-wrapper-welcome-" + index} className={"welcome-span generic-" + index}
                            className={"wrapper " + `${state === "fade-out" ? " fade-span-out" : ""}` + `${state === "fade-in" ? " fade-span-in" : ""}`}>
                            <span key={"welcome-span-welcome-" + index} className={"welcome-span generic-" + index}
                            >{x}</span>
                        </div>
                    </div>
                    )
            }) }
        </div>
        )
}
const FireWorks = ({ state, secondState }) => {
    return (
        <div className={"welcomeScreen fire div " + `${state && secondState ? "" : " hidden"}`}>
            <div className="welcomeScreen fire container">
            </div>
        </div>
    )
}
const LogoTransition = ({ state, src, secondState }) => {
    const Arr = React.useRef(genArray(6));
    return (
        <>
            <div className={"welcomeScreen logo container " + `${state && secondState ? "" : " hidden"}`}>
                <div className={"welcomeScreen logo wrapper"}>
                    <div className="welcomeScreen logo proper holder">
                        <div className="welcomeScreen beam top wrapper">
                            <div className="welcomeScreen logo prop" />
                            <div className="welcomeScreen logo prop" />
                            <div className="welcomeScreen logo prop">
                                <div className="welcomeScreen logo pseudo" />
                                <div className="welcomeScreen logo pseudo" />
                                <div className="welcomeScreen logo pseudo" />
                                <div className="welcomeScreen logo pseudo" />
                            </div>
                            <div className="welcomeScreen logo prop" />
                            <div className="welcomeScreen logo prop" />
                            <div className="welcomeScreen logo prop" />
                        </div>
                        <div className="welcomeScreen beam bottom wrapper">
                            <div className="welcomeScreen beam bottom prop">
                                <div className="welcomeScreen beam bottom pseudo" />
                                <div className="welcomeScreen beam bottom pseudo" />
                                <div className="welcomeScreen beam bottom pseudo" />
                                <div className="welcomeScreen beam bottom pseudo" />
                            </div>
                            <div className="welcomeScreen beam bottom prop" />
                            <div className="welcomeScreen beam bottom prop">
                                <div className="welcomeScreen beam bottom pseudo" />
                                <div className="welcomeScreen beam bottom pseudo" />
                                <div className="welcomeScreen beam bottom pseudo" />
                                <div className="welcomeScreen beam bottom pseudo" />
                            </div>
                        </div>

                        <div className="welcomeScreen screen prop" />
                        <div className="welcomeScreen div wrapper">
                            {src && Arr.current.map(function (x) {
                                return (
                                    <div style={{
                                        backgroundImage: "url(" + src[0] + ")"
                                    }}
                                        key={"div-with-background-" + x}
                                        className={"welcomeScreen logo div piece" + x}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const HoverTricklang = () => {
    return (
        <>
            <div className="welcomeScreen launguage trick wrapper top left hor">
                <div className="trick-wrapper">
                    <div className="welcomeScreen launguage trick" />
                    <div className="welcomeScreen launguage trick" />
                </div>
            </div>
            <div className="welcomeScreen launguage trick wrapper top left ver">
                <div className="trick-wrapper">
                    <div className="welcomeScreen launguage trick" />
                    <div className="welcomeScreen launguage trick" />
                </div>
            </div>
            <div className="welcomeScreen launguage trick wrapper bottom right hor">
                <div className="trick-wrapper">
                    <div className="welcomeScreen launguage trick" />
                    <div className="welcomeScreen launguage trick" />
                </div>
            </div>
            <div className="welcomeScreen launguage trick wrapper bottom right ver">
                <div className="trick-wrapper">
                    <div className="welcomeScreen launguage trick" />
                    <div className="welcomeScreen launguage trick" />
                </div>
            </div>
        </>
        )
}

const TitleDone = ({ state, setState, src, secondState, setSecondState }) => {
    return (
        <div className={"welcomeScreen title done container " + `${state && secondState ? "" : " hidden"}`}
            onAnimationEnd={function (e) {
                if (e.animationName === "fade-the-done-out") {
                    setSecondState(false);
                    setState(true);
                }
            }}
        >
            <div className="welcomeScreen title done relative">
            <div className="welcomeScreen title done wrapper">
                <img src={src } alt=""/>
                </div>
            </div>
        </div>
        )
}
const SoundScreen = ({ settingsUp, tab, Text, lang, mVol, setMVol, sfxVol,
    setSfxVol, mute, setMute, setMemory, songsList, setSongsList, setSongState, apiBusy }) => {
    const handleChangeMusic = (e) => {
        let volume = e.target.valueAsNumber
        setMVol(volume);
        setMemory("funk_tetris_music-volume",volume); // updates local storage to store this value
        unMute(mute, setMute);
        return;
    }
    const handleChangeSfx = (e) => {
        let volume = e.target.valueAsNumber
        setSfxVol(volume);
        setMemory("funk_tetris_sfx-volume", volume);
        return;
    }
    const getBackgroudSize = (value) => {
        return { backgroundSize: `${(value)}%`}
    }
    return (
        <div className={`${(settingsUp === tab) ? "settingsScreen sound" : "hidden"}`}>
            <div className="soundScreenContainer">
                <div className="soundScreenBox text">
                    <span>{Text[lang].sound.music}</span>
                </div>
                <div className="soundScreenBox slider">
                    <div className="soundSliderHolder">
                        <input className="soundSlider" type="range" min="0" max="100" step="5"
                            value={mVol} onChange={handleChangeMusic}
                            style={getBackgroudSize(mVol)} />
                        <div className="inputMarks"></div>
                    </div>
                </div>
            </div>
            <SongsFetchButton songs={songsList} setSongs={setSongsList} popup={Text[lang].sound.click}
                error={[Text[lang].general.server, Text[lang].general.again]}
                success={Text[lang].sound.success} setSongState={setSongState}
                apiBusy={apiBusy} busy={Text[lang].sound.busy }

            />
            <div className="soundScreenContainer" style={{ display:"none" }}>
                <div className="soundScreenBox text">
                    <span>{Text[lang].sound.sfx }</span>
                </div>
                <div className="soundScreenBox slider">
                    <div className="soundSliderHolder">
                        <input className="soundSlider" type="range" min="0" max="100" step="5"id="sound"
                            value={sfxVol} onChange={handleChangeSfx}
                            style={getBackgroudSize(sfxVol)} />
                        <datalist id="soundList">
                            <option>0</option>
                            <option>25</option>
                            <option>50</option>
                            <option>75</option>
                            <option>100</option>
                        </datalist>
                        <div className="inputMarks"></div>
                    </div>
                </div> 
            </div>
        </div>
        )
}
const SongsFetchButton = ({ songs, setSongs, popup, error, success, setSongState,
    apiBusy, busy }) => {
    const [apiState, setApiState] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [apiPopup, setApiPopup] = React.useState(false)
    const handleClick = () => {
        if (apiBusy) {
            if (!apiPopup) {
                setApiPopup(true);
            }
            return;
        }
        if (apiState === false) {
            setApiState(true);
        }
    }
    // 
    useGetMoreSongs(apiState, setApiState, songs, setSongs, 2500, 2500, setLoading, setSongState);
    useClosePopUpGeneric(apiPopup, setApiPopup, 2000);
    return (<>
        <div className="fetch-songs container">
            <div className="fetch-songs label wrapper">
                <label htmlFor="fetch-songs" className="fetch-songs button label">
                    <div className={"fetch-songs plus container " + `${loading === true ? " fade-plus-out " : ""}`
                        + `${loading === "close" ? " fade-plus-in ":""}`

                    } />
                    <Loading nameTheClass={"fetch-songs loading holder " + `${!loading ? " hidden " : ""}`
                        + `${loading === true ? " fade-loading-in " : ""}` +
                        `${loading === "close" ? " fade-loading-out " : ""}`
                    }
                    />
                    <div className="fetch-songs skew container"/>
                </label>
                <div className="fetch-songs popup">
                    <span>{popup }</span>
                </div>
            </div>
            <button type="button" id="fetch-songs" className="fetch-songs button proper" onClick={handleClick} />
        </div>
        <ErrorPopup state={apiState} span={error} name4class="fetch-songs-error" stateExecTrue="fourth" twinkle={false} keyprop="song-fetch-error-1" />
        <div className={"fetch-songs already container" + `${apiState === "third" ? "" : " hidden"}`}>
            <div className="fetch-songs already wrapper">
                <span>{success}</span>
            </div>
        </div>
        <div className={"fetch-songs api-busy container" + `${apiBusy && apiPopup ? "" : " hidden"}`}>
            <div className="fetch-songs api-busy wrapper">
                <span>{busy}</span>
            </div>
        </div>

    </>
        )
}
const ControlsScreen = ({ settingsUp, tab, Text, lang }) => {
    return (
        <div className={`${(settingsUp === tab) ? "settingsScreen controls" : "hidden"}`}>
            <div className="controlsContainer left">
                <div className="controlsBox big">
                    <img src={escKey} className="escKey"alt="escKey" />
                    <div className="escKeyText">{Text[lang].controls.esc }
                    </div>
                </div>
                {/*<div classname="controlsbox filler"/>*/}
                <div className="controlsBox text">
                    <div className="keyText title">{Text[lang].controls.rotate}
                    </div>
                </div>
                <div className="controlsBox text">
                    <div className="keyText left">{Text[lang].controls.left}</div>
                    <div className="keyText right">{Text[lang].controls.right}</div>
                </div>
                <div className="controlsBox key">
                    <img src={qKey } className="imgLeft" alt="qKey"/>
                    <img src={eKey } className="imgRight"alt="eKey"/>
                </div>
                <div className="controlsBox or">
                    <div className="keyText or">{Text[lang].controls.or}</div>
                </div>
                <div className="controlsBox key">
                    <img src={zKey} className="imgLeft" alt="zKey" />
                    <img src={cKey} className="imgRight" alt="cKey"/>
                </div>
            </div>


            <div className="controlsContainer center">
                <div className="controlsBox big" />
               {/* <div className="controlsBox filler" />*/}
                <div className="controlsBox text">
                    <div className="keyText title">{Text[lang].controls.movement}</div>
                </div>
                <div className="controlsBox text">
                    <div className="keyText triplet">{Text[lang].controls.left}</div>
                    <div className="keyText triplet">{Text[lang].controls.down}</div>
                    <div className="keyText triplet">{Text[lang].controls.right}</div>
                </div>
                <div className="controlsBox key">
                    <div className="imageHolder">
                        <img src={aKey} className="imgTriplet" alt="aKey" />
                    </div>
                    <div className="imageHolder">
                        <img src={sKey} className="imgTriplet" alt="sKey" /> 
                    </div>
                    <div className="imageHolder">
                        <img src={dKey} className="imgTriplet" alt="dKey" />
                    </div>

   

                </div>
                <div className="controlsBox or">
                    <div className="keyText or">{Text[lang].controls.or}</div>
                </div>
                <div className="controlsBox key">
                    <div className="imageHolder">
                        <img src={arrowLeft} className="imgTriplet" alt="arrowLeft" />
                    </div>
                    <div className="imageHolder">
                        <img src={arrowDown} className="imgTriplet" alt="arrowDown" />
                    </div>
                    <div className="imageHolder">
                        <img src={arrowRight} className="imgTriplet" alt="arrowRight" />
                    </div>
                </div>
                <div className="controlsBox spaceText">
                    <div className="keyText space">{Text[lang].controls.drop}</div>
                </div>
                <div className="controlsBox space">
                    <img src={spaceBar} className="spaceBar" alt="spaceBar" />
                </div>
            </div>


            <div className="controlsContainer right">
                <div className="controlsBox text">
                    <div className="keyText title">
                        {Text[lang].controls.song}
                    </div>
                </div>
                <div className="controlsBox text">
                    <div className="keyText songLeft">{Text[lang].controls.prev}</div>
                    <div className="keyText songRight">{Text[lang].controls.next}</div>
                </div>
                <div className="controlsBox key">
                    <img src={oKey} className="imgLeft" alt="oKey" />
                    <img src={pKey} className="imgRight" alt="pKey" />
                </div>
            </div>
        </div>
        )
}

const unMute = (mute, setMute) => {
    if (mute) {
        setMute(false);
    }return;
}
export { SettingsButton, SettingsPanel, AboutScreen, CreditsScreen };