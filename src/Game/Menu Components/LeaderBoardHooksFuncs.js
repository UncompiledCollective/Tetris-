import * as React from "react";
function findIndexCallback(x) {
    for (let y in x) {
        if (x[y] !== this[y]) {
            return false;
        }
    } return true;
}
const sortOfObj = (baseArr, obj, numberOfSlots) => { // used to add to scoreBoard
    baseArr.push(obj);
    baseArr.sort((x, y) => {
        return y.Score - x.Score;
    });
    if (baseArr.length > numberOfSlots) {
        let temp = baseArr.pop();
        if (temp === obj) {
            return false
        }
    }
    return true;
}

const movePage = (direction, pageUp, currentPageLocal, currentPageGlobal, setCurrentPageLocal, setCurrentPageGlobal) => {
    let temp = direction === "left" ? (-1) : (+1);
    if (pageUp === "local") {
        if (currentPageLocal === 0) {
            setCurrentPageLocal(1);
            return;
        }
        setCurrentPageLocal(0);
        return;
    }
    if (pageUp === "global") {
        let numOfPages = 4
        if (direction === "left") {
            if (currentPageGlobal === 0) {
                setCurrentPageGlobal(3);
                return;
            }
            setCurrentPageGlobal((x) => x + temp);
            return;
        } else {
            if (currentPageGlobal === 3) {
                setCurrentPageGlobal(0);
                return;
            }
            setCurrentPageGlobal((x) => x + temp);
            return;
        }
    }
}
const useCloseOpenWindow = (key, status, callback, func) => {
    React.useEffect(() => {
        if (!status) {
            return;
        }
        const handleKey = (event) => {
            if (event.key === key) {
                callback(func)
                return;
            }
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [status])
}

const setterCallback = (x, pageUp, setPageUp) => {
    if (pageUp !== x) {
        setPageUp(x);
    } return;
}
const leaderCallBack = (setLeader) => {
    setLeader(false);
    return;
}

const useUpdateLocalScore = (passedScoreObj, setMemory, getMemory, sortOfObj, newScore, setLocalHeldScore, setNewScore,
      setNoteNew, setHoldScore) => {
    React.useEffect(() => {
        if (getMemory("localScore") === null) {
            setMemory("localScore", []);
            return;
        }
        if (newScore === false) {
            return;
        }
        if (passedScoreObj.name) { //chosing name because without it score can not be submitted. Score = 0 would evaluate to false.
            let temp = getMemory("localScore");
            if (sortOfObj(temp, passedScoreObj, 10)) {
                setMemory("localScore", temp)
                setLocalHeldScore(temp);
                let temp2 = temp.findIndex(findIndexCallback, passedScoreObj) + 1;
                let delay = setTimeout(function () {
                    setNewScore([true, temp2]);
                    return;
                }, 2500)
            }
            setNoteNew(false);
            setHoldScore({});
            return;
        }
    }, [newScore]);
}
export { sortOfObj, movePage, useCloseOpenWindow, setterCallback, leaderCallBack, useUpdateLocalScore };