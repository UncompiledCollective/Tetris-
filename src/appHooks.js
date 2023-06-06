import * as React from "react";
import axios from "axios";
import { ReactComponent as PlusSign } from "./Game/Menu Components/Menu SVGs/plus1.svg";
const ApiImages = ({ buffers }) => {
    var base64String = arrayBufferToBase64(buffers.data);
    console.log(base64String);
    return (
        <div className="imageHolder" style={{ width: "100px", height: "100px" }}>
            <img src={'data:image/jpeg;base64,' + base64String} />
        </div>
    )
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
const retreiveMemory = (name) => {
    let temp = JSON.parse(localStorage.getItem(name));
    return temp;
}
const setMemory = (name, value) => {
    localStorage.setItem(name, JSON.stringify(value))
    return;
}
const useHideLoader = (loader) => {
    React.useEffect(() => {
        loader.classList.add('close');
        let timer = setTimeout(() => {
            loader.classList.add("hidden");
            return;
        }, 500);
        return () => clearTimeout(timer);
    }, [])
}
const useStartPlayingTrick = (state, setState) => {
    React.useEffect(() => {
        if (!state || state === "re") {
            return;
        }
        console.log("trick");
        const handleclick = (event) => {
            setState("re"); // this is important to rerender music component if no interaction has happend on the user side
            return;
        }
        document.addEventListener("click", handleclick)
        return () => document.removeEventListener("click", handleclick)
    }, [state])
}
const ApiTest = () => {
    const [backendData, setBackendData] = React.useState(false);
    const [imageSource, setImageSource] = React.useState(null);
    const [imageBuffer, setImageBuffer] = React.useState(null);
    const [isImages, setIsImages] = React.useState(false);
    const instance = axios.create({
        baseURL: "https://funk-tetris-api.onrender.com",
    });
    function downloadFile(file) {
        var element = document.createElement('a');
        const url = window.URL.createObjectURL(
            file,
        );
        element.href = url;
        element.setAttribute("download", "test.jpg")
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    const handleClick = () => {
        try {
            instance.get("/send-scores",{
            }).then((response) => {
                console.log(response.data);
            })
        } catch (error) {
            console.log(error)
        }
        return;
    }
    const handleClick2 = () => {
        
        axios.get("https://funk-tetris-api.onrender.com/send-scores", {
        }).then(function (result) {
            console.log(result.data, "logging result");
        }).catch(function (error) {
            console.log(error)
        })
        return;
    }
    const handleClick3 = () => {
        const testScore = {
            Score: 22000,
            lines_4: 3,
            lines_3: 0,
            lines_2: 0,
            lines_1: 0,
            lines_total: 3,
            name: "fucker",
            avatar_id: 0,
        }
        axios.post("/sort-test", testScore).then(function (result) {
            console.log(result.data);
        })
        return;
    }
    const handleClick4 = () => {
        const testScore = {
            Score: 22000,
            lines_4: 3,
            lines_3: 0,
            lines_2: 0,
            lines_1: 0,
            lines_total: 3,
            name: "fucker",
            avatar_id: 0,
        }
        axios.post("/delete-test", testScore).then(function (result) {
            console.log(result.data);
        })
    }
    const handleClick5 = () => {
        let temp = retreiveMemory("funk_tetris-made-avs");
        console.log(temp);
        return;
    }
    return (
        <div className="apiTest">
            <button type="button" style={{ width: "300px", height: "100px" }} onClick={function () {
                handleClick();
            }}>test</button>
            <div className="addContainer" >
                <label htmlFor="file-input-3" className="addWraper" style={{ width: "2rem", height: "2rem" }}>
                    <PlusSign style={{ width: "5rem", height: "5rem" }} />
                </label>
                <input type="file" id="file-input-3"
                    onChange={(event) => {
                        const currentFile = event.target.files[0];
                        console.log(typeof currentFile, Object.keys(currentFile));
                        setImageSource(currentFile);
                        console.log(imageSource);
                        event.target.value = null;
                        return;
                    }}

                />

            </div>
            <button type="button" style={{ width: "300px", height: "100px" }} onClick={function () {
                if (imageBuffer && isImages) {
                    setIsImages(false);
                    return;
                }
                if (imageBuffer) {
                    setIsImages(true);
                }
                return;

            }}>display downloaded</button>
            {isImages && (
                <ApiImages buffers={imageBuffer} />
            )}
            <button type="button" style={{ width: "300px", height: "100px" }} onClick={function () {
                handleClick2();
            }}>button 2</button> <button type="button" style={{ width: "300px", height: "100px" }} onClick={function () {
                handleClick3();
            }}>sort-test</button><button type="button" style={{ width: "300px", height: "100px" }} onClick={function () {
                handleClick4();
            }}>delete-test</button><button type="button" style={{ width: "300px", height: "100px" }} onClick={function () {
                handleClick5();
            }}>remove from local storage</button>
        </div>
    )
}
//old contents from musicHooks.js. Explaination there
const oldUseHoldSongs = {
    old: ```
        setApiBusy(true)
        console.log("executing htttp request");
        axios.get(adress + "/get-songs-init").then(function (response) {
            if (response.data) {
                let urls = genBlobs(response.data);
                setReturnSongs((x) => {
                    if (x.length >= urls.length + 8) {
                        return x;//check just in case this hook runs twice for some reason. Happens in dev build
                    }
                    x = x.concat(urls);
                    return x;
                })
                setPlaylistState(true);
                setApiBusy(false);
            }
        }).catch(function (error) {
            console.log(error);
            setApiBusy(false);
        })
        setState(true);
        return;
```
}
export { ApiImages, arrayBufferToBase64, retreiveMemory, setMemory, useHideLoader, useStartPlayingTrick, ApiTest }