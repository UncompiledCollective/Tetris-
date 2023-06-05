import * as React from "react";
import axios from "axios";
import { addToObj, objToArray } from "./ScoreHooksFuncs.js";
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
    //ahh can't really reuse this function elsewhere...
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
const useCloseOpenWindow = (key, status, callback, func, thirdCallback) => {
    React.useEffect(() => {
        if (!status) {
            return;
        }
        const handleKey = (event) => {
            if (event.key === key) {
                callback(func);
                thirdCallback(false);
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
function useDebounceEffect(value, delay) {
    const [debounceValue, setDebounceValue] = React.useState(value);
    React.useEffect(() => {
        const timer = setTimeout(function () {
            setDebounceValue(value);
        }, delay)
        return function () {
            clearTimeout(timer);
        }
    }, [value, delay]);
    return debounceValue;
}
async function fetchData(setLoading, setScoresGlobal, setState) {
    setLoading(true);
    await axios.get("/send-scores").then(function (result) {
        setScoresGlobal(result.data);
        setState("second");
    }).catch(function (error) {
        setState("second");
        console.log(error);
    })
}
const useRefereshGlobalScores = (state, globalScores, setScoresGlobal, setLoading, setState) => {
    React.useEffect(() => {
        if (state !== true) { return; }
        if (!globalScores) {
            fetchData(setLoading, setScoresGlobal, setState)
        }
        else {
            const timer = setTimeout(function () {
                fetchData(setLoading, setScoresGlobal, setState);
            }, 500)
            return function () {
                clearTimeout(timer);
            }
        }
    },[state])
}
const useImportAvatars = (state, setLoading, avatarObj, setAvatarObj, setState, debounce=1000, setErrorState) => {
    async function importAvatars() {
        if (Object.keys(avatarObj).length === 0) {
            axios.post("/get-all-avatars", []).then(function (result) {
                setAvatarObj((x) => {
                    return addToObj(x, result.data)
                })
                setLoading(false);
                setState("third");
            }).catch(function (error) {
                console.log(error);
                setLoading(false);
                setState("third");
                setErrorState(0);
            })
        } else {
            let temp = objToArray(avatarObj)
            let timer = setTimeout(function () {
                axios.post("/get-all-avatars", temp).then(function (result) {
                    console.log(result.data, "logging")
                    setAvatarObj((x) => {
                        return addToObj(x, result.data);
                    })
                    setLoading(false);
                    setState("third");
                }).catch(function (error) {
                    console.log(error)
                    setLoading(false);
                    setState("third");
                    setErrorState(0);
                })
            }, 500) //setting timer here was a misstake I suppose... post request is asynchronous anyway
            return () => clearTimeout(timer);
        }

    }
    React.useEffect(() => {
        if (state === "third") {
            let debounceTimer = setTimeout(() => setState(false), debounce); // this is debuncing. Set to 2 seconds because of error popup
            return () => clearTimeout(debounceTimer);
        }
        if (state !== "second") { return; }
        importAvatars();
    },[state])
}
const useClosePopUp = (state, setState, secondState, fadeOut, hide, delay) => {
    React.useEffect(() => {
        if (!secondState) {
            return;
        }
        if (state === fadeOut) {
            let timer = setTimeout(function () {
                setState(hide);
            }, delay);
            return function () {
                clearTimeout(timer);
            }
        }

    }, [state])
}
const useDotCount = (condition, state, setState, maxDots, delay = 200) => {
    React.useEffect(() => {
        if (!condition) {
            return;
        }
        let timer = setTimeout(function () {
            if (state === maxDots) {
                setState(0);
                return;
            }
            setState((x) => x + 1);
        }, delay)
        return () => clearTimeout(timer);
    }, [state])
}
export {
    sortOfObj, movePage, useCloseOpenWindow, setterCallback, leaderCallBack, useUpdateLocalScore,
    useRefereshGlobalScores, useDebounceEffect, useImportAvatars, useClosePopUp, useDotCount
};