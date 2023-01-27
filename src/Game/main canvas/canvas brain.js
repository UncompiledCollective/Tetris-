import * as React from "react";
import "./canvas style.css";
import { StartArray, GameOfFunction } from "./array.js";
import {
    getFirstPiece, getNextPiece, changeCheckDown, changeCheckSide, changeCheckGhost,
    findLowestY, findHeight, spawnPiece,
} from "./pieces.js"
import { leftRotator, leftRotatorCheck } from "./leftRotators.js";
import { rightRotator, rightRotatorCheck } from "./rightRotator.js"
import { StartScreen, PauseScreen, OverScreen } from "./StartScreen.js"
import death from "./death.mp3"
import {
    checkMoveDown, checkMoveLeft, checkMoveRight, checkIfAnyFull,
    restoreBoard
    } from './controls.js'
const death_sound = new Audio(death)
const CanvasGame = ({ array_prop, sendNextPiece, setLinesCleared, gameOn, setGameOn, getMovement, setSendMovement, isSettingsOpen, ghost }) => {
    const [GameArray, setGameArray] = React.useState(StartArray); // ok this is a mutable array used only to change the value attribute of cells
    const [isChanged, setIsChanged] = React.useState(false); // GameArray is an Array, if certain key-value pair changes it will not trigger a rerender. This will be used to trigger that rerender. Probably gonna wrap that into a function.
    const [boardStatus, setBoardStatus] = React.useState(false); //used to reveal the board and hide the start button. Is passed down as props.
    const [countdown, setCountdown] = React.useState(""); // Used to generate countdown. Once the value returns to "" that div will disappear.
    const [notifyEnd, setNotifyEnd] = React.useState(true) //used to go to next piece when we hit the bottom or another piece. No better way to do it so far.
    const firstRender = React.useRef(true); //ref to prevent some stuff on first render
    const currentPiece = React.useRef(null); // keeps track of current piece. When set back to null the game will no longer respond.
    const nextPiece = React.useRef(null);
    const rowFull = React.useRef(false); // this ref is used to track if any rows are full after a complete move.
    const [fullRowsStatus, setFullRowsStatus] = React.useState(false) // used to trigger removal of full rows.
    const [rowsToRemoveStatus, setRowsToRemoveStatus] = React.useState(false) // used to move the remaining rows down.
    const wasRotated = React.useRef(false); // used to tell if the previous move was rotation to re-generate checks
    // for the piece.
    const ghostPieceRef = React.useRef(null);

    // I couldn't export functions that use setGameArray() setter of GameArray React.useState().
    // so they are here. As much stuff as I could I have exported elsewhere for better code readibility
    //functions for game logic
    const gameOver = () => { //executes when either of the defeat conditions are met.
        currentPiece.current = null
        nextPiece.current = null
        death_sound.play()
        setGameOn("over");
    }
    const RemakeEveryting = () => {
        setGameOn(false)
        setBoardStatus(false)
    }
    // below are functions for movement. Their deeper explaination is at controls.js at the very bottom.

    const moveDown = (piece) => { //moves the piece down after checking if it has a free spot for the piece below.
        if (checkMoveDown(piece, GameArray)) {
            setGameArray((x) => {
                let temp = x;
                for (let y = 0; y < piece.arr.length; y++) {
                    temp[piece.arr[y][0]][piece.arr[y][1]].value = 0;
                }
                for (let k = 0; k < piece.arr.length; k++) {
                    piece.arr[k][0] += 1
                    temp[piece.arr[k][0]][piece.arr[k][1]].value = piece.val
                }
                ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray);
                return x = temp;
            })
            return true
        } else {
            if (checkIfAnyFull(piece, GameArray, rowFull)) {
                setGameOn("removing");
                console.log("beginning row removal")
                return "fullRows"
            } else {
                return false
            }
        }
    }
    const moveLeft = (piece) => {
        if (checkMoveLeft(piece, GameArray)) {
            setGameArray((x) => {
                let temp = x;
                for (let y = 0; y < piece.arr.length; y++) {
                    temp[piece.arr[y][0]][piece.arr[y][1]].value = 0;
                }
                for (let z = 0; z < piece.arr.length; z++) {
                    piece.arr[z][1] -= 1;
                    temp[piece.arr[z][0]][piece.arr[z][1]].value = piece.val;
                }
                ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray);
                return x = temp;
            })
            return true
        } else {
            return false;
        }
    }
    const moveRight = (piece) => {
        if (checkMoveRight(piece, GameArray)) {
            setGameArray((x) => {
                let temp = x;
                for (let y = 0; y < piece.arr.length; y++) {
                    temp[piece.arr[y][0]][piece.arr[y][1]].value = 0
                }
                for (let z = 0; z < piece.arr.length; z++) {
                    piece.arr[z][1] += 1;
                    temp[piece.arr[z][0]][piece.arr[z][1]].value = piece.val;
                }
                ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray);
                return x = temp;
            })
            return true;
        } else {
            return false;
        }
    }
    const killRow = (array) => {
        setGameArray((x) => {
            let temp = x;
            for (let y = 0; y < array.length; y++) {
                for (let z = 0; z < 10; z++) {
                    temp[array[y]][z].value = 0;
                }
            }
            return x = temp;
        })
    }
    const removeEmpty = (array) => {
        console.log(array, "logging array at removeEmpty")
        setGameArray((x) => {
            let temp = x;
            for (let y = 0; y < array.length; y++) {
                for (let z = array[y]; z > 0; z--) {
                    if (y > 0) {
                        temp[z + y] = temp[z - 1 + y];
                        continue;
                    }
                    temp[z] = temp[z - 1];
                }
            }
            return x = JSON.parse(JSON.stringify(temp));
        })
    }
    const trueRotateLeft = (piece) => {
        switch (leftRotatorCheck[piece.name][piece.state](piece, GameArray)) {
            case true:
                setGameArray((x) => {
                    let temp = x;
                    for (let y = 0; y < piece.arr.length; y++) {
                        temp[piece.arr[y][0]][piece.arr[y][1]].value = 0;
                    }
                    leftRotator[piece.name][piece.state](piece);
                    for (let z = 0; z < piece.arr.length; z++) {
                        temp[piece.arr[z][0]][piece.arr[z][1]].value = piece.val;
                    }
                    ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray);
                    currentPiece.current.check = changeCheckDown(currentPiece.current.arr)
                    currentPiece.current.check_left = changeCheckSide(currentPiece.current.arr, "left")
                    currentPiece.current.check_right = changeCheckSide(currentPiece.current.arr, "right")
                    return x = temp;
                })
                wasRotated.current = true;
                return true;
            case "alt":
                setGameArray((x) => {
                    let temp = x;
                    for (let y = 0; y < piece.arr.length; y++) {
                        temp[piece.arr[y][0]][piece.arr[y][1]].value = 0;
                    }
                    leftRotator[piece.name].alt[piece.state](piece);
                    for (let z = 0; z < piece.arr.length; z++) {
                        temp[piece.arr[z][0]][piece.arr[z][1]].value = piece.val;
                    }
                    ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray);
                    currentPiece.current.check = changeCheckDown(currentPiece.current.arr)
                    currentPiece.current.check_left = changeCheckSide(currentPiece.current.arr, "left")
                    currentPiece.current.check_right = changeCheckSide(currentPiece.current.arr, "right")
                    return x = temp;
                })
                wasRotated.current = true;
                return true;
            case false:

                return false;
        }
    };
    const trueRotateRight = (piece) => {
        switch (rightRotatorCheck[piece.name][piece.state](piece, GameArray)) {
            case true:
                setGameArray((x) => {
                    let temp = x;
                    for (let y = 0; y < piece.arr.length; y++) {
                        temp[piece.arr[y][0]][piece.arr[y][1]].value = 0;
                    }
                    rightRotator[piece.name][piece.state](piece);
                    for (let z = 0; z < piece.arr.length; z++) {
                        temp[piece.arr[z][0]][piece.arr[z][1]].value = piece.val;
                    }
                    ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray);
                    currentPiece.current.check = changeCheckDown(currentPiece.current.arr)
                    currentPiece.current.check_left = changeCheckSide(currentPiece.current.arr, "left")
                    currentPiece.current.check_right = changeCheckSide(currentPiece.current.arr, "right")
                    return x = temp;
                })
                wasRotated.current = true;
                return true;
            case "alt":
                setGameArray((x) => {
                    let temp = x;
                    for (let y = 0; y < piece.arr.length; y++) {
                        temp[piece.arr[y][0]][piece.arr[y][1]].value = 0;
                    }
                    rightRotator[piece.name].alt[piece.state](piece);
                    for (let z = 0; z < piece.arr.length; z++) {
                        temp[piece.arr[z][0]][piece.arr[z][1]].value = piece.val;
                    }
                    ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray);
                    currentPiece.current.check = changeCheckDown(currentPiece.current.arr)
                    currentPiece.current.check_left = changeCheckSide(currentPiece.current.arr, "left")
                    currentPiece.current.check_right = changeCheckSide(currentPiece.current.arr, "right")
                    return x = temp;
                })
                wasRotated.current = true;
                return true;
            case false:
                return false;
        }
    }
    const moveToBottom = (piece, reference) => {
        let lowest = findLowestY(piece.arr);
        if (lowest === 22) { //if at 22 do nothing. May change it to something like MoveDown.
            return;
        }
        for (let i = lowest; i < 23; i++) {
            if (i === 22) {
                setGameArray((x) => {
                    for (let y = 0; y < 4; y++) {
                        x[piece.arr[y][0]][piece.arr[y][1]].value = 0;
                        piece.arr[y][0] = 22 + piece.arr[y][0] - lowest;
                    }
                    for (let y = 0; y < 4; y++) {
                        x[piece.arr[y][0]][piece.arr[y][1]].value = piece.val;

                    }
                    piece.check.map((y) => {
                        return y[0] = 22 + y[0] - lowest;
                    });
                    piece.check_left.map((y) => {
                        return y[0] = 22 + y[0] - lowest;
                    });
                    piece.check_right.map((y) => {
                        return y[0] = 22 + y[0] - lowest;
                    })
                    return x;
                })
                return;
            }
            let fcount = 0;
            for (let q = 0; q < piece.check.length; q++) {
                if (reference[i - lowest + piece.check[q][0] + 1][piece.check[q][1]].value !== 0) {
                    if (i === lowest) { // if a piece is DIRECTLY below do nothing. No need to execude all this code below at that point
                        return;
                    }
                    fcount += 1;
                }
            }
            if (fcount !== 0) {
                setGameArray((x) => {
                    for (let y = 0; y < 4; y++) {
                        x[piece.arr[y][0]][piece.arr[y][1]].value = 0;
                        piece.arr[y][0] = i + piece.arr[y][0] - lowest;
                    }
                    for (let y = 0; y < 4; y++) {
                        x[piece.arr[y][0]][piece.arr[y][1]].value = piece.val;
                    }
                    piece.check.map((y) => {
                        return y[0] = i + y[0] - lowest;
                    });
                    piece.check_left.map((y) => {
                        return y[0] = i + y[0] - lowest;
                    });
                    piece.check_right.map((y) => {
                        return y[0] = i + y[0] - lowest;
                    })
                    return x;
            })
                return;
            }
        }
    }
    const ghostPiece = (piece, reference) => {
        if (!ghost) {
            return;
        }
        if (currentPiece.current === null) {
            return;
        }
        let ghostArray = {
            arr: [[0, 0], [0, 0], [0, 0], [0, 0]],
            check: []
        }
        for (let x = 0; x < 4; x++) {
            ghostArray.arr[x][0] += piece.arr[x][0]
            ghostArray.arr[x][1] += piece.arr[x][1]
        } // copying piece.arr this way. Only this and JSON.parse(JSON.stringify(object)) make it work. That's because of how arrays are handled... Kinda went into this before
        // concat, spread, slice don't work here. Only for for some reason and JSON.parse... I presume for is faster than JSON because according to benchmark I've found JSON is the slowest metthod of cloning an array. But there was for.
        let height = findHeight(ghostArray.arr);
        height.sort((a, b) => b - a);
        ghostArray.arr.map((x) => { // here I am changing the Y coordinates so that the lowest Y is 0 and higher Ys are 0 + 1, 0 + 2...
            for (let o = 0; o < 4; o++) {
                if (height[o] === x[0]) {
                    return x[0] = o;
                }
            }
        })
        ghostArray.check = changeCheckGhost(ghostArray.arr); //making a check from ghostArray.
        let temp = height[0] // taking the lowest Y value (which is the highest well... bottom Y is 22 so the lowest of 3,4,5 would be 5)
        for (let h = temp; h < 23; h++) {
            if (h === 22) {
                setGameArray((x) => {
                    for (let y = 0; y < ghostArray.arr.length; y++) {
                        x[h - ghostArray.arr[y][0]][ghostArray.arr[y][1]].motion = true; //motion is a legacy key-value pair in StartArray. I was originaly
                        ghostArray.arr[y][0] = h - ghostArray.arr[y][0]; //intending to use it to indicate a moving piece. Now using it for the ghost piece.
                    }
                    return x;
                });
                return ghostArray
            }
            let tcount = 0;
            for (let r = 0; r < ghostArray.check.length; r++) {
                if (reference[h - ghostArray.check[r][0] + 1][ghostArray.check[r][1]].value !== 0) {
                    tcount += 1;
                } else {
                    continue;
                }
            } if (tcount !== 0) {
                setGameArray((x) => {
                    for (let y = 0; y < ghostArray.arr.length; y++) {
                        x[h - ghostArray.arr[y][0]][ghostArray.arr[y][1]].motion = true;
                        ghostArray.arr[y][0] = h - ghostArray.arr[y][0];
                    }
                    return x;
                });
                return ghostArray
            } else {
                continue;
            }
        }
            
    }
    const removeGhostPiece = (ghostPiece) => {
        if (!ghostPiece) {
            return;
        }
        setGameArray((x) => {
            for (let y = 0; y < ghostPiece.arr.length; y++) {
                x[ghostPiece.arr[y][0]][ghostPiece.arr[y][1]].motion = false;
            }
            return x;
        })
        return null;
    }
    //const handleClick2 = () => {
    //    console.log(currentPiece.current, "logging current piece")
    //    return;
    //}
    // test button, used for testing stuff
    const handleclick = () => {
        trueRotateLeft(currentPiece.current);
        moveToBottom(currentPiece.current, GameArray);
        switch (moveDown(currentPiece.current)) {
            case true:
                setIsChanged(!isChanged);
                break;
            case "fullRows":
                setFullRowsStatus(!fullRowsStatus)
                break
            case false:
                setNotifyEnd(!notifyEnd)
                break;
        }
        return;
    }

    // Event listener to capture keys. Doesn't trigger a rerender, which is wonderful

    const finalCountdown = React.useCallback(() => { // ok so this is used to countdown until the game starts
    const reduce = () => { setCountdown((x) => x - 1) }
        const return_value = () => {setCountdown("") }
        if (countdown > 0) {
            let delay = setTimeout(reduce, 1000)
            return;
        }
        if (countdown == 0) {
            let delay2 = setTimeout(return_value, 1000);
            return;
        }
    }, [countdown]);

    useRemakeGame(firstRender, gameOn, setGameArray, GameOfFunction, setBoardStatus);
    React.useEffect(() => { // ok so basicly
        if (firstRender.current === true) {
            return;
        }
        if (rowFull.current !== false) {
            const reRender = () => {
                setRowsToRemoveStatus(!rowsToRemoveStatus);
                setLinesCleared(rowFull.current.length);
            }
            killRow(rowFull.current);
            let delay = setTimeout(reRender, 500)
            return;
        }
    }, [fullRowsStatus])
    //useEffect hooks
    React.useEffect(() => {
        if (firstRender.current) {
            return;
        }
        const reRender = () => {setNotifyEnd(!notifyEnd) }
        removeEmpty(rowFull.current)
        let delay = setTimeout(reRender, 500)
    }, [rowsToRemoveStatus])

    React.useEffect(() => { // used to spawn another piece after the previous one has reached the bottom / encountered another piece below
        if (firstRender.current) {
            return;
        }
        if (rowFull.current) {
            rowFull.current = null;
        }
        true_Game();
        return;
    }, [notifyEnd])





    React.useEffect(() => { //controls the player input
        //if (wasRotated.current) { //regenerate checks after rotation. Necessary.
        //    currentPiece.current.check = changeCheckDown(currentPiece.current.arr)
        //    currentPiece.current.check_left = changeCheckSide(currentPiece.current.arr, "left")
        //    currentPiece.current.check_right = changeCheckSide(currentPiece.current.arr, "right")
        //    wasRotated.current = false;
        //}
        //if (getMovement) {
        //    return;
        //}

        if (gameOn === false || gameOn ==="over") { // this line disables the event listener when rows are being deleted.
            return;
        }
        const handleCapture = (event) => {
            event.preventDefault();
            if (currentPiece.current == null) { //if there's no piece at all - disable event listener
                return;
            }
            if (isSettingsOpen) {
                return;
            }
            if (event.key === "Escape") {
                if (gameOn === "pause") {
                    setGameOn(true);
                    return;
                }
                if (gameOn) {
                    setGameOn("pause");
                    return;
                }
                
            }
            if (ghostPieceRef.current && gameOn !== "pause") {
                removeGhostPiece(ghostPieceRef.current);
            }
            if (gameOn === "pause" || gameOn === "removing") {
                return;
            }
            if (event.key === "d" || event.key === "ArrowRight" || event.key === "t") {
                if (moveRight(currentPiece.current)) {
                    setIsChanged(!isChanged)
                    return;
                }

            }
            if (event.key === "a" || event.key === "ArrowLeft") {
                if (moveLeft(currentPiece.current)) {
                    setIsChanged(!isChanged)
                    return;
                }
            }
            if (event.key === "z" || event.key === "q") {
                if (currentPiece.current.name !== "sq") {
                    if (trueRotateLeft(currentPiece.current)) {
                        setIsChanged(!isChanged);
                        return;
                    } return;
                }
            }if (event.key === "c" || event.key === "e") {
                if (currentPiece.current.name !== "sq") {
                    if (trueRotateRight(currentPiece.current)) {
                        setIsChanged(!isChanged);
                        return;
                    }
                } return;
            }
            if (event.key === "s" || event.key ===   "ArrowDown") {
                switch (moveDown(currentPiece.current)) {
                    case true:
                        setIsChanged(!isChanged);
                        break;
                    case "fullRows":
                        setFullRowsStatus(!fullRowsStatus)
                        break;
                    case false:
                        setNotifyEnd(!notifyEnd)
                        break;
                }return;
            }
            if (event.key === " ") {
                moveToBottom(currentPiece.current, GameArray);
                setIsChanged(!isChanged);
                return;
            }
            // it will be moved and setIsChanged(will rerender the component)
        }
        // if returns false the game will spawn another piece. Will be implemented in another way later
        if (getMovement) {
            switch (moveDown(currentPiece.current)) {
                case true:
                    break;
                case "fullRows":
                    setFullRowsStatus(!fullRowsStatus)
                    break
                case false:
                    setNotifyEnd(!notifyEnd)
                    break;
            }
            setSendMovement(false);
        }
        document.addEventListener("keydown", handleCapture, true);
        return () => {
            document.removeEventListener("keydown", handleCapture, true);

        }
    },)

    React.useEffect(() => {// This is how the function to countdown is executed. With a fucking useEffect.  I don't know how to make it better.
        if (firstRender.current) {
            return;
        }
        if (countdown === "") {
            true_Game()//this will be used to start the game after countdown.
            return;
        }
        finalCountdown() //finalCountdown will eventually set the value of countdown to "" which will start the game.
    }, [countdown]);
    React.useEffect(() => { //when the game starts this is used to execute the functions above. this is already so fucking many rerenders. At least I got rid of that one App rerender. Taht's good.
        if (firstRender.current) { //this is the first render useEffect. 
            firstRender.current = false;
            return;
        }
        if (!boardStatus) {
            return;
        }
        setCountdown(3);
    }, [boardStatus])

    const true_Game = () => { // spawns the next piece. Generetaes new pieces. Sends the next piece to be displayed// at NextPiece.js
        if (currentPiece.current == null) {
            currentPiece.current = getFirstPiece();
            nextPiece.current = getNextPiece(currentPiece.current);
            spawnPiece(currentPiece.current, GameArray, setGameArray);
            sendNextPiece(nextPiece.current);
            ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray)
            setGameOn(true);
            return;
        } else {
            currentPiece.current = nextPiece.current;
            nextPiece.current = getNextPiece(currentPiece.current);
            if (!spawnPiece(currentPiece.current, GameArray,setGameArray)) {
                gameOver();
                return;
            };
            sendNextPiece(nextPiece.current);
            ghostPieceRef.current = ghostPiece(currentPiece.current, GameArray);
            setGameOn(true);
            setIsChanged(!isChanged);
            return;
        }
    }
    //React.useEffect(() => {
    //    if (firstRender.current) {
    //        return;
    //    }
    //    if (!currentPiece.current || !getMovement) {
    //        return;
    //    }
    //    switch (moveDown(currentPiece.current)) {
    //        case true:
    //            break;
    //        case "fullRows":
    //            setFullRowsStatus(!fullRowsStatus)
    //            break
    //        case false:
    //            setNotifyEnd(!notifyEnd)
    //            break;
    //    }
    //    setSendMovement(false);
    //    console.log("setSendMovement executes back to false", getMovement);
    //}, [getMovement])


    return (
        <div className="tableBoard clearfix" reactkey="board">  
            <table className={`${boardStatus ? "CanvasBoard" :"CanvasBoard hidden"}`} reactkey="tableMain">
                <tbody>
                    {array_prop.map((x, index) => {
                        if (index < 3) {
                            return (
                                <CanvasRow class_prop="row hidden" number={index} array={x} key={"row" + index} mutableA2={GameArray} />
                            )
                        }
                        else {
                            return (
                                <CanvasRow class_prop="row" number={index} array={x} key={"row" + index} mutableA2={GameArray} />
                            )
                        }
                })}
                </tbody>
            </table>
            <StartScreen board={boardStatus} setBoard={setBoardStatus }/>
            <button type="button" className="testButton hidden" onClick={handleclick}>test</button>
{/*            <button type="button" className="testButton" onClick={handleClick2}>test</button>*/}
            <div className="countdown"><div className="countdownText">{countdown}</div></div>
            <PauseScreen gameOn={gameOn} setGameOn={setGameOn} />
            <OverScreen gameOn={gameOn} callback={RemakeEveryting} />
        </div>
    )
}
const CanvasRow = ({ number, array, mutableA2, class_prop}) => {
    return (
        <tr className={class_prop} key={"r" + number} reackey={"r" + number}>
            {array.map((y, index2) => {
                return (
                    <CanvasCell key={"r" + number + "c" + index2} cell_number={index2} row_number={number} mutableFinal={mutableA2} />
                )
            })}
        </tr>
    )
}
const CanvasCell = ({ row_number, cell_number, mutableFinal }) => {
    const CellValue = mutableFinal[row_number][cell_number].value;
    const GhostValue = mutableFinal[row_number][cell_number].motion;
    var color = []
    var ghostClass = []
    switch (CellValue) {
        case 0:
            color.push("");
            GhostValue ? ghostClass.push("ghost") : ghostClass.push("");
            break
        case 1:
            color.push("yellow")
            break;
        case 2:
            color.push("red")
            break;
        case 3:
            color.push("green")
            break;
        case 4:
            color.push("blue")
            break;
        case 5:
            color.push("brown");
            break
        case 6:
            color.push("pink");
            break;
        case 7:
            color.push("lagoon")
            break;
        case 8:
            color.push("white")
            break;
    }
    return (
        <td className={"cell " + color + ghostClass} id={"r" + row_number + "c" + cell_number} value={CellValue} ></td>
        )
}
const useRemakeGame = (firstRender, gameOn, setter, template, setBoardStatus) => {
    React.useEffect(() => {
        if (firstRender.current) {
            return;
        }
        if (!gameOn) {
            restoreBoard(setter, template);
            setBoardStatus(false);
            return;
        }
    },[gameOn])
}
export { CanvasGame };