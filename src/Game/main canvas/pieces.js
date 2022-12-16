// explaination of all this stuff below:
// Pieces - this object has all 7 tetris pieces inside. Every piece has a name; sq, tp, zr, zl, lr, ll, hp
// the name is based on what the piece looks like - sq - square, tp - T-piece, zr - zet like turned right and so on.
// the contents of everery piece and its function:
// arr - a 2d array which holds current coordinates of the piece.
// let's take sq as an example:
// [3,4] - 3 is the y coordinate, 4 is the x coordinate.
// the board at canvas brain, GameArray is an object in array.js.
// it has 23 rows (3 of them are invisible, above the board), and 20 visible rows.
// every row has 10 cells.
// the Board y axis is represented by the rows.
// x axis are the 10 cells

// Note:  the bottom is 22, top is 0. The left i 0 and the right is 9 (we are counting from 0)

// so [3,4] means the first square of this piece is on y 3 and x 4
// which means 3rd row, 4th cell (or more like 4th row and 5th cell because we're starting the count from zero).
// the piece spawns at arr [...] and is later moved.

// name is the name of the piece. Since I am passing the Pieces.sq I need the name to be a part of this object
// simply - I sometimes reference the name, and the way I pass this object to function nececitates that I have a name key value pair.
// name is immutable (never changed by any function).

// val - value (key value pair) of GameArray by default is 0. it will be changed to this value (1 for sq piece)
// When a piece occupies a place in GameArray it will chnge its value to the value of the piece.
// so an sq piece at coordinates from arr: [...] will chnange the value of
// [3,4], [3,5], [4,4], [4,5] of GameArray to 1.
// at CanvasCell (component in canvasBrain.js) a switch statements changes the className of the cell to an
// assigned class based on the value.
// 1 changes the class of a cell from "cell" to "cell yellow"
// in canvas style.css .yellow{...} changes how the cell is displayed
// that's how pieces are displayed at the board.
// In short: value designates the color of a cell.

// Checks - Before every movement the piece needs to check if it can move that way.
// check - checks if the piece can move down.
// check_left - checks if the piece can move to the left
// check_right - checks if the piece can move to the right.

// the "checks" are simply the coordinates of pieces that directly face the direction of movement:
// check is [4,4] and [4,5] because these two squares of the sq piece are "facing" down.
// [3,4] and [4,4] are facing left.
// [3,5] and [4,5] are facing right.

// check functions - at controls.js:
// checkMovedown - explaination with example:
//
//     [][]
//     [][]
//     {}{} <-- want to move here (down by 1)
//
// checkMoveDown will take the check:[...] and "ask" if GameArray (board of the game) is free at the coordinates
// the piece "wants" to move to.
// it will simply loop through the check array, and check if GameArray has an empty cell "below" the checked cells
// It does so by simply adding +1 to the y coordinate
// Well it doesn't actully add +1 because that mutates the array. And the way arrays are handled it would screw up
// basicly everything later on. (changeCheck functions, will be discussed later)

// so what it does is loop throgh the check array and:

// reference[piece.check[z][0] + 1][piece.check[z][1]].value !== 0

// reference is GameArray (array that generates the board).
// it checks if at y+1 of check of GameArray there is an empty cell.
// it returns true if it is empty
// and false if it's not, which prevents movement.
// if a move downwards can not be executed a cascade of functions "ends the turn" so to speak
// and spawns another piece.

// checkMoveLeft and checkMoveright:
//
//     checking the left -->   {}[][]{}   <--- checking the rigth
//                             {}[][]{}
//
// checking the left and rigth happen independantly. They are here together to keep them to a single "drawing"
// It works in a similar way:

// reference[piece.check[z][0]][piece.check[z][1] + / - 1].value !== 0

// reference is GameArray (array that generates the board).
// So this time check checks if x+1 coordinate (movement to the right) or x-1 (movement to the left)
// ...x+1 coordinate of GameArray is empty.
// if it is, the movement to the right is possible, and the function returns true.
//
// Important:
// after a successfull check of any direction a .map() will loop through ALL three checks and:
// change them to reflect upcomming movement:
// example:
//
// Let's say we want to move down from the starting location of the sq piece:
//
//
//       [3,4][3,5]
//       [4,4][4,5]
//       {5,4}{5,5} < --- moving here
//
// CheckMoveDown sees that the squares below are empty
// since it will return true movement downwards is inevitable and impossible to cancel anymore.
// so to prepare for the next move after moving down:
// check.map((x)=>x[0]+=1)
// check_right.map((x)=>x[0]+=1)
// check_left.map((x)=>x[0]+=1)
// This synchronises all the checks so the new checks are "moved" down!
// Quite a simple solution for checking subsequent movements
// so as a result:
//                (old would check 1 square higher! had to change that)
//      [4,4][4,5]{4,6}   <-- now wants to move here
//      [5,4][5,5]{5,6}
//
// Now if the next move is to the right the cheks will correctly check the space to the right of the sq piece
// what if check_right wasn't changed during the previous move:

