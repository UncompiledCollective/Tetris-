import * as React from "react";
import "./Menu.css";
const SettingsButton = ({ isUp, setUp }) => {
    const [Status, setStatus] = React.useState("settingsPanel hidden")
    const handleClick = () => {
        if (!isUp) {
            setUp(true)
            setStatus("settingsPanel")
        } else {
            setUp(false)
            setStatus("settingsPanel hidden")
        }
    }
    
    return (
        <div className="settingsButton" onClick={handleClick}>
            <SettingsPanel prop_status={Status}/>
        </div>
        )
}
const SettingsPanel = ({ prop_status }) => {
    return (
        <div className={prop_status}>
        </div>
        )
}
export {SettingsButton }