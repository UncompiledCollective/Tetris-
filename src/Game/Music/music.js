import * as React from "react";
import { songs, generatePlaylist } from "./songsObj.js";

const MusicPlayer = ({ mVol, isMute, Text, lang, isFocused, oneTime }) => {
    const [song, setSong] = React.useState(0); //what's the index of current song, we start at 0
    const [isPlaying, setIsPlaying] = React.useState(null); //is the music playing
    const [isPopup, setIsPopup] = React.useState(false);//change state
    const firstRenderRef = React.useRef(true);
    const musicRef = React.useRef(null); //used to handle <audio>
    const playlistRef = React.useRef(generatePlaylist(songs));//generates a random playlist every time the game loads.
    const coordinates = React.useRef([0, 0]); // mouse coordinates
    const currentSong = songs[playlistRef.current[song]].title; // current song variable. Used to display what song is playing at the bottom
    var popUpClass = []
    switch (isPopup) {
        case true:
            popUpClass.push("")
            break;
        case "closing":
            popUpClass.push("close");
            break;
        case false:
            popUpClass.push("hidden");
            break;
    }
    useClosePopup(firstRenderRef, isPopup, setIsPopup)
    useStartPlaying(firstRenderRef, setIsPlaying, isPlaying, musicRef.current, song, mVol, isMute, oneTime);
    useSwitchSong(song, setSong, playlistRef, isFocused)
    return (
        <div className="soundContainer">
            <audio src={songs[playlistRef.current[song]].audio}
                ref={musicRef}
                onEnded={(e) => autoPlay(e, song, setSong, playlistRef)}
                muted={isMute}
                autoPlay={true }
            >
            </audio>

            <div className={"songPopup " + popUpClass} style={{ left: `${coordinates.current[0]}px`, top:`${coordinates.current[1]-25}px` }}>copied!</div>
            <div className="songContainer" onClick={(e) => handleClick(e, currentSong, coordinates, setIsPopup, isPopup) } >
                <div className={`${isPlaying?"intermediary":"intermediary hidden"}` } >
                    <div className="songText first" >{Text[lang].sound.playing } &nbsp; {currentSong}</div>
                    <div className="songText second" >{Text[lang].sound.playing} &nbsp; {currentSong}</div>
                    <div className="songText third" >{Text[lang].sound.playing} &nbsp; {currentSong}</div>
                    <div className="songText forth">{Text[lang].sound.playing} &nbsp; {currentSong}</div>
                </div>
            </div>
        </div>
        )
}


// hooks and functions:
const useStartPlaying = (firstRender, setPlay, play, musicRef, song, mVol, mute, oneTime) => {
    React.useEffect(() => {
        if (firstRender.current) {
            //const startPlaying = () => {
            //    setPlay(true);
            //    return;
            //}
            //let delay = setTimeout(startPlaying, 4000);
            setPlay(false);
            firstRender.current = false;
            return;
        }
        if (!play) {
            let delay = setTimeout(function () {
                setPlay(true)
            }, 4500);
            musicRef.pause();
            return;
        }
        if (play) {
            musicRef.volume = mVol / 100;
            musicRef.play();
        }

    },[play, song, mVol, mute, oneTime])
}

const autoPlay = (e, song, setSong, playlistRef) => {
    if (song === playlistRef.current.length - 1) {
        const toFirst = () => {
            setSong(0)
            return;
        }
        let delay = setTimeout(toFirst, 3000);
    }
    else {
        const updateSong = () => {
            setSong(song + 1)
            return;
        }
        let delay2 = setTimeout(updateSong, 3000);
    }
    return;
};

const setPrevious = (song, setSong, playlistRef) => {
    if (song === 0) {
        setSong(playlistRef.current.length - 1)
    } else {
        setSong(song - 1)
    }
    return;
}
const setNext = (song, setSong, playlistRef) => {
    if (song === playlistRef.current.length - 1) {
        setSong(0);
    } else {
        setSong(song + 1);
    }
    return;
}
const useSwitchSong = (song, setSong, playlistRef, isFocused) => {
    React.useEffect(() => {
        if (isFocused) {
            return;
        }
        const handleKey = (event) => {
            if (event.key === "o") {
                setPrevious(song, setSong, playlistRef)
            }
            if (event.key === "p") {
                setNext(song, setSong, playlistRef)
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
        }
        return;
    },[isPopup])
}
export { MusicPlayer };