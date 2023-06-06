import * as React from "react";
import axios from "axios";
import { adress } from "./axios";
function genArray(number) {
    let temp = []
    for (let y = 0; y < number; y++) {
        temp.push(y);
    }
    return temp;
}
const useCloseWindow = (key, callback, status, secondStatus = false, thirdStatus = false) => {
    React.useEffect(() => {
        if (!status) {
            return;
        }
        if (secondStatus) {
            return;
        }
        if (thirdStatus) {
            return;
        }
        const handleKey = (event) => {
            if (event.key === key) {
                callback();
                return;
            } return;
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [status, secondStatus, thirdStatus])
}
const useKeepRotating = (state, setState, setRotate, angle, setAngle, delay = 750, setIsTransition) => {
    React.useEffect(() => {
        if (!state) {
            return;
        }
        if (state === "second") {
            let timer = setTimeout(function () {
                setAngle((x) => {
                    x += 10;
                    setRotate("rotate(" + x + "deg)");
                    return x;
                });
            }, delay)
            return () => clearTimeout(timer);
        }
        if (state === "third") {
            if (angle >= 360) {
                setAngle((x) => {
                    while (x >= 360) {
                        x -= 360;
                    }
                    setRotate("rotate(" + x + "deg)");
                    return x;
                });
                setIsTransition(false);
                return;
            }
            setState(false);
            return;
        }
        setAngle((x) => {
            x += 10;
            setRotate("rotate(" + x + "deg)");
            return x;
        });
        setState("second")
        setIsTransition(true);
        return;
    },)
}
const useLoadingSubtitle = (loading, setLoading, Text, string, setString, delay=1000) => {
    React.useEffect(() => {
        if (!loading) {
            return;
        }
        if (string === "") {
            let timer = setTimeout(function () {
                setString(Text[0]);
            }, delay);
            return () => clearTimeout(timer);
        }
        let re = new RegExp(Text);
        if (re.test(string)) {
            let timer = setTimeout(function () {
                setString(Text);
                setLoading(false);
            }, delay);
            return () => clearTimeout(timer);
        }
        let timer = setTimeout(function () {
            setString((x) => {
                return Text.slice(0, x.match(/[\p{L}\p{N}_]+/u)[0].length + 1); //turns out regx on unicode characters is a pain...
            });
        }, delay);
        return () => clearTimeout(timer);
    },[loading, string])
}
const useUpDots = (dots, setDots, loading, delay=1000, dotRe, setDotRe) => {
    React.useEffect(() => {
        if (dots === false) {
            return;
        }
        if (!loading && dotRe) {
            if (dots === 0) {
                setDots(false);
                setDotRe(false);
            }
            let timer = setTimeout(function () {
                setDots((x) => x - 1);
            }, delay)
            return () => clearTimeout(timer);
        }
        if (!loading) {
            if (dots === 3) {
                setDotRe(true)
                return;
            }
            let timer = setTimeout(function () {
                setDots((x) => x + 1);
            }, delay)
            return () => clearTimeout(timer);
        }
        let timer = setTimeout(function () {
            if (dots === 3) {
                setDots(0)
            } else {
                setDots((x) => x + 1);
            }
        }, delay)
        return () => clearTimeout(timer);
    },[dots, dotRe])
}
function switchArray(index, arrayLength, direction = false) {
    if (direction === "left") {
        if (index === 0) {
            return arrayLength - 1;
        }
        return index - 1;
    }
    else {
        if (index === arrayLength - 1) {
            return 0;
        }
        return index + 1;
    }
}
function arrowClick(direction, ref,tab, setTab, setDirection) {
    let temp = ref.current.indexOf(tab)
    setDirection(direction);
    setTab(ref.current[switchArray(temp, ref.current.length, direction)]);
    return;

}
function refreshCreditsTab(setString, setDots, setDotRe, setLoading, setPreventReload) {
    setPreventReload(true);
    setString("");
    setDots(3);
    setDotRe(false);
    setLoading(true);
    return;
}
function transitionArrayGenerator(direction, array, index) {
    let arr = [0, 0, 0];
    if (direction === "left") {
        if (index === 0) {
            return [1,0,2]
        }
        arr[index - 1] = 2;
        arr[index] = 1;
        return arr;
    } else {
        if (index === array.length - 1) {
            return [2, 0, 1];
        }
        arr[index + 1] = 2;
        arr[index] = 1;
        return arr;
    }
}
function transitionArraySetter(direction, tabRef,transitionArray, setTransitionArray, creditsTab) {
    let temp = tabRef.current.indexOf(creditsTab);
    setTransitionArray(transitionArrayGenerator(direction, transitionArray, temp));
    return;
}

//direction in useCreditsSubtitle is redundant. I'm switching to a more react solution.
//stolen scrolling code:
function scrollToElm(container, elm, duration) {
    var pos = getRelativePos(elm);
    scrollTo(container, pos.top, 2);  // duration in seconds
}

function getRelativePos(elm) {
    var pPos = elm.parentNode.getBoundingClientRect(), // parent pos
        cPos = elm.getBoundingClientRect(), // target pos
        pos = {};

    pos.top = cPos.top - pPos.top + elm.parentNode.scrollTop;
    pos.right = cPos.right - pPos.right;
    pos.bottom = cPos.bottom - pPos.bottom;
    pos.left = cPos.left - pPos.left;

    return pos;
}

function easeInOutQuad(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t };
function scrollTo(element, to, duration, onDone) {
    var start = element.scrollTop,
        change = to - start,
        startTime = performance.now(),
        val, now, elapsed, t;

    function animateScroll() {
        now = performance.now();
        elapsed = (now - startTime) / 1000;
        t = (elapsed / duration);

        element.scrollTop = start + change * easeInOutQuad(t);

        if (t < 1)
            window.requestAnimationFrame(animateScroll);
        else
            onDone && onDone();
    };

    animateScroll();
}
function captureCordsSetText(e, text, cords, setter, status, target) {
    let { left, top } = document.getElementById(target).getBoundingClientRect();
    let scrollOffset = document.getElementById(target).scrollTop;
    cords.current[0] = e.clientX - Math.round(left);
    cords.current[1] = e.clientY - Math.round(top) + scrollOffset;
    navigator.clipboard.writeText(text);
    setter(0);
    return;
}
const useScrollCreditsMusic = (state) => {
    React.useEffect(() => {
        if (state === 0) {
            const element = document.getElementById("credits music title");
            element.scrollIntoView({ behavior: 'smooth' });
            return;
        };
    }, [state])
}
const useClosePopUpGeneric = (status, setStatus, delay) => {
    React.useEffect(() => {
        if (status === 0) {
            setStatus(true);
        }
        if (status) {
            let timer = setTimeout(function () {
                setStatus(false);
            }, delay);
            return () => clearTimeout(timer);
        }
    },[status])
}

//x - number of think clouds
const useClosePopUpMouseOut = (state, setState, delay) => {
    React.useEffect(() => {
    if (state === false) { return; };
    if (state === 0) {
        setState(true);
    }
    if (state === "close") {
        let timer = setTimeout(function () {
            if (state === "close") {
                setState(false);    
            }
        }, delay)
        return () => clearTimeout(timer);
    }
    },[state])
}
function generateCloudOffset(element, rems, number, separation, steps, offsetTop = 0, offsetLeft = 0) {
    let [width, height] = [element.current?.clientWidth, element.current?.clientHeight];
    let body = document.body;
    var fontSize = window.getComputedStyle(body).getPropertyValue('font-size');
    let centerX = Math.round(width / fontSize.match(/[0-9]+.[0-9]+/)[0]); //centerX in rem units;
    let centerY = Math.round(height / fontSize.match(/[0-9]+.[0-9]+/)[0])
    let arr = [];
    if (number % 2 === 1) {
        let middle = Math.floor(number / 2)+1; 
        for (let x = 1; x <= number; x++) {
            if (x < middle) {
                arr.push([-(rems * (middle - x)) + centerX + offsetLeft - separation + "rem"]);
                arr[x-1].push((centerY - steps*(middle-x)) + offsetTop + "rem")
            };
            if (x === middle) {
                arr.push([centerX + offsetLeft + "rem"]);
                arr[x - 1].push((centerY + steps) + offsetTop + "rem")
            };
            if (x > middle) {
                arr.push([-(rems * (middle - x)) + centerX + offsetLeft + separation + "rem"]);
                arr[x - 1].push((centerY - steps * Math.abs(middle - x)) + offsetTop + "rem")
            };
        }
        return arr;
    }
    if (number % 2 === 0) {
        let side = number / 2;
        for (let x = 1; x <= number; x++) {
            if (x <= side) {
                arr.push([-(rems * (side - x + 1)) / 2 + centerX + offsetLeft - separation / 2 + "rem"]);
                arr[x - 1].push(centerY - steps * (side - x) + offsetTop + "rem");
            };
            if (x > side) {
                arr.push([-(rems * (side - x)) / 2 + centerX + offsetLeft + separation + "rem"]);
                arr[x - 1].push(centerY - steps * (side - x + 1) + offsetTop + "rem");
            };
        }
        return arr;
    }
}
function generateSpin(number) {
    let arr = [];
    if (number % 2 === 0) {
        let side = number / 2;
        for (let x = 0; x < number; x++) {
            if (x < side) {
                arr.push(0);
            } else {
                arr.push(1);
            }
        }
    }
    else {
        for (let x = 0; x < number; x++) {
        if (x % 2 === 1) {
            arr.push(0);
        } else {
            arr.push(1);
        }
        }
    }
    return arr;
}

const useCloseState = (state, setState, listen, target, delay) => {
    React.useEffect(() => {
        if (state !== listen) { return; };
        let timer = setTimeout(function () {
            setState(target);
        }, delay)
        return () => clearTimeout(timer);
    }, [state])
}
function generateDelayArray(interval, numberOfElements) {
    let arr = [];
    for (let x = 0; x < numberOfElements; x++) {
        arr.push(x * interval);
    }
    return arr;
}
const useFadeSpansWelcome = (state, setState, setLang, delay=[500, 500, 500]) => {
    React.useEffect(() => {
        if (state === false) { return; };
        if (state === true) {
            let timer = setTimeout(function () {
                setState("fade-out")
            }, delay[0])
            return () => clearTimeout(timer);
        }
        if (state === "fade-out") {
            let timer = setTimeout(function () {
                setLang((x) => {
                    if (x === "eng") {
                        return "pl"
                    }
                    else {
                        return "eng"
                    }
                })
                setState("fade-in");
            }, delay[1])
            return () => clearTimeout(timer);
        }
        if (state === "fade-in") {
            let timer = setTimeout(function () {
                setState(false)
            }, delay[2])
            return () => clearTimeout(timer);
        }
    },[state])
}
function genBlobs(buffArr) {
    let arr = [];
    for (let x = 0; x < buffArr.length; x++) {
        let blob = new Blob([new Uint8Array(buffArr[x].audio.data)]);
        let url = URL.createObjectURL(blob);
        arr.push({
            title: buffArr[x].title,
            audio: url
        });
    }
    return arr;
}
const useGetMoreSongs = (state, setState, songs, setSongs, delay=1000,popupDelay=2000, setLoading, setSongState) => {
    React.useEffect(() => {
        if (state === false) { return; }
        if (state === true) {
            setLoading(true);
            console.log("condition met")
            axios.post(adress + "/get-songs-after", {
                value: songs.length - 8
            } ).then(function (result) {
                if (result.data) {
                    console.log(result.data);
                    console.log("it's not zero");
                    let urls = genBlobs(result.data);
                    //let buff = result.data[0].audio.data;
                    //const blob = new Blob([new Uint8Array(buff)]);
                    //const url = URL.createObjectURL(blob);
                    
                    setSongs((x) => {
                        x = x.concat(urls);
                        return x
                    })
                    setState("third");
                    setSongState(true);
                } else {
                    console.log("it's zero")
                    console.log(result.data)
                    setState("third");
                }
                setLoading("close")
            }).catch(function (error) {
                setState("fourth")
                console.log(error);
            })
        }
        if (state === "third") {
            let timer = setTimeout(function () {
                setState(false);
                setLoading(false);
            }, delay)
            return () => clearTimeout(timer);
        }
        if (state === "fourth") {
            let timer = setTimeout(function () {
                setState(false);
                setLoading(false);
            }, popupDelay)
            return () => clearTimeout(timer);
        }
    }, [state])
}
export {
    useCloseWindow, useKeepRotating, genArray, useLoadingSubtitle, useUpDots, arrowClick,
    refreshCreditsTab, transitionArraySetter, scrollToElm, captureCordsSetText, useScrollCreditsMusic,
    useClosePopUpGeneric, 
    useClosePopUpMouseOut, generateCloudOffset, generateSpin, useCloseState,
    generateDelayArray, useFadeSpansWelcome, useGetMoreSongs
}