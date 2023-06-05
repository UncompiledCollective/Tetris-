import * as React from "react";
import { generatePlaylist } from "./songsObj.js";
import {
    useGeneratePlaylist, useHoldSongs, useStartPlaying, autoPlay,
    useSwitchSong, handleClick, useClosePopup, useUpdatePlaylist
} from "./musicHooks.js"; 
const MusicPlayer = ({ songList, mVol, isMute, Text, lang, isFocused, songState, setSongState,
    oneTime }) => {
    const [song, setSong] = React.useState(0); //what's the index of current song, we start at 0
    const [isPlaying, setIsPlaying] = React.useState(null); //is the music playing
    const [isPopup, setIsPopup] = React.useState(false);//change state
    const firstRenderRef = React.useRef(true);
    const musicRef = React.useRef(null); //used to handle <audio>
    const coordinates = React.useRef([0, 0]); // mouse coordinates
    const [songPlaylist, setSongPlaylist] = useGeneratePlaylist(songList, oneTime, generatePlaylist);
    const currentSong = songList ? songList[songPlaylist[song]].title : ""; // current song variable. Used to display what song is playing at the bottom
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
    useStartPlaying(firstRenderRef, setIsPlaying, isPlaying,
    musicRef.current, song, mVol, isMute, oneTime);
    useSwitchSong(song, setSong, songList, isFocused);
    useUpdatePlaylist(setSongPlaylist, songState, setSongState, songList);
    return (
        <div className="soundContainer">
            <audio {...oneTime ? {
                src: songList[songPlaylist[song]].audio
            } : {}}
                ref={musicRef}
                onEnded={(e) => autoPlay(e, song, setSong, songList)}
                muted={isMute}
                type='audio/mpeg'
                />
            <div className={"songPopup " + popUpClass} style={{ left: `${coordinates.current[0]}px`, top: `${coordinates.current[1]}px` }}>
                <span>{Text[lang].general.copied}</span></div>
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

export { MusicPlayer, useHoldSongs };