
const checkMoveLeft = (piece, reference) => {
    for (let x = 0; x < piece.check_left.length; x++) {
        if (piece.check_left[x][1] === 0) {
            return false
        };
        if (reference[piece.check_left[x][0]][piece.check_left[x][1] - 1].value !== 0) {
            return false
        }
    }
    piece.check_left.map((x) => x[1] -= 1)
    piece.check_right.map((x) => x[1] -= 1)
    piece.check.map((x) => x[1] -= 1)
    return true;
}
const checkMoveRight = (piece, reference) => {
    for (let x = 0; x < piece.check_right.length; x++) {
        if (piece.check_right[x][1] === 9) {

            return false
        }
        if (reference[piece.check_right[x][0]][piece.check_right[x][1] + 1].value !== 0) {

            return false
        }
    }
    piece.check_left.map((x) => x[1] += 1)
    piece.check_right.map((x) => x[1] += 1)
    piece.check.map((x) => x[1] += 1)
    return true;
}

const checkMoveDown = (piece, reference) => {//checks if the piece can be moved down. It can't if it encounters the last row or another piece is below
    for (let z = 0; z < piece.check.length; z++) {
        if (piece.check[z][0] === 22) {
            return false
        }
        if (reference[piece.check[z][0] + 1][piece.check[z][1]].value !== 0) {
            return false
        }
    }
    piece.check_left.map((x) => x[0] += 1)
    piece.check_right.map((x) => x[0] += 1)
    piece.check.map((x) => x[0] += 1)
    return true
}
const checkRow = (arr) => { //checks if a row is full and can be deleted. If an unoccupied cell(with value 0) is detected returns true.
    for (let z = 0; z < 10; z++) { // 10 is the number of cells in a row.
        if (arr[z].value === 0) {
            return false;
        }
    }
    return true;
}
const checkIfAnyFull = (piece, reference, fullRowRef) => {
    let height = [];
    let full = [];
    for (let x = 0; x < piece.arr.length; x++) {
        if (!height.includes(piece.arr[x][0])) {
            height.push(piece.arr[x][0])
        }
    }
    for (let y = 0; y < height.length; y++) {
        if (checkRow(reference[height[y]])) {
            full.push(height[y])
        }
    }
    if (full.length > 0) { // specifies to execute only if there were any rows deleted
        full.sort((a, b) => b - a); // sorting rows from the lowest to highest.
        fullRowRef.current = full;
        return true
    } else {
        return false
    }
}
const restoreBoard = (setter, template) => {
    setter((x) => template());
    return;
}
export {checkMoveDown, checkMoveRight, checkMoveLeft, checkIfAnyFull, restoreBoard };