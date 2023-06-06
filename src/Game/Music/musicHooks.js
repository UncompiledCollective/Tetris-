import * as React from "react";
import axios from "axios";
import { adress } from "../../Game/Menu Components/axios.js"
const useGeneratePlaylist = (songsObj, state, randomiseFunc) => {
    const [list, setList] = React.useState(songsObj ? songsObj.map((x, index) => index) : []);
    React.useEffect(() => {
        if (state !== true) {
            return
        }
        setList((x) => randomiseFunc(x));
    }, [state]);
    return [list, setList];
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
const useHoldSongs = (songsObj, setState, setPlaylistState, setApiBusy) => {
    const [returnSongs, setReturnSongs] = React.useState(songsObj)
    React.useEffect(() => {
        //space for a possible HTTP post request to get some songs
        setState(true);
        return;
        //setting return here because this HTTP request crashes my free API.
        // Gonna try to make it work with that button in settings that downloads more songs.
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
    }, [])
    return [returnSongs, setReturnSongs];
}
// hooks and functions:
const useStartPlaying = (firstRender, setPlay, play, musicRef, song, mVol, mute, oneTime) => {
    React.useEffect(() => {
        if (!oneTime) {
            return;
        }
        if (firstRender.current) {
            firstRender.current = false;
            let timer = setTimeout(function () {
                setPlay(true);
            }, 2000)
            return;
        }
        if (!play) {
            return;
        }
        musicRef.volume = mVol / 100;
        musicRef.play();

    }, [play, song, mVol, mute, oneTime])
}

const autoPlay = (e, song, setSong, songPlaylist) => {
    if (song === songPlaylist.length - 1) {
        let delay = setTimeout(function () {
            setSong(0)
        }, 1500);
    }
    else {
        let delay2 = setTimeout(function () {
            setSong(song + 1)
        }, 3000);
    }
    return;
};


const setPrevious = (song, setSong, songPlaylist) => {
    if (song === 0) {
        setSong(songPlaylist.length - 1)
    } else {
        setSong(song - 1)
    }
    return;
}
const setNext = (song, setSong, songPlaylist) => {
    if (song === songPlaylist.length - 1) {
        setSong(0);
    } else {
        setSong((x) => x + 1);
    }
    return;
}
const useSwitchSong = (song, setSong, songPlaylist, isFocused) => {
    React.useEffect(() => {
        if (isFocused) {
            return;
        }
        const handleKey = (event) => {
            if (event.key === "o") {
                setPrevious(song, setSong, songPlaylist)
            }
            if (event.key === "p") {
                setNext(song, setSong, songPlaylist)
            } else {
                return;
            }
            return;
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [song, isFocused])
}
const handleClick = (e, text, cords, setter, status) => {
    cords.current[0] = e.clientX;
    cords.current[1] = e.clientY;
    navigator.clipboard.writeText(text);
    if (status === false) {
        setter(true);
    }
    return;
}

const useClosePopup = (firstRender, isPopup, setIsPopup) => {
    React.useEffect(() => {
        const closePopup = () => setIsPopup(false)
        if (firstRender.current) {
            return;
        }
        if (isPopup === true) {
            setIsPopup("closing");
            return;
        }
        if (isPopup === "closing") {
            let delay = setTimeout(closePopup, 1000);
            return () => clearTimeout(delay);
        }
        return;
    }, [isPopup])
}
const useUpdatePlaylist = (setList, state, setState, songs) => {
    React.useEffect(() => {
        if (!state) { return; }
        setList((x) => {
            if (x.length < songs.length) {
                for (let y = x.length; y < songs.length; y++) {
                    x.push(y);
                }
                
            }
            return x;
        })
        setState(false);
    },[state])
}
export {
    useGeneratePlaylist, useHoldSongs, useStartPlaying, autoPlay,
    setPrevious, setNext, useSwitchSong, handleClick, useClosePopup,
    useUpdatePlaylist
}