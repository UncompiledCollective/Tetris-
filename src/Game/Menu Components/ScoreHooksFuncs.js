import * as React from "react";
const remakeScoreObj = (obj) => {
    obj.current.Score = 0;
    obj.current.lines_4 = 0;
    obj.current.lines_3 = 0;
    obj.current.lines_2 = 0;
    obj.current.lines_1 = 0;
    obj.current.lines_total = 0;
    obj.current.name = "";
    obj.current.avatar = "";
    return;
}
const calculateScore = (ScoreObj, linesCleared, currentLevel) => {
    switch (linesCleared) {
        case 1:
            ScoreObj.current.lines_1 += 1;
            ScoreObj.current.Score += 40 * (currentLevel + 1);
            break;
        case 2:
            ScoreObj.current.lines_2 += 1;
            ScoreObj.current.Score += 100 * (currentLevel + 1);
            break;
        case 3:
            ScoreObj.current.lines_3 += 1;
            ScoreObj.current.Score += 300 * (currentLevel + 1);
            break;
        case 4:
            ScoreObj.current.lines_4 += 1;
            ScoreObj.current.Score += 1200 * (currentLevel + 1);
            break;
        default:
            break;
    };
    ScoreObj.current.lines_total += linesCleared;
    return;
}

const useUpdateScore = (FirstRenderRef, lines, obj, level, resetLinesCleared, calculateScore) => {
    React.useEffect(() => {
        if (FirstRenderRef.current) {
            return;
        }
        if (!lines) {
            return;
        }
        calculateScore(obj, lines, level);
        resetLinesCleared(null)
        return;
    }, [lines])
}
const useRefreshScore = (firstRender, gameOn, scoreObj, setHoldScore, remakeScoreObj) => {
    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (gameOn === "over") {
            setHoldScore(scoreObj.current) //not sure if setting it right now is necessary.
            return;
        }
        if (gameOn === false) {
            remakeScoreObj(scoreObj);
            return;
        }
    }, [gameOn])
}



const isNameTrue = (string) => {
    if (string.length > 13) {
        return "long";
    }
    if (string.length < 6) {
        return "short";
    }
    if (regTests.spaceBoundry.test(string)) {
        return "spaceBound"
    }
    if (string.match(regTests.manySpace) && string.match(regTests.manySpace).length > 1) {
        return "spaceCount"
    }
    if (string.match(regTests.illicitChar)) {
        return "special"
    }
    if (!regTests.letter.test(string)) {
        return "letter"
    }
    return true;
}
const regTests = {
    spaceBoundry: /^\s|\s$/,
    illicitChar: /[^\w\s$#^*\(\)-:;<>~]/g,
    manySpace: /\s/g,
    letter: /[A-Za-z]/i
}

const useDisplayError = (isCorrect, setIsCorrect) => {
    React.useEffect(() => {
        if (!isCorrect) {
            return;
        }
        if (isCorrect === true) {
            let delay = setTimeout(() => { setIsCorrect("pop") }, 1400)
            return;
        }
        let delay2 = setTimeout(() => { setIsCorrect(false) }, 2400);
        return;
    }, [isCorrect])
}
// scoreScreen:

const verifyFile = (file, maxSize) => {
    if (file && file.length > 0) {
        const currentFile = file[0];
        const fileType = currentFile.type;
        const fileSize = currentFile.size
        if (fileSize > maxSize) {
            return "size";
        }
        if (!/image/.test(fileType)) {
            return "format";
        }
        return true
    } else {
        return false
    }

}
const handleFileUpload = (event, setErrorMessage, setError, setCropperDiv, setImageSource, setCrop) => {
    switch (verifyFile(event.target.files, 5242880)) {
        case "size":
            setErrorMessage("size")
            setError(true)
            event.target.value = null;
            return;
        case "format":
            setErrorMessage("format");
            setError(true);
            event.target.value = null;
            return;
        case false:
            console.log("no file has been selected")
            event.target.value = null;
            return;
        default:
            console.log("validation sucessful");
            break;
    }
    setImageSource(null);
    setCrop(null);
    const currentFile = event.target.files[0];
    // this section changes the image to imageBase64Data which is basicly just a string. .readAsDataURL() renders the image ?
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        setImageSource(reader.result);
    }, false)
    reader.readAsDataURL(currentFile);
    setCropperDiv(true);
    event.target.value = null;
    return;

}
const useWrongFormat = (state, setState) => {
    React.useEffect(() => {
        if (state === false) {
            return;
        }
        if (state === true) {
            let delay = setTimeout(function () {
                setState("pop");
                return;
            }, 2000)
        }
        if (state === "pop") {
            let delay2 = setTimeout(function () {
                setState(false);
                return;
            }, 2000)
        }
    }, [state])
}
const useCloseAvatarSelector = (state, setState, secondState) =>{
    React.useEffect(() => {
        console.log(secondState, state);
        if (secondState) {
            return;
        }
        if (!state) {
            return;
        }
        const handleKey = (event) => {
            if (event.key === "Escape") {
                setState(false);
                return;
            }
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    },[state, secondState])
}
const useCloseCropper = (state, setState, setSecondState) => {
    React.useEffect(() => {
        if (!state) {
            return;
        }
        const handleKey = (event) => {
            if (event.key === "Escape") {
                setState(false);
                setSecondState(null);
            }
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [state])
}

function onImageLoad(event, aspect, setCrop, centerAspectCrop) {
    if (aspect) {
        const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect))
    }
}
//function handleToggleAspectClick(aspect, setAspect, imgRef, setCrop, centerAspectCrop) {
//    if (aspect) {
//        setAspect(undefined)
//    } else if (imgRef.current) {
//        const { width, height } = imgRef.current;
//        setAspect(16 / 9);
//        setCrop(centerAspectCrop(width, height, 16 / 9));
//    }
//}




export {
    calculateScore, useUpdateScore, useRefreshScore, remakeScoreObj, isNameTrue, useDisplayError,
    useCloseCropper, useWrongFormat, onImageLoad, handleFileUpload, useCloseAvatarSelector
};