// it would still be [3,5],[4,5]                         (incorrect)
// but after mapping that array they are [4,5] and [5,5] (correct)

// This simple mechanism trivialises movement in every direction.
// the real problem is rotation.
// rotation is discussed at leftRotator.js.

// changeCheck functions.
// Currently used only after rotation, designed to be the default way to "regenerate" correct checks after a piece moves
// In a smart way they find which squares of a piece are facing which direction, and returns them.
// them as in new, corrected check arrays.
// A JSON.parse(JSON.stringify(object)) is necessary because of how mutating arrays works in javascript.
// so if we have some crazy piece like:

// [[4,5],[5,5],[16,6],[2,6]]
// and want to generate new checks for downward movement
// changeCheckDown will return [[5,5], [16,6]] because these squares are the ones facing downwards.
// Checks have to be regenerated this way at the beginning of a render, because later on the way react (or js) work
// the current state is passed to the function, it's weird and I was getting weird results (not errors but faulty checks)
// for many days and found out that's the only way for them to work in situ so to speak.

// getFirstPiece and getNextPiece - randomly selects the first piece, and than based on the first piece, another piece.
// getNextPiece excludes previous piece from the selection, so you can't get the same piece twice in a row.
// may replayc Math.random with some library because its randomness is rather lacking in my experience.
const Pieces = {
    sq: {
        arr: [[3, 4], [3, 5], [4, 4], [4, 5]],
        name: "sq",
        val: 1,
        state: "def",
        check: [[4, 4], [4, 5]],
        check_left: [[3, 4], [4, 4]],
        check_right: [[3,5],[4,5]],
    },
    tp: {
        arr: [[3, 4], [4, 3], [4, 4], [4, 5]],
        name: "tp",
        val: 2,
        state: "def",
        check: [[4, 3], [4, 4], [4, 5]],
        check_left: [[3, 4], [4, 3]],
        check_right: [[3, 4], [4, 5]],
    },
    zr: {
        arr: [[3, 4], [3, 5], [4, 3], [4, 4]],
        name: "zr",
        val: 3,
        state: "def",
        check: [[4, 3], [4, 4], [3,5]],
        check_left: [[3, 4], [4, 3]],
        check_right: [[3, 5], [4, 4]],

    },
    zl: {
        arr: [[3, 3], [3, 4], [4, 4], [4, 5]],
        name: "zl",
        val: 4,
        state: "def",
        check: [[4, 4], [4, 5],[3,3]],
        check_left: [[3, 3], [4, 4]],
        check_right: [[3, 4], [4, 5]],
    },
    lr: {
        arr: [[3, 5], [4, 3], [4, 4], [4, 5]],
        name: "lr",
        val: 5,
        state:"def",
        check: [[4, 3], [4, 4], [4, 5]],
        check_left: [[3, 5], [4, 3]],
        check_right: [[3, 5], [4, 5]],
    },
    ll: {
        arr: [[3, 3], [4, 3], [4, 4], [4, 5]],
        name: "ll",
        val: 6,
        state: "def",
        check: [[4, 3], [4, 4], [4, 5]],
        check_left: [[3, 3], [4, 3]],
        check_right: [[3, 3], [4, 5]],
    },
    hp: {
        arr: [[4, 3], [4, 4], [4, 5], [4, 6]],
        name: "hp",
        val: 7,
        state: "def",
        check: [[4, 3], [4, 4], [4, 5], [4, 6]],
        check_left: [[4, 3]],
        check_right: [[4, 6]],
        alt: false
    }
}

