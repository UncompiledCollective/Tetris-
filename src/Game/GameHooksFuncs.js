import * as React from "react";

const changeLevel = (rowsTo10, linesCleared, setCurrentLevel) => { // level up occurs after every 10 lines deleted
    rowsTo10.current += linesCleared;
    if (rowsTo10.current >= 10) {
        rowsTo10.current -= 10;
        setCurrentLevel((x) => x + 1);
    }
    return;
}



async function changeState(setState, secondState, setSecondState, delay, value) {
    if (secondState[0] === true) {
        let timer = setTimeout(function () {
            setSecondState((x) => {
                x[0] = "pop";
                return x;
            })
            setState(value[0]);
        }, delay);
        return () => clearTimeout(timer);
    };
    if (secondState[0] === "pop") {
        let timer = setTimeout(function () {
            setSecondState((x) => {
                x[0] = false;
                return x;
            })
            setState(value[1]);
        }, delay - 2000);
        return () => clearTimeout(timer);
    };
}
const useDisplayNewLeader = (firstRender, newLocal, setLocal, newGlobal, setGlobal, isChanged, setIsChanged) => {
    React.useEffect(() => {
        if (firstRender.current) {
            return;
        }
        changeState(setIsChanged, newLocal, setLocal, 3000, [1,2]);
        changeState(setIsChanged, newGlobal, setGlobal, 3000, [3, 4]);
        if (!newLocal[0] && !newGlobal[0] && isChanged !== false) { return setIsChanged(false); } //sometimes for osme reason popups wouldn't disappear for some reason
        //so just in case I'm checking if the states are right and if not setting them to false;
        //state passed is [isChanged, setIsChanged] - used because a change in array values doesn't cause react to rerender. For good or bad.
    },[isChanged])
}

const useUpdateLevel = (firstRender, linesCleared, rowsTo10, setCurrentLevel) => {
    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (!linesCleared) {
            return;
        }
        changeLevel(rowsTo10, linesCleared, setCurrentLevel);
    }, [linesCleared])
    //React.useEffect(() => {
    //    console.log(noteNewScore, "newScore is being logged")
    //}, [noteNewScore])
}
const useGameOver = (firstRender, gameOn, setCurrentLevel, setNextPieceState, rowsTo10, setLinesCleared) => {
    React.useEffect(() => {
        if (firstRender.current) {
            return;
        }
        if (gameOn === false) {
            setCurrentLevel(0);
            setNextPieceState(null);
            rowsTo10.current = 0;
            setLinesCleared(0);
            return;
        }
    }, [gameOn])
}
const useDynamicMemory = (key, defaultName) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) !== null ?
            localStorage.getItem(key) : defaultName
    );
    React.useEffect(() => {
        localStorage.setItem(key, value)
    }, [value, key]);
    return [value, setValue];
}
const handleNameChange = (event, func) => {
    func(event.target.value);
    return;
}

const handleFocus = (event, func) => {
    func((x) => !x);
    return;
}

// timer:
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
const useUpdateGravity = (firstRender, setGravity, currentLevel, setTimeRightNow) => {
    React.useEffect(() => {
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
}

const useUpdateTimer = (firstRender, gameOn, sendMovement, Gravity, setGravity, timeRightNow, setTimeRightNow, setSendMovement, currentLevel) => {
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
                const delay = setTimeout(function () {
                    setTimeRightNow((x) => x + 10)
                }, 10);
            }
        }
        if (timeRightNow > Gravity) {
            console.log("Time exceeded Gravity.")
            console.log(Gravity, "logging Gravity")
            console.log(timeRightNow, "logging timeRightNow")
            throw Error("something went wrong withing the Timer component. please refresh")
            return;
        }
    }, [timeRightNow, gameOn, currentLevel, sendMovement])
}

export {
    useDisplayNewLeader, useUpdateLevel, useDynamicMemory, useGameOver, handleNameChange, handleFocus,
    useUpdateGravity, useUpdateTimer
};