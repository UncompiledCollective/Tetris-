import * as React from "react";
const Timer = ({ gameOn, setSendMovement, currentLevel, sendMovement }) => {
    console.log("Timer renders")
    const [timeRightNow, setTimeRightNow] = React.useState(0);
    const firstRender = React.useRef(false);
    const [Gravity, setGravity] = React.useState(800);
    const updateTime = () => {
        setTimeRightNow((x) => x + 10);
    }
    const updateGravity = (x, level) => {
        if (level === 0) {
            return 800;
        }
        let temp;
        switch (true) {
            case (level > 14):
                temp = 3;
                break;
            case (level > 8):
                temp = 3;
                break
            case (level > 2):
                temp = 2;
        }
        let temp2 = Math.round((0.8 - ((level) * 0.007)) ** (level) * 100) * 10;
        console.log(temp2, "logging new gravity")
        return temp2;
    }
    React.useEffect(() => { //increases gravity
        console.log("side effect inside timer runs")
        if (firstRender.current) {
            return;
        }
        setGravity((x) => {
            let newGrav = updateGravity(x, currentLevel);
            return x = newGrav;
        })
        setTimeRightNow(0);
        return;
    }, [currentLevel])
    React.useEffect(() => { // moves the piece down.
        if (firstRender.current) {
            firstRender.current = !firstRender.current;
            return;
        }
        if (!gameOn || gameOn === "pause" || gameOn === "removing" || sendMovement) {
            return;
        }
        if (gameOn === "over") {
            setGravity(800);
            setTimeRightNow(0);
            console.log(Gravity, timeRightNow, "logging aat Timer at gameOver")
            return;
        }
        if (gameOn === true) {
            if (timeRightNow === Gravity) {
                setSendMovement(true);
                setTimeRightNow(0);
            }
            else {
                const delay = setTimeout(updateTime, 10);
            }
        }
        if (timeRightNow > Gravity) {
            console.log("Time exceeded Gravity.")
            console.log(Gravity, "logging Gravity")
            console.log(timeRightNow, "logging timeRightNow")
            return;
        }
    }, [timeRightNow, gameOn, currentLevel, sendMovement])
    return (
        <div>
        </div>
        )
}
export { Timer };