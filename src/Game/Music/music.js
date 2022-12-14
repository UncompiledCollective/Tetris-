import * as React from "react";
import { songs, generatePlaylist } from "./songsObj.js";

const MusicPlayer = ({ mVol, isMute, Text, lang }) => {
    console.log("music player renders")
    const [song, setSong] = React.useState(0); //what's the index of current song, we start at 0
    const [isPlaying, setIsPlaying] = React.useState(false); //is the music playing
    const [isPopup, setIsPopup] = React.useState(false);//change state
    const [tryPromise, setTryPromise] = React.useState(false);
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
    useStartPlaying(firstRenderRef, setIsPlaying, isPlaying, musicRef.current, song, mVol, setTryPromise, tryPromise);
    useSwitchSong(song, setSong, playlistRef)
    return (
        <div className="soundContainer">
            <audio src={songs[playlistRef.current[song]].audio}
                ref={musicRef}
                onEnded={(e) => autoPlay(e, song, setSong, playlistRef)}
                muted={isMute}
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
const useStartPlaying = (firstRender, setPlay, play, musicRef, song, mVol, setTryPromise, tryPromise) => {
    React.useEffect(() => {
        const tryAgain = () => {
            setTryPromise(!tryPromise)
        }
        if (firstRender.current) {
            const startPlaying = () => {
                setPlay(true);
                return;
            }
            
            let delay = setTimeout(startPlaying, 4000);
            firstRender.current = false;
            return;
        }
        if (play) {
            try {
                musicRef.play()
                musicRef.volume = mVol / 100;
            } catch {
                let delay2 = setTimeout(tryAgain, 3000)
                console.log("trying again")
            }
        }
    },[play, song, mVol, tryPromise])
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
const useSwitchSong = (song, setSong, playlistRef) => {
    React.useEffect(() => {
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
    }, [song])
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