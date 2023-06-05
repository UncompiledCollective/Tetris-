import * as React from "react";
import axios from "axios";
const remakeScoreObj = (obj) => {
    obj.current.Score = 0;
    obj.current.lines_4 = 0;
    obj.current.lines_3 = 0;
    obj.current.lines_2 = 0;
    obj.current.lines_1 = 0;
    obj.current.lines_total = 0;
    obj.current.name = "";
    obj.current.avatar_id = "";
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
const useRefreshScore = (firstRender, gameOn, scoreObj, setHoldScore, remakeScoreObj, score, setNewGlobalScore, setIsChanged, setErrorState) => {
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
            if (score.Score) {
                axios.post("/new-score", score).then(function (result) {
                    if (result.data.value !== undefined) {
                        setNewGlobalScore((x) => {
                            x[0] = true;
                            x[1] = result.data.value;
                            return x;
                        });
                        setIsChanged("changed");
                    }
                }).catch(function (error) {
                    setErrorState(0);
                    console.log(error);
                })
            }
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
            return () => clearTimeout(delay);
        }
        let delay2 = setTimeout(() => { setIsCorrect(false) }, 2400);
        return () => clearTimeout(delay2);
    }, [isCorrect])
}
// scoreScreen:

const verifyFile = (file, maxSize) => {
    if (file && file.length > 0) {
        const currentFile = file[0];
        const fileType = currentFile.type;
        const fileSize = currentFile.size
        if (!/image/.test(fileType)) {
            return "format";
        }
        if (fileSize > maxSize) {
            return "size";
        }
        return true
    } else {
        return false
    }

}
const handleFileUpload = (event, setErrorMessage, setCropperDiv, setImageSource, setCrop) => {
    switch (verifyFile(event.target.files, 5242880)) {
        case "format":
            setErrorMessage("format");
            event.target.value = null;
            return;
        case "size":
            setErrorMessage("size")
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
const useCloseAvatarSelector = (state, setState, secondState, thirdState) =>{
    React.useEffect(() => {
        if (secondState) {
            return;
        }
        if (!state) {
            return;
        }
        if (thirdState) {
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
const useRestoreCrop = (imageSource, setPreview) => {
    React.useEffecT(() => {
        if (!imageSource) {
            return;
        }
        setPreview(true);
    },[imageSource])
}
function canvasToBase64(canvas) {
    let file = canvas.toDataURL("image/jpeg");
    let temp = file.split(","); //splits image file into extension part, and base64 string. 
    let fileType = temp[0].match(/:(.*?);/)[1]; // extension
    console.log(fileType, "logging filetype");
    let bstr = atob(temp[1]); // atob turns a string into bytes file. Voodoo. Don't log it, it's just intelligable noise
    let n = bstr.length; // length of that intelligable string. Because.
    let u8arr = new Uint8Array(n); //makes it into an 8 bit? array. This stinks of C.
    while (n--) { //n-- means until n reaches 0. n is usually a couple thousands.
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "testfile", { type: fileType });
}

const useSendAvatar = (state, setState, setIsLoading, canvas, madeAvs, setMadeAvs, setMemory, getMemory, setCurrentAv) => {
    async function postAvatar() {
        setIsLoading(true);
        await canvas.current.toBlob(function (blob) {
            axios.post("/post-file",
                {
                    avatar: blob
                },
                {
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                }
            )
                .then(function (response) {
                    if (response.data.value !== undefined) {
                        let temp = getMemory("funk_tetris-made-avs");
                        temp.push(response.data.value);
                        setMemory("funk_tetris-made-avs", temp);
                        setMadeAvs((x) => x.push(response.data.value));
                        setCurrentAv(response.data.value);
                        setMadeAvs(temp);
                        setState("second")
                    }
                }).catch(function (error) {
                    setState("second");
                })
        }, "image/jpg")
       
    }
    React.useEffect(() => {
        if (state !== true) {
            return;
        }
        postAvatar()
    },[state])
}
// the function below will append imported avatars object. If there is nothing to append returns the object itself.
// array is received from API sql database.
// every cell of that array contains and object with 2 keys:
// avatar_id of type Integer
// avatar_file of type buffer
// if no file is detected (it was removed from SQL database and set to null) it will be ommited.
// if imported avatars object already has an avatar of that ID it will be ommited
// otherwise a new key value pair will be created, called av + avatar_id (ex: av7)
// its value will be a base64string made from that SQL buffer
function addToObj(obj, array) {
    if (array.length === 0) {
        return obj;
    }
    for (let x = 0; x < array.length; x++) {
        if (!array[x].avatar_file) {
            continue;
        }
        if (obj["av" + array[x].avatar_id] !== undefined) {
            continue;
        }
        obj["av" + array[x].avatar_id] = 'data:image/jpeg;base64, ' + arrayBufferToBase64(array[x].avatar_file.data)
    }
    return obj;
}
// function below takes imported avatar object, and makes an array of its keys (if keys are av7, av8, av22 it will return [7,8,22])
// this is used by the API to filter avatars already in possesion of client (this array is used in post request to the API).
function objToArray(obj) {
    let temp = Object.keys(obj);
    let temp2 = temp.map(function (x) {
        return parseInt(x.replace(/av/, ""));
    })
    return temp2;
};
const useGetAvatars = (state, avatarObject, setAvatarObject, avatarArray, setLoading,
    setState, errorState, setErrorState, debounce = 1000) => {
    async function getAvatars() {
        setLoading(true);
        if (avatarArray.length === 0) {
            setLoading(false);
            setState(false);
            return;
        }
        let temp = [];
        for (let x = 0; x < avatarArray.length; x++) {
            if (avatarObject["av" + avatarArray[x]] !== undefined) {
                continue;
            }
            temp.push(avatarArray[x]);
        }
        checkErrorState(errorState, setErrorState);
        if (temp.length > 0) {
            let obj = { id_array: temp };
            await axios.post("/receive-local", temp).then(function (result) {
                if (result.data) {
                    setAvatarObject((x) => {
                        return addToObj(x, result.data);
                    })
                }
                setState("third");
                setLoading(false);
            }).catch(function (error) {
                console.log(error)
                setState(false);
                setLoading(false);
                console.log(typeof setErrorState);
                setState("third");
                setErrorState(0);
            })
        }
    }
    React.useEffect(() => {
        if (state === "third") {
            let timer = setTimeout(() => setState(false), debounce)// debouncing this request just in case.
            return () => clearTimeout(timer);
        }
        if (state !== "second") { return; };
        getAvatars();
    },[state])
}
function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let x = 0; x < len; x++) {
        binary += String.fromCharCode(bytes[x]);
    }
    return window.btoa(binary);
};
// avatarArray contains avatar IDs created by user (stored in localStorage), example: [7,22,24] - this array contains ids for avatar number 7, 22, 24
// After api call and array of avatars is received (deeper explaination at addToObj function)
// this function filters object of imported avatars
// if at corresponding id (7,22 or 24) an avatar file exists, that value is pushed and returned.
// if for avatar id of 24 no avatar file exists (it was deleted from the database for some reason) it is ommited
// in that case returned array will be [7,22].
function filterImportedIDs(avatarArray, importedObj) {
    let temp = []
    for (let x = 0; x < avatarArray.length; x++) {
        if (importedObj["av" + avatarArray[x]]) {
            temp.push(avatarArray[x]);
        }
    }
    return temp;
}
function divideIntoPages(avatarObj, avatarArray, importedObj) {
    let importedFilteredIDs = filterImportedIDs(avatarArray, importedObj);
    let numOfAvs = avatarObj.length + importedFilteredIDs.length + 1; // that +1 denotes AddAvatar button, which will be rendered on the last page
    let temp = []
    let i = 0
    while (numOfAvs > 0) {
        numOfAvs -= 24;
        temp.push(i);
        i++;
    }
    return temp;
}

function movePageAvatar(pages, currentPage, setCurrentPage, direction) {
    //right = true, left = right;
    switch (currentPage) {
        case 0:
            direction ? setCurrentPage((x) => x + 1) : setCurrentPage((x) => pages.length - 1);
            break;
        case pages.length - 1:
            direction ? setCurrentPage(() => 0) : setCurrentPage((x) => x - 1);
            break;
        default:
            direction ? setCurrentPage((x) => currentPage + 1) : setCurrentPage((x) => currentPage -= 1);
            break;
    }
}
const useShowFileError = (state, setState, classState, setClassState, delay) => {
    React.useEffect(() => {
        if (!state) {
            return;
        }
        if (classState === " pop") {
            let timer = setTimeout(function () {
                setClassState("")
                setState(false)
            }, delay - 1500)
            return () => clearTimeout(timer);
        }
        if (state) {
            let timer = setTimeout(function () {
                setClassState(" pop")
            }, delay)
            return () => clearTimeout(timer);
        }
        
    },[state, classState])
}
function filterNumAndArray(num, array) {
    for (let y = 0; y < array.length; y++) {
        if ((num ^ array[y]) === 0) {
            return false;
        }
    }
    return true;
}
function filterAndPush(localArray, arrayFromObj) {
    let temp = [];
    for (let x = 0; x < localArray.length; x++) {
        if (filterNumAndArray(localArray[x], arrayFromObj)) {
            temp.push(localArray[x]);
        }
    }
    return arrayFromObj.concat(temp);
}
// below is function that filters avatar_ids received from the API (it sends to clinet an array of objects with avatar_id and avatar_file keys);
// it just filters them and appends localAvatarArray.
function fromObjArray(array, arrayOfObjects) {
    if (arrayOfObjects.length === 0) {
        return array;
    }
    for (let y = 0; y < arrayOfObjects.length; y++) {
        if (arrayOfObjects[y]?.avatar_id) {
            if (filterNumAndArray(arrayOfObjects[y].avatar_id, array)) {
                array.push(arrayOfObjects[y].avatar_id);
            }
        }
    };
    return array;
}
const useGetAvsForSelector = (state, setState, setSelectorLoading, setLocalAvatarArray, importedAvObj, setImportedAvObj,errorState, setErrorState, debounce=1000) => {
    async function getAvatars() {
        checkErrorState(errorState, setErrorState);
        setSelectorLoading(true)
        let temp = objToArray(importedAvObj);
        let timer = setTimeout(function () {
            axios.post("/get-all-avatars", temp).then(function (result) {
                setImportedAvObj((x) => {
                    let arr = addToObj(x, result.data);
                    let arr2 = objToArray(arr);
                    setLocalAvatarArray((z) => {
                        return filterAndPush(arr2, z);
                    })
                    return arr;
                });
                setState("pages");
            }).catch(function (error) {
                console.log(error);
                setSelectorLoading(false);
                setState("third");
                setErrorState(0);
            })
        },1000)
        return () => clearTimeout(timer);
    }
    React.useEffect(() => {
        if (state === "third") {
            let timer = setTimeout(() => setState(false), debounce)// this is debouncing;
            return () => clearTimeout(timer);
        }
        if (state !== true) {
            return;
        }
        getAvatars();
    },[state])
}
const useRefreshPages = (state, setState, setPages, avatarObj, madeAvs, importedAvObj, setIsSelectorLoading) => {
    React.useEffect(() => {
        if (state !== "pages") {
            return;
        }
        setPages((x) => {
            return divideIntoPages(avatarObj, madeAvs, importedAvObj)
        })
        setIsSelectorLoading(false);
        setState(false);
    },[state])
}
function checkErrorState(state, setState, value="close") {
    if (state !== false) {
        setState(value);
        return true;
    }
    return false;
}

export {
    calculateScore, useUpdateScore, useRefreshScore, remakeScoreObj, isNameTrue, useDisplayError,
    useCloseCropper, useWrongFormat, onImageLoad, handleFileUpload, useCloseAvatarSelector,
    useRestoreCrop, useSendAvatar, useGetAvatars, addToObj, filterImportedIDs,
    divideIntoPages, movePageAvatar, useShowFileError, objToArray, useGetAvsForSelector, useRefreshPages
};