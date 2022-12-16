import * as React from "react";
import "./App.scss"
import {GameContainer} from "./Game/gameContainer.js"; // main stuff for the game is here
import { MuteButton } from "./Game/Menu Components/MuteButton.js"; // Button that mutes the game
import { SettingsButton, AboutScreen } from "./Game/Menu Components/Settings.js"; // settings button. Uponclick will reveal a big window.
import { gameText } from "./Game/Text.js";
import title from "./Game/Menu Components/Menu PNGs/title done4.png";
import wallpaper1 from "./Game/Menu Components/backgrounds/wallpaper1.jpg";
import wallpaper2 from "./Game/Menu Components/backgrounds/wallpaper2.jpg";
import wallpaper3 from "./Game/Menu Components/backgrounds/wallpaper3.jpg";
import wallpaper4 from "./Game/Menu Components/backgrounds/wallpaper4.jpg";
import wallpaper5 from "./Game/Menu Components/backgrounds/wallpaper5.jpg";
import wallpaper6 from "./Game/Menu Components/backgrounds/wallpaper6.png";
import wallpaper7 from "./Game/Menu Components/backgrounds/wallpaper7.png";
function App() {
    const [launguage, setLaunguage] = React.useState(retreiveMemory("funk_tetris-lang") || "eng");
    const [gameOn, setGameOn] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
    const [isGhostPiece, setIsGhostPiece] = React.useState(true);
    const [sfxVolume, setSfxVolume] = React.useState(retreiveMemory("funk_tetris_sfx-volume") || 50);
    const [musicVolume, setMusicVolume] = React.useState(retreiveMemory("funk_tetris_music-volume") || 50);
    const [aboutOpen, setAboutOpen] = React.useState((retreiveMemory("funk_tetris-welcome") !== null) ? retreiveMemory("funk_tetris-welcome") : true);
    React.useEffect(() => {
        document.getElementById("firstDiv").dispatchEvent(evt)
    },[])
    return (    
        <>
            <div id="firstDiv" className="FirstDiv clearfix" /*{...(mouseOver ? { onMouseOver: () => defeatGoogle() } : {})}*/>
                <img src={wallpaper7} className="background" />
                <img src={title} className="title" />
                <AboutScreen about={aboutOpen} setAbout={setAboutOpen} lang={launguage} setLang={setLaunguage} Text={gameText} setMemory={setMemory }/>
                <div className="box left">
                    <MuteButton isMute={isMuted} setMute={setIsMuted} />
                    <SettingsButton setUp={setIsSettingsOpen} isUp={isSettingsOpen} setGameOn={setGameOn} gameOn={gameOn}
                        launguage={launguage} setLaunguage={setLaunguage} ghost={isGhostPiece} setGhost={setIsGhostPiece}
                        Text={gameText} mVol={musicVolume} setMVol={setMusicVolume} sfxVol={sfxVolume}
                        setSfxVol={setSfxVolume} mute={isMuted} setMute={setIsMuted} setMemory={setMemory}
                        about={aboutOpen} setAbout={setAboutOpen } />
                </div>
                <GameContainer gameOn={gameOn} setGameOn={setGameOn} isSettingsOpen={isSettingsOpen} ghost={isGhostPiece}
                    mVol={musicVolume} isMute={isMuted} Text={gameText} lang={launguage }/>
            </div>
      </>
  );
}
const retreiveMemory = (name) => {
    let temp = JSON.parse(localStorage.getItem(name));
    return temp;
}
const retreiveBoolean = (name) => {
    let temp = localStorage.getItem(name);
    console.log(temp, "logging temp at retreive boolean")
    if (temp === "true") {
        return true;
    }
    if (temp === "false") {
        return false;
    }

}

const setMemory = (name, value) => {
    localStorage.setItem(name, JSON.stringify(value))
    return;
}
var evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: 5,
    clientY:5,
    /* whatever properties you want to give it */
});
export default App;
