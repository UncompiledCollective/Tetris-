import * as React from "react";
const MuteButton = ({setMute, isMute }) => {
    const handleClick = () => {
        return isMute ? setMute("") : setMute("");
    }
    return (
        <div className="muteButtonHolder">
            <button className="muteButton"type="button" onClick={handleClick}>MuteButton</button>
        </div>
        )
}
export { MuteButton };