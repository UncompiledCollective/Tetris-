import * as React from "react";
import { ReactComponent as SpeakerUp } from "./Menu SVGs/speaker_up3.svg";
import { ReactComponent as SpeakerDown } from "./Menu SVGs/speaker_down3.svg";
const MuteButton = ({setMute, isMute }) => {
    const handleClick = () => {
        setMute(!isMute)
    }
    return (
        <div className="muteButtonHolder">
            {isMute ? (<SpeakerDown className="muteButton Up" type="button" onClick={handleClick} />) :
                (< SpeakerUp className="muteButton Up" type="button" onClick={handleClick} />)}
        </div>
        )
}
export { MuteButton };