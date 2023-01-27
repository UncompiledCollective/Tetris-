import * as React from "react";
const useDisplayNewLeader = (firstRender, newLocal, newGlobal, setLocal, setGlobal, isChanged, setIsChanged) => {
    React.useEffect(() => {
        if (firstRender.current) {
            return;
        }
        console.log(newLocal, "here new local")
        if (newLocal[0] === true) {
            console.log("inside this dumb fucking shti")
            let delay = setTimeout(function () {
                setLocal((x) => {
                    x[0] = "pop"
                    return x;
                })
                setIsChanged(true)
            },3000)
        }
        if (newLocal[0] === "pop") {
            console.log("insided this dumb shit")
            let delay = setTimeout(function () {
                setLocal((x) => {
                    x[0] = false
                    return x;
                })
                setIsChanged(false)
            }, 1000)
        }
        if (newGlobal[0] === true) {
            let delay = setTimeout(function () {
                setGlobal((x) => {
                    x[0] = "pop";
                    return x;
                });
                setIsChanged(true)
            },3000)
        }
        if (newGlobal[0] === "pop") {
            let delay = setTimeout(function () {
                setGlobal((x) => {
                    x[0] = false;
                    return x;
                });
                setIsChanged(false)
            }, 1000)
        }

    },[newLocal, newGlobal, isChanged])
}
export { useDisplayNewLeader };