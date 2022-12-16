import * as React from "react";
import "./Menu.scss";
import { ReactComponent as SettingsScrew } from "./Menu SVGs/settings_screw.svg";
import { ReactComponent as SettingsCross } from "./Menu SVGs/cross4.svg"; 
import { ReactComponent as EyeOpen } from "./Menu SVGs/eye_open2.svg"
import { ReactComponent as EyeClosed } from "./Menu SVGs/eye_closed2.svg"
import { ReactComponent as Hint1 } from "./Menu SVGs/hint1.svg";
import polishFlag from "./Menu PNGs/polish_flag2.png";
import englishFlag from "./Menu PNGs/english_flag2.png";
import aKey from "./Menu PNGs/A_key_done.png";
import dKey from "./Menu PNGs/D_key_done.png";
import sKey from "./Menu PNGs/S_key_done.png";
import qKey from "./Menu PNGs/Q_key_done.png";
import eKey from "./Menu PNGs/E_key_done.png";
import zKey from "./Menu PNGs/Z_key_done.png";
import cKey from "./Menu PNGs/C_key_done.png";
import arrowLeft from "./Menu PNGs/arrow_left_done.png";
import arrowRight from "./Menu PNGs/arrow_right_done.png";
import arrowDown from "./Menu PNGs/arrow_down_done.png";
import spaceBar from "./Menu PNGs/space_bar_done.png";
import escKey from "./Menu PNGs/Esc_key_done.png";
import pKey from "./Menu PNGs/P_key_done.png";
import oKey from "./Menu PNGs/O_key_done.png";
import title_black from "./Menu PNGs/Title black.png";
import gitHub from "./Menu PNGs/gitHub.png";
const SettingsButton = ({ setUp, isUp, gameOn, setGameOn, launguage, setLaunguage,
    ghost, setGhost, Text, mVol, setMVol, sfxVol, setSfxVol, mute, setMute,
    setMemory, about, setAbout }) => {
    const handleClick = () => { //simply opens and closes the menu. Pauses the game if a game is currently going on.
        if (isUp) {
            return;
        }
        setUp(true);
        if (gameOn === true) {
            setGameOn("pause");
        }
        return;
    }
    
    return (
        <div className="settingsButton" onClick={handleClick}>
            <SettingsScrew className="settingsScrew" fill="#FFFFFF" width="9%"/>
            <SettingsPanel isUp={isUp} setUp={setUp} lang={launguage} setLang={setLaunguage} ghost={ghost} setGhost={setGhost}
                Text={Text} mVol={mVol} setMVol={setMVol} sfxVol={sfxVol} setSfxVol={setSfxVol}
                mute={mute} setMute={setMute} setMemory={setMemory} about={about} setAbout={setAbout}/>
        </div>
        )
}
const SettingsPanel = ({ isUp, setUp, lang, setLang, ghost, setGhost, Text, mVol,
    setMVol, sfxVol, setSfxVol, mute, setMute, setMemory, about, setAbout }) => {
    const [settingsUp, setSettingsUp] = React.useState("general");
    const closeSettings = () => {
        if (isUp) {
            setUp(false);
            return;
        } return;
    }

    const handleClick2 = () => {
        setUp(false);
        return;
    }
    useCloseWindow("Escape", closeSettings, isUp, about);
    return (
        <div className={`${isUp ? "settingsPanel" : "settingsPanel hidden"}`}>
            <div className="contents">
            <div className="settingsTabs">
                    <SettingsTab tab="general" setSettingsUp={setSettingsUp} Text={Text} lang={lang }/>
                    <SettingsTab tab="sound" setSettingsUp={setSettingsUp} Text={Text} lang={lang} />
                    <SettingsTab tab="controls" setSettingsUp={setSettingsUp} Text={Text} lang={lang} />
                    <SettingsCross className="settingsCross" id="cross" onClick={handleClick2}/>
                </div>
                <GeneralScreen tab="general" settingsUp={settingsUp} lang={lang} setLang={setLang} ghost={ghost}
                    setGhost={setGhost} Text={Text} about={about} setAbout={setAbout} setMemory={setMemory } />
                <SoundScreen tab="sound" settingsUp={settingsUp} Text={Text} lang={lang} mVol={mVol}
                    setMVol={setMVol} sfxVol={sfxVol} setSfxVol={setSfxVol} mute={mute} setMute={setMute} setMemory={setMemory }/>
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
        <div className={"tab " + tab + " unselectable"} onClick={handleClick }>
            <span>{Text[lang][tab][tab]}</span>
        </div>
        )
}

