const rightRotatorCheck = {
    tp: {
        def: (array, reference) => {
            if (array.arr[3][0] === 22) { //H
                return false;
            }
            if (reference[array.arr[1][0] + 1][array.arr[1][1] + 1].value !== 0) { //A
                return false;
            }
            return true;
        },
        //def done
        rI: (array, reference) => {
            if (array.arr[3][1] === 9) {//B
                if (reference[array.arr[0][0]][array.arr[0][1] - 1].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3  ][1] - 1].value === 0
                ) {//C
                    return "alt";
                } else {
                    return false;
                }
            }
            if (reference[array.arr[1][0] - 1][array.arr[1][1] + 1].value !== 0) {//E
                if (array.arr[0][1] === 0) {                                      //G
                    return false;
                }
                if (reference[array.arr[0][0]][array.arr[0][1] - 1].value === 0 && //f
                    reference[array.arr[3][0]][array.arr[3][1] - 1].value === 0) {
                    return "alt";
                } else {
                    return false
                }
            }
            return true;
        }, rII: (array, reference) => {
            if (reference[array.arr[1][0] - 1][array.arr[1][1] - 1].value !== 0) {
                return false
            }
            return true;
        }, rIII: (array, reference) => {
            if (array.arr[2][1] === 0) {
                if (reference[array.arr[3][0]][array.arr[3][1] + 1].value === 0 &&
                    reference[array.arr[0][0]][array.arr[0][1] + 1].value === 0 
                ) {
                    return "alt";
                } else {
                    return false;
                }
            }
            if (reference[array.arr[1][0] + 1][array.arr[1][1] - 1].value !== 0) {
                if (array.arr[0][1] === 9) {                                      //G
                    return false;
                }
                if (reference[array.arr[0][0]][array.arr[0][1] + 1].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] + 1].value === 0) {
                    return "alt";
                } else {
                    return false;
                }
            }
            return true
        },
    },
    zr: {
        def: (array, reference) => {
            if (array.arr[3][0] === 22) { //hit bottom.
                return false
            }
            if (reference[array.arr[1][0]+1][array.arr[1][1]].value !== 0) {
                return false;
            } if (reference[array.arr[3][0] + 1][array.arr[3][1] + 1].value !== 0) {
                return false;
            }
            return true;
        },
        rI: (array, reference) => {
            if (array.arr[3][1] === 9) {
                if (reference[array.arr[0][0]][array.arr[0][0] - 1].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] + 1].value === 0
                ) {
                    return "alt";
                } else {
                    return false
                }
            }
            if (reference[array.arr[3][0]-1][array.arr[3][1]].value !== 0) {
                return false;
            } if (reference[array.arr[3][0]-1][array.arr[3][1] + 1].value !== 0) {//Q
                if (array.arr[0][0] === 0) {
                    return false
                } if (
                    reference[array.arr[0][0]][array.arr[0][1] - 1].value === 0// only one condition because
                ) {                                                                // Q above already checks if that's
                    return "alt";                                                  // free space
                }
                return false;
            }
            return true;
        },
        rII: (array, reference) => {
            if (reference[array.arr[3][0]][array.arr[3][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[3][0] - 1][array.arr[3][1] - 1].value !== 0) {
                return false;
            }
            return true;
        },
        rIII: (array, reference) => {
            if (array.arr[3][1] === 0) {
                if (reference[array.arr[0][0]][array.arr[0][1] + 1].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] - 1].value === 0
                ) {
                    return "alt";
                }
                return false;

            }
            if (reference[array.arr[1][0]][array.arr[1][1]-1].value !== 0) {
                return false;
            } if (reference[array.arr[3][0] + 1][array.arr[3][1] - 1].value !== 0) {
                if (array.arr[0][1] === 9) {
                    return false
                } if (reference[array.arr[0][0]][array.arr[0][1] + 1].value === 0
                ) {
                    return "alt";
                }
                return false;
            }
            return true;
        },
    },
    zl: {
        def: (array, reference) => {
            if (array.arr[2][0] === 22) { //hit the bottom, can't rotate in this state.
                return false
            }
            if (reference[array.arr[2][0] - 1][array.arr[2][1]+1].value !== 0) {//3,3 becomes 5,3, so just add 2 to his y coordinate
                return false
            } if (reference[array.arr[2][0] + 1][array.arr[2][1]].value !== 0) {//3,4 becomes a 4,3
                return false
            }
            return true
        },
        rI: (array, reference) => {
            if (array.arr[2][1] === 9) {
                if (reference[array.arr[3][0]][array.arr[3][1] - 1].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] - 2].value === 0
                ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[3][0]][array.arr[3][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[3][0] + 1][array.arr[3][1] + 1].value !== 0) {
                if (array.arr[1][1] === 0) {
                    return false;
                }
                if (reference[array.arr[3][0]][array.arr[3][1] - 2].value === 0) {
                    return "alt";
                }
                return false;
            }
            return true
        },
        rII: (array, reference) => {
            if (reference[array.arr[2][0] - 1][array.arr[2][1]].value !== 0) {
                return false
            } if (reference[array.arr[2][0] + 1][array.arr[2][1] - 1].value !== 0) {
                return false
            }
            return true
        },
        rIII: (array, reference) => {
            if (array.arr[2][1] === 0) {
                if (reference[array.arr[1][0] + 1][array.arr[1][1]].value === 0 &&
                    reference[array.arr[1][0] + 1][array.arr[1][1] + 1].value === 0
                ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[3][0]][array.arr[3][1] + 1].value !== 0) {
                return false
            }
            if (reference[array.arr[2][0]][array.arr[2][1] - 1].value !== 0) {
                if (array.arr[1][1] === 9) { 
                    return false
                }
                if (reference[array.arr[1][0] + 1][array.arr[1][1] + 1].value === 0 
                ) {                                                    
                    return "alt";
                }
                return false;
            } return true
        }
    },
    lr: {
        def: (array, reference) => {
            if (array.arr[2][0] === 22) {//hit the bottom
                return false;
            }
            if (reference[array.arr[0][0]][array.arr[0][1] - 1].value !== 0) {
                return false
            } if (reference[array.arr[2][0] + 1][array.arr[2][1]].value !== 0) {
                return false
            } if (reference[array.arr[3][0] + 1][array.arr[3][1]].value !== 0) {
                return false
            }
            return true
        },
        rI: (array, reference) => {
            if (array.arr[2][1] === 9) {// hit the right border
                if (reference[array.arr[2][0]][array.arr[2][1] - 1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 
                ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[2][0]][array.arr[2][1] - 1].value !== 0) {
                return false
            }
            if (reference[array.arr[3][0]][array.arr[1][1] + 1].value !== 0 ||
                reference[array.arr[2][0]][array.arr[2][1] + 1].value !== 0
            ) {
                if (array.arr[0][1] === 0) {
                    return false; //there's a border to the left so alt rotation would be impossible anyway
                }
                if (reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0
                ) {
                    return "alt";
                }
                return false
            }
            return true
        },
        rII: (array, reference) => {
            if (reference[array.arr[2][0] + 1][array.arr[2][1]].value !== 0) {
                return false
            } if (reference[array.arr[2][0] - 1][array.arr[2][1]].value !== 0) {
                return false
            } if (reference[array.arr[3][0] - 1][array.arr[3][1]].value !== 0) {
                return false
            }
            return true
        },
        rIII: (array, reference) => {
            if (array.arr[2][1] === 0) {
                if (reference[array.arr[2][0]][array.arr[2][1] + 1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] + 2].value === 0 
                ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[2][0]][array.arr[2][1] + 1].value !== 0) {
                return false
            } if (reference[array.arr[3][0] - 1][array.arr[3][1] + 1].value !== 0 ||
                reference[array.arr[1][0] + 1][array.arr[1][1] - 1].value !== 0
            ) {
                if (array.arr[0][1] === 9) {
                    return false;
                } if (
                    reference[array.arr[2][0]][array.arr[2][1] + 2].value === 0
                ) {
                    return "alt";
                }
                return false
            }
            return true
        },

    },
    ll: {
        def: (array, reference) => {
            if (array.arr[2][0] === 22) {
                return false;
            }
            if (reference[array.arr[0][0]][array.arr[0][1] + 1].value !== 0) {
                return false
            } if (reference[array.arr[0][0]][array.arr[0][1] + 2].value !== 0) {
                return false
            } if (reference[array.arr[2][0] + 1][array.arr[2][1]].value !== 0) {
                return false
            }
            return true;
        },
        rI: (array, reference) => {
            if (array.arr[2][1] === 9) {
                if (reference[array.arr[2][0]][array.arr[2][1] - 1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] - 2].value === 0
                ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[2][0]][array.arr[2][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[3][0]][array.arr[3][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[2][0]][array.arr[2][1] + 1].value !== 0) {
                if (array.arr[0] === 0) {
                    return false;
                }
                if (reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] - 2].value === 0//condition present in classic tetris.
                ) {                    //abscent in modern. The piece will be less "rotable" so to speak.
                    return "alt";
                }
                return false;
            }
            return true;
        },
        rII: (array, reference) => {
            if (reference[array.arr[2][0] + 1][array.arr[2][1]].value !== 0) {
                return false
            } if (reference[array.arr[2][0] - 1][array.arr[2][1]].value !== 0) {
                return false
            } if (reference[array.arr[3][0] + 1][array.arr[3][1]].value !== 0) {
                return false
            }
            return true;
        },
        rIII: (array, reference) => {
            if (array.arr[2][1] === 0) {
                if (reference[array.arr[2][0]][array.arr[2][1] + 1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] + 2].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] + 2].value === 0
                ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[2][0]][array.arr[2][1] + 1].value !== 0) {
                return false;
            }if (reference[array.arr[3][0]][array.arr[3][1] + 1].value !== 0) {
                return false;
            }
            if (reference[array.arr[2][0]][array.arr[2][1] - 1].value !== 0){
                if (array.arr[0][1] === 9) {
                    return false;
                } if (reference[array.arr[2][0]][array.arr[2][1] + 2].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] + 2].value === 0//intentional condition 
                ) {                                    //present in classic tetris. Abscent in modern. Sometimes important during the game
                    return "alt";
                }
                return false;
            }
            return true;
        },

    },
    hp: {
        def: (array, reference) => {
            if (array.arr[0][0] === 22) {
                return false;
            }
            if (array.arr[0][0] === 21) {
                if (reference[array.arr[2][0] + 1][array.arr[2][1]].value === 0 &&
                    reference[array.arr[2][0] - 1][array.arr[2][1]].value === 0 &&
                    reference[array.arr[2][0] - 2][array.arr[2][1]].value === 0
                ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[2][0] + 1][array.arr[2][1]].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] - 1][array.arr[2][1]].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] + 2][array.arr[2][1]].value !== 0) {
                if (reference[array.arr[2][0] - 2][array.arr[2][1]].value === 0
                ) {
                    return "alt";
                }
                return false;
            }
            return true;
        },
        rI: (array, reference) => {
            if (array.arr[0][1] === 0) {
                return false;
                //    if (reference[array.arr[2][0]][array.arr[2][1] + 1].value === 0 &&
                //        reference[array.arr[2][0]][array.arr[2][1] + 2].value === 0 &&
                //        reference[array.arr[2][0]][array.arr[2][1] + 3].value === 0
                //        ) {
                //        return "alt";
                //    } return false;
            } //uncomment this to make the piece move away form the board and rotate.
            if (array.arr[0][1] === 9) {
                return false;
                //    if ( // if I uncomment this the piece will be able to move away from the edege of the board and rotate. Currently it needs a single free square between the piece and board to do that
                //        reference[array.arr[2][0]][array.arr[2][1] - 1].value === 0 &&
                //        reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 &&
                //        reference[array.arr[2][0]][array.arr[2][1] - 3].value === 0 
                //        ) {
                //        return "alt3";
                //    } return false;
            }
            if (array.arr[0][1] === 8) {
                if (
                    reference[array.arr[1][0]][array.arr[2][1] - 1].value === 0 &&
                    reference[array.arr[1][0]][array.arr[2][1] - 2].value === 0 &&
                    reference[array.arr[1][0]][array.arr[2][1] + 1].value === 0
                ) {
                    return "alt"; // moves to the left
                } return false;
            }
            if (reference[array.arr[1][0]][array.arr[1][1] + 1].value !== 0) {
                return false;
            } if (reference[array.arr[1][0]][array.arr[1][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[1][0]][array.arr[1][1] + 2].value !== 0) {
                if (array.arr[0][1] === 0 || array.arr[0][1] === 1) {
                    return false;
                }
                if (
                    reference[array.arr[1][0]][array.arr[1][1] - 2].value === 0
                ) {
                    return "alt";
                }
                return false;
            }
            return true;
        },
        rII: (array, reference) => {
            if (array.arr[0][0] === 22) { //edge of the board, I don't want him to check and see an undefined value
                return false;             //for GameArray[23][X].valaue (it ends at 22).
            }
            if (reference[array.arr[2][0] - 2][array.arr[0][1]].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] - 1][array.arr[3][1]].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] + 1][array.arr[2][1]].value !== 0) {
                //if (reference[array.arr[1][0] - 3][array.arr[1][1]].value === 0) { //Go to the Addendum
                //    return "alt"; 
                //}
                return false;
            }
            return true;
        },
        rIII: (array, reference) => {
            if (array.arr[0][1] === 0 || array.arr[0][1] === 9) {
                return false;
            }
            if (array.arr[0][1] === 1) {
                if (
                    reference[array.arr[1][0]][array.arr[1][1] - 1].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] + 1].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] + 2].value === 0
                ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[1][0]][array.arr[1][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[1][0]][array.arr[1][1] + 1].value !== 0) {
                return false;
            } if (reference[array.arr[1][0]][array.arr[1][1] - 2].value !== 0) {
                if (array.arr[0][1] === 8 || array.arr[0][1] === 9) {
                    return false
                } if (
                    reference[array.arr[1][0]][array.arr[1][1] - 3].value === 0
                ) {
                    return "alt";
                }
                return false;
            }
            return true;
        },

    }
}



