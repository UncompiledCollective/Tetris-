import * as React from "react";
import { useUpdateGravity, useUpdateTimer } from "./GameHooksFuncs.js";
const Timer = ({ gameOn, setSendMovement, currentLevel, sendMovement }) => {
    console.log("Timer renders")
    const [timeRightNow, setTimeRightNow] = React.useState(0);
    const firstRender = React.useRef(false);
    const [Gravity, setGravity] = React.useState(800);
    useUpdateGravity(firstRender, setGravity, currentLevel, setTimeRightNow);
    useUpdateTimer(firstRender, gameOn, sendMovement, Gravity, setGravity, timeRightNow, setTimeRightNow, setSendMovement, currentLevel);
    return (
        <div>
        </div>
        )
}
export { Timer };