const GeneralScreen = ({ settingsUp, tab, lang, setLang, ghost, setGhost, Text, about, setAbout, setMemory }) => {
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
            setAbout(true)
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
                                paddingTop: "4%"
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
                <div className="aboutContainer">
                    <div className="aboutBox unselectable" onClick={handleClick4 }>
                        <span>About</span>
                    </div>
                </div>
            </div>
            <div className="generalBox"></div>

        </div>
        )
}
const AboutScreen = ({ about, setAbout, lang, setLang, Text, setMemory }) => {
    const closeCallback = () => {
        if (about) {
            setAbout(false);
            setMemory("funk_tetris-welcome", false)
        } return;
    }
    const handleClick = () => {
        if (about) {
            setAbout(false);
            setMemory("funk_tetris-welcome", false)
        } return;
    }
    const handlePl = () => {
        if (lang === "eng") {
            setLang("pl");
            setMemory("funk_tetris-lang", "pl")
            return;
        } return;
    }
    const handleEng = () => {
        if (lang === "pl") {
            setLang("eng");
            setMemory("funk_tetris-lang", "eng")
            return;
        } return;
    }
    useCloseWindow("Escape", closeCallback, about, false)
    return (
        <div className={`${(about) ? "aboutScreenContainer" : "aboutScreenContainer hidden"}`}>
            <div className="aboutScreenProper">
            <SettingsCross className="settingsCrossAbout" id="cross" onClick={handleClick} />
            <div className="aboutContent welcome">
                    <span>{Text[lang].about.greeting}</span>
                </div>
                <div className="aboutContent text center">
                    <span>{Text[lang].about.welcome}</span>
                </div>
                <div className="aboutContent logo">
                                <img src={title_black } className="titleBlack"/>
                </div>
                <div className="aboutContent text">
                    <span>{Text[lang].about.span1}</span>
                    <span>{Text[lang].about.span2}<span className="linkSpan" id="linkSpan">
                        {Text[lang].about.span3}
                        <div className="toGitDiv" id="toGitDiv" style={(lang === "pl" ? {left:"-0.5rem"} : {}) }>
                            <img src={gitHub} />
                            <a href="https://github.com/UncompiledCollective">the UncompilledCollective</a>
                        </div>
                    </span>{Text[lang].about.span4}</span>
                    <span>{Text[lang].about.span5}</span>
                </div>
                <div className="aboutContent text centered">
                    <span>{Text[lang].about.span6}</span>
                </div>
                <div className="aboutContent enjoy">
                    <span>{Text[lang].about.enjoy}</span>
                </div>
                <div className="launguageMiniHolder">
                    <div className="launguageMiniHolderDiv eng" id="miniL">
                        <span className="spanClass" id="spanL" onClick={handleEng}>{Text[lang].about.eng} </span>
                    </div>
                    <div className="launguageMiniHolderDiv slash">
                        <span>/</span>
                    </div>
                    <div className="launguageMiniHolderDiv pl" id="miniL">
                        <span className="spanClass pl" id="spanL"onClick={handlePl} >{Text[lang].about.pl}</span>
                    </div>
                </div>
            </div>
            </div>
        )
}
const SoundScreen = ({ settingsUp, tab, Text, lang, mVol, setMVol, sfxVol, setSfxVol, mute, setMute, setMemory }) => {
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
            <div className="soundScreenContainer">
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
const ControlsScreen = ({ settingsUp, tab, Text, lang }) => {
    return (
        <div className={`${(settingsUp === tab) ? "settingsScreen controls" : "hidden"}`}>
            <div className="controlsContainer left">
                <div className="controlsBox big">
                    <img src={escKey} className="escKey"alt="escKey" />
                    <div className="escKeyText">{Text[lang].controls.esc }
                    </div>
                </div>
                <div className="controlsBox filler"/>
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
                <div className="controlsBox filler" />
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

const useCloseWindow = (key, callback, status, secondStatus) => {
    React.useEffect(() => {
        if (!status) {
            return;
        }
        if (secondStatus) {
            return;
        }
        const handleKey = (event) => {
            if (event.key === key) {
                callback();
                return;
            } return;
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    },[status, secondStatus])
}
const unMute = (mute, setMute) => {
    if (mute) {
        setMute(false);
    }return;
}
export { SettingsButton, SettingsPanel, AboutScreen };