const rightRotator = {
    tp: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                };
                rightRotator.tp.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                rightRotator.tp.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] += 1;
            array.arr[1][0] -= 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 1;
            array.state = "rIII";
            return true;
        },
        rI: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] += 1;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 1;
            array.state = "def";
            return true;
        },

        rII: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] -= 1;
            array.arr[1][0] += 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 1;
            array.state = "rI";
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] -= 1;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },
    },
    zr: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                rightRotator.zr.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                rightRotator.zr.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] += 1;
            array.arr[1][0] += 2;
            array.arr[2][0] -= 1;
            array.arr[2][1] += 1;
            array.state = "rIII"
            return true;
        }, rI: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] += 1;
            array.arr[1][1] += 2;
            array.arr[2][0] -= 1;
            array.arr[2][1] -= 1;
            array.state = "def"
            return true;
        },
        rII: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] -= 1;
            array.arr[1][0] -= 2;
            array.arr[2][0] += 1;
            array.arr[2][1] -= 1;
            array.state = "rI"
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] -= 1;
            array.arr[1][1] -= 2;
            array.arr[2][0] += 1;
            array.arr[2][1] += 1;
            array.state = "rII";
            return true;
        },

    },
    zl: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                rightRotator.zl.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                rightRotator.zl.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][1] += 2;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 1;
            array.state = "rIII";
            return true;
        },
        rI: (array) => {
            array.arr[0][0] -= 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 1;
            array.state = "def";
            return true;
        },
        rII: (array) => {
            array.arr[0][1] -= 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 1;
            array.state = "rI";
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] += 2;
            array.arr[1][0] += 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },
    },
    lr: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                rightRotator.lr.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                rightRotator.lr.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][0] += 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 1;
            array.state = "rIII";
            return true;
        },
        rI: (array) => {
            array.arr[0][1] += 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 1;
            array.state = "def";
            return true;
        },
        rII: (array) => {
            array.arr[0][0] -= 2;
            array.arr[1][0] += 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 1;
            array.state = "rI";
            return true;
        },
        rIII: (array) => {
            array.arr[0][1] -= 2;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },

    },
    ll: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                rightRotator.ll.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                rightRotator.ll.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][1] += 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 1;
            array.state = "rIII";
            return true;
        },
        rI: (array) => {
            array.arr[0][0] -= 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 1;
            array.state = "def";
            return true;
        },
        rII: (array) => {
            array.arr[0][1] -= 2;
            array.arr[1][0] += 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 1;
            array.state = "rI";
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] += 2;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },

    },
    hp: {
        alt: {
            def: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][0] -= 1;
                }
/*                array.alt = true;*/
                rightRotator.hp.def(array);
            },
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                rightRotator.hp.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                rightRotator.hp.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] += 2;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[2][0] += 2;
            array.arr[3][1] -= 1;
            array.state = "rIII"
            return true;
        },
        rI: (array) => {
            array.arr[0][0] -= 2;
            array.arr[0][1] -= 1;
            array.arr[2][0] -= 1;
            array.arr[2][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 2;
            array.state = "def";
            return true;
        },
        rII: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] -= 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 2;
            array.arr[3][1] += 1;
            array.state = "rI";
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] += 2;
            array.arr[0][1] += 1;
            array.arr[2][0] -= 1;
            array.arr[2][1] -= 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 2;
            if (array.alt) {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][0] += 1;
                }
            }
            array.state = "rII";    
            return true;
        },

    }
}
export { rightRotator, rightRotatorCheck };