const getFirstPiece = () => {
    const piece_array = ["sq", "tp", "zr", "zl", "ll", "lr", "hp"]
    let temp = Math.floor(Math.random() * piece_array.length)
    let clone = JSON.parse(JSON.stringify(Pieces[piece_array[temp]]))
    return clone;

}
const getNextPiece = (previous_piece) => {
    const piece_array = ["sq", "tp", "zr", "zl", "ll", "lr", "hp"];
    var second_array = piece_array.filter((x) => {
        return x !== previous_piece.name;
    });
    let temp = second_array[Math.floor(Math.random() * second_array.length)];
    let clone = JSON.parse(JSON.stringify(Pieces[temp]));
    return clone;
}
const changeCheckDown = (piece) => { //used to compute a new check array after a piece has rotaded! Brilliant
    //let piece = JSON.parse(JSON.stringify(array));
    let width = [];
    let check = [];
    for (let x = 0; x < piece.length; x++) {
        if (!width.includes(piece[x][1])) {
            width.push(piece[x][1]);
        }
    }
    width.forEach(function (x) {
        let temp = []
        for (let y = 0; y < piece.length; y++) {
            if (piece[y][1] === x) {
                temp.push(piece[y])
            }
        } temp.sort(function (a, b)
        {
            return a[0] - b[0];    
        });
        return check.push(temp.pop())
    })
    let clone = JSON.parse(JSON.stringify(check));
    return clone;
}
const changeCheckGhost = (piece) => { //used to compute a new check array after a piece has rotaded! Brilliant
    //let piece = JSON.parse(JSON.stringify(array));
    let width = [];
    let check = [];
    for (let x = 0; x < piece.length; x++) {
        if (!width.includes(piece[x][1])) {
            width.push(piece[x][1]);
        }
    }
    width.forEach(function (x) {
        let temp = []
        for (let y = 0; y < piece.length; y++) {
            if (piece[y][1] === x) {
                temp.push(piece[y])
            }
        } temp.sort(function (a, b)
        {
            return b[0] - a[0];    
        });
        return check.push(temp.pop())
    })
    let clone = JSON.parse(JSON.stringify(check));
    return clone;
}
const changeCheckSide = (piece, side) => { //used to change the check_ arrays when a piece rotates! brilliant
    //let piece = JSON.parse(JSON.stringify(array));
    let height = [];
    let check = [];
    for (let x = 0; x < piece.length; x++) {
        if (!height.includes(piece[x][0])) {
            height.push(piece[x][0]);
        }
    }
    height.forEach(function (x) {
        let temp = [];
        for (let y = 0; y < piece.length; y++) {
            if (piece[y][0] === x) {
                temp.push(piece[y]);
            }
        } temp.sort(function (a, b) {
            return a[1] - b[1];
        });
        if (side === "left") {
            return check.push(temp[0]);
        }
        if (side === "right") {
            return check.push(temp.pop());
        }
    })
    let clone = JSON.parse(JSON.stringify(check));
    return clone;
}
const findLowestY = (array) => {
    let height = [];
    for (let x = 0; x < array.length; x++) {
        if (!height.includes(array[x][0])) {
            height.push(array[x][0]);
        }
    }
    height.sort((a, b) => b - a);
    return height[0];
}
const findHeight = (array) => {
    let height = [];
    for (let x = 0; x < array.length; x++) {
        if (!height.includes(array[x][0])) {
            height.push(array[x][0]);
        }
    }
    return height
}
//check if can be spawn, and spawn the piece
const checkFirst = (piece, reference) => {
    for (let a = 0; a < piece.check.length; a++) {
        if (reference[piece.check[a][0]][piece.check[a][1]].value !== 0) {
            return false
        }
    } return true
}
const checkLast = (piece, reference) => {
    piece.arr.map((x) => x[0] -= 1);
    piece.check.map((x) => x[0] -= 1);
    piece.check_left.map((x) => x[0] -= 1);
    piece.check_right.map((x) => x[0] -= 1);
    console.log(piece, "logging piece after updates for last chance;")
    for (let b = 0; b < piece.check.length; b++) {
        if (reference[piece.check[b][0]][piece.check[b][1]].value !== 0) {
            return false
        }
    } return true
}
const checkSpawn = (piece, reference) => { //checks if the piece can be spawned. it's the condition of defeat in tetris.
    if (checkFirst(piece, reference)) {
        return true;
    } else {
        if (checkLast(piece, reference)) {
            return true
        } else {
            return false;
        }
    }
}
const spawnPiece = (piece, reference, setter) => {
    if (checkSpawn(piece, reference)) {
        setter((x) => {
            let temp = x;
            for (let y = 0; y < piece.arr.length; y++) {
                temp[piece.arr[y][0]][piece.arr[y][1]].value = piece.val
            }
            return x = temp;
        })
        return piece;
    } else {
        return false;
    }
}
export {
    Pieces, getFirstPiece, getNextPiece, changeCheckDown,
    changeCheckSide, changeCheckGhost, findLowestY, findHeight,
    spawnPiece,checkFirst, checkLast, checkSpawn
};