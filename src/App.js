import * as React from "react";
import "./App.css"
import {GameContainer} from "./Game/gameContainer.js"; // main stuff for the game is here
import { MuteButton } from "./Game/Menu Components/MuteButton.js"; // Button that mutes the game
import { SettingsButton } from "./Game/Menu Components/Settings.js"; // settings button. Uponclick will reveal a big window.
function App() {
    const [gameOn, setGameOn] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
    console.log("App renders");
    return (    
                      <>
            <div className="FirstDiv clearfix">
                <div className="box left">
                    <MuteButton isMute={isMuted} setMute={setIsMuted} />
                    <SettingsButton isUp={isSettingsOpen} setUp={setIsSettingsOpen}  />
                </div>
                <GameContainer gameOn={gameOn} setGameOn={setGameOn} />
            </div>
      </>
  );
}

export default App;
