import * as React from "react";
import "./App.scss";
import "./fonts.css";
import {GameContainer} from "./Game/gameContainer.js"; // main stuff for the game is here
import { MuteButton } from "./Game/Menu Components/MuteButton.js"; // Button that mutes the game
import { SettingsButton, AboutScreen, SettingsPanel, CreditsScreen } from "./Game/Menu Components/Settings.js"; // settings button. Uponclick will reveal a big window.
import { gameText } from "./Game/Text.js";
import { useHoldSongs } from "./Game/Music/music.js";
import { songs } from "./Game/Music/songsObj.js";
import title from "./Game/Menu Components/Menu PNGs/title done4.png";
import wallpaper7 from "./Game/Menu Components/backgrounds/wallpaper7.png";
import logo_high_res from "./loader/logo_high.png";
import {
    retreiveMemory, setMemory,
    useHideLoader, useStartPlayingTrick, ApiTest
} from "./appHooks.js";
const loader = document.getElementById("loader"); 
function App() {

    const [launguage, setLaunguage] = React.useState(retreiveMemory("funk_tetris-lang") || "eng");
    const [gameOn, setGameOn] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
    const [isGhostPiece, setIsGhostPiece] = React.useState(true);
    const [sfxVolume, setSfxVolume] = React.useState(retreiveMemory("funk_tetris_sfx-volume") || 50);
    const [musicVolume, setMusicVolume] = React.useState(retreiveMemory("funk_tetris_music-volume") !== null ? retreiveMemory("funk_tetris_music-volume") : 50);
    const [aboutOpen, setAboutOpen] = React.useState((retreiveMemory("funk_tetris-welcome") !== null) ? retreiveMemory("funk_tetris-welcome") : true);
    const [isCredits, setIsCredits] = React.useState(false);
    const [oneTimeHussle, setOneTimeHussle] = React.useState(false);
    const [songState, setSongState] = React.useState(false);
    const [songApiBusy, setSongApiBusy] = React.useState(false);
    const [songList, setSongsList] = useHoldSongs(songs, setOneTimeHussle, setSongState, setSongApiBusy);
    useStartPlayingTrick(oneTimeHussle, setOneTimeHussle);
    useHideLoader(loader);
    return (    
        <>
            <div id="firstDiv" className="FirstDiv clearfix"{...(oneTimeHussle ? {
                onClick: () => {
                    return;
                    setOneTimeHussle(false)
                }
            } : {})} >
                <img src={wallpaper7} className="tetris background" />
                <img src={title} className="tetris title" />
                <SettingsPanel isUp={isSettingsOpen} setUp={setIsSettingsOpen} lang={launguage} setLang={setLaunguage} ghost={isGhostPiece}
                    setGhost={setIsGhostPiece} Text={gameText} mVol={musicVolume} setMVol={setMusicVolume} sfxVol={sfxVolume} setSfxVol={setSfxVolume}
                    mute={isMuted} setMute={setIsMuted} setMemory={setMemory} about={aboutOpen} setAbout={setAboutOpen}
                    isCredits={isCredits} setIsCredits={setIsCredits} songsList={songList}
                    setSongsList={setSongsList}
                    setSongState={setSongState} apiBusy={songApiBusy }
                />
                <AboutScreen about={aboutOpen} setAbout={setAboutOpen} lang={launguage} setLang={setLaunguage} Text={gameText} setMemory={setMemory}
                    logo={logo_high_res}
                />
                <CreditsScreen credits={isCredits} setCredits={setIsCredits} Text={gameText} lang={launguage}
                    songList={songList} oneTime={oneTimeHussle}
                />
                <div className="box left">
                    <MuteButton isMute={isMuted} setMute={setIsMuted} />
                    <SettingsButton setUp={setIsSettingsOpen} />
                </div>
                <GameContainer gameOn={gameOn} setGameOn={setGameOn} isSettingsOpen={isSettingsOpen} ghost={isGhostPiece}
                    mVol={musicVolume} isMute={isMuted} Text={gameText} lang={launguage} setMemory={setMemory}
                    getMemory={retreiveMemory} oneTime={oneTimeHussle} songList={songList}
                    songState={songState} setSongState={setSongState} 
                />
            </div>
      </>
  );
}

export default App;
