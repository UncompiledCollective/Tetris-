// I better write some explaination before I forget how all this shit works.
// so bascily leftRotatorCheck will check if a rotation is possible - if there's enough space for the piece to rotate
// Every piece has a name that defines what the piece is - square is sq, the horizontal 4 piece is hp and so on.
// Every piece has a state key-value pair.
// default state is how the piece spawns.
// state denotes at which rotation a piece currently is.
// every piece has 4 states except for sq piece which has only a default state.
// rotation of sq pieces is prevented at the event listener level.
// I couldn't find any function that would allow me to generate rotations so I had to write all this manually.
// tp piece (looks like an inverted uppec case T) has the easiest checking logic since it needs to only know
// if there is enough place to move a single one of it's square the "leg" of the T.
// A - function checks if the board at CanvasBrain has a free cell there to move the "leg"
// returns true or false depending on the outcome.

// More complicated logic and conditions forward:
// if a piece is at the edge of the board sometimes a movement is not possible.
// in that case the game attempts to move the piece away from the edge and subsequently rotate.
// to do that leftRotatorCheck checks if the piece at the state in question is at the border:
// a visual representation of the situation in question:
//      ||                ||                                                  ||
//    []||                ||                                                []||
//  [][]||   ==>    [][][]||  normally that move is not possible because: [][]{}<-- this is where the piece would
//    []||            []  ||                                                []||    move so to speak. too bad
//      ||                ||                                                  ||    there's no more board there.
// I hope this visual demonstration makes it clear why I do that.
// so let's move on
// B - leftRotatorCheck checks if the piece in question is at the border:
// C - if so it checks if there is enough space to move the piece to the left:
// D - returns "alt" if rotation is possible after moving the piece away.
// The result is used by trueRotateLeft() of canvasBrain.js
// if failed the piece is not moved and false is returned.

// a similar behavior happens when a piece encounters another piece (occupied space insead of the game border):
// the piece in question will be made of {} instead of [] in this example:
//               ||                                                     ||
//               ||                                                     ||
//       {}[][]  ||                                               [][]  ||
//     {}{}[]    || <--- another piece is in the way        {}{}{}[]    || <-- it moves away and rotates
//       {}[][]  ||      of rotation                          {}  [][]  ||
//         [][][]||                                               [][][]||
//       [][][][]||                                             [][][][]||
//===================================================================================================================
// E - method checks if the space to rotate is occupied, finds that it is.
// F - it checks if there is space to move away and rotate.
// G - before G it checks if the piece is at the opposite border.
// if a piece tries to find if there's space it will find undefined because there is no more board to the left of it
// it throws an error, but doesn't crash the program.
// may have put a try catch but decided to simply take this eventuality into account.
//
// Not every state of every piece has these problems.
// for example default state of T piece (tp) will never have any of these issues.
// well except trying to rotate when at the very bottom of the board.
// which I also take into account at H

// note: I don't check all the squares of T piece at A beacuse in this state they will all always be together at the edge
// of the board. It's not possible for only one of the 3 squares to be at the edge of the board.

// Afer a successfull rotation new checks are generated for the Piece.
// It is necessary to do that at the beginning of the next render, because of how mutating array works.
// so I wraped the execution of changeCheck functions in an event listener that recreates itself on every render.
// handy.

// Addendum - problematic hp piece [][][][];
// because of the interpretation of this piece it's behavior and logic are rather complicated.
// I have decided that if there is only one square of free space the rotation will not be possible.
// left some comments to uncomment to make it possible again.
// this means that the 4 piece can't rotate at the very edge of the board and needs a single square of free space
// just like in the original tetris (kindof, they had different interpretation of the piece.).
// should it be requested rotation of a piece in this sceneario will be added.

// Addendum II:
// floating flat piece problem:
// I've solved it with 3 lines of code (a for loop and an alt attribute for the hp piece.)
// there are 4 states of the 4 flat piece:
//    def                 rI                  rII                     rIII
//  {}{}{}{}           {}[]{}{}             {}{}{}{}                {}{}[]{}
//  [][][][]           {}[]{}{}             {}{}{}{}                {}{}[]{}
//  {}{}{}{}           {}[]{}{}             [][][][]                {}{}[]{}
//  {}{}{}{}           {}[]{}{}             {}{}{}{}                {}{}[]{}
//    ^^
//  This one is problematic
// Picture this piece at a distance of a single square from the bottom/another piece
//
//  {}{}{}{}
//  [][][][]
//  {}{}{}{}
//  ========   <-- can't rotate because we've hit the bottom.
// So the way to go is to move way the piece and than rotate it. simple right?
// well there's the problem.
// Should I apply the same logic as for other pieces that move away from an edge it will go from:
//
//    def                 rI                 rII                 rIII           def again
//  {}{}{}{}           {}[]{}{}            {}{}{}{}            {}{}[]{}         {}{}{}{}
//  {}{}{}{}    -->    {}[]{}{}   -->      {}{}{}{}     -->    {}{}[]{}  -->    [][][][]
//  [][][][]    -->    {}[]{}{}   -->      [][][][]     -->    {}{}[]{}  -->    {}{}{}{}
//  {}{}{}{}           {}[]{}{}            {}{}{}{}            {}{}[]{}         {}{}{}{}
//  ======================================================================================

// When we go back to def it is higher than it was before. 2 empty squares instead of one.
// that's what bad programmers from tetris online did.
// This way a 4 flat piece can be suspended indefinetly in the air, without ever hitting the bottom.
// I decided to correct thsi misstake and now the piece will end up like this:
//
//    def                 rI                 rII                 rIII           def again
//  {}{}{}{}           {}[]{}{}            {}{}{}{}            {}{}[]{}         {}{}{}{}
//  {}{}{}{}    -->    {}[]{}{}   -->      {}{}{}{}     -->    {}{}[]{}  -->    {}{}{}{}
//  [][][][]    -->    {}[]{}{}   -->      [][][][]     -->    {}{}[]{}  -->    [][][][]
//  {}{}{}{}           {}[]{}{}            {}{}{}{}            {}{}[]{}         {}{}{}{}
//  ======================================================================================
//
// I've done that by adding an alt attribute to hp piece at Pieces.js.
// ...,
///alt:false,
// after "bouncing" from the bottom alt is set to true;
// after that at rotation from rIII back to def a for loop activates.
// and moves the piece 1 square downwards.
const leftRotatorCheck = {
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

        rI: (array, reference) => {
            if (array.arr[3][1] === 9) {//B
                if (reference[array.arr[0][0]][array.arr[0][1] - 1].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] - 1].value === 0
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
                    reference[array.arr[1][0]][array.arr[1][1] - 1].value === 0 ) {
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
                if (reference[array.arr[0][0]][array.arr[0][1] + 1].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] + 1].value === 0
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
                    reference[array.arr[1][0]][array.arr[1][1] + 1].value === 0 ) {
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
            if (reference[array.arr[1][0]][array.arr[1][1] - 2].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] + 1][array.arr[2][1] + 1].value !== 0) {
                return false;
            }
            return true;
        },
        rI: (array, reference) => {
            if (array.arr[3][1] === 9) {
                if (reference[array.arr[0][0]-1][array.arr[0][1]-1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1]-1].value === 0 
                    ) {
                    return "alt";
                } else {
                    return false
                }
            }
            if (reference[array.arr[1][0] + 2][array.arr[1][1]].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] - 1][array.arr[2][1] + 1].value !== 0) {//Q
                if (array.arr[0][0] === 0) {
                    return false
                } if (
                    reference[array.arr[0][0] - 1][array.arr[0][1] - 1].value === 0// only one condition because
                ) {                                                                // Q above already checks if that's
                    return "alt";                                                  // free space
                }
                return false;
            }
            return true;
        },
        rII: (array, reference) => {
            if (reference[array.arr[1][0]][array.arr[1][1] + 2].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] - 1][array.arr[2][1] - 1].value !== 0) {
                return false;
            }
            return true;
        },
        rIII: (array, reference) => {
            if (array.arr[3][1] === 0) {
                if (reference[array.arr[0][0] - 1][array.arr[0][1] + 1].value === 0 &&
                    reference[array.arr[1][0] - 1][array.arr[1][1] + 1].value === 0
                    ) {
                    return "alt";
                }
                return false;

            }
            if (reference[array.arr[1][0] - 2][array.arr[1][1]].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] + 1][array.arr[2][1] - 1].value !== 0) {
                if (array.arr[0][1] === 9) {
                    return false
                } if (reference[array.arr[0][0] - 1][array.arr[0][1] + 1].value === 0
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
            if (reference[array.arr[0][0] + 2][array.arr[0][1]].value !== 0) {//3,3 becomes 5,3, so just add 2 to his y coordinate
                return false
            } if (reference[array.arr[1][0] + 1][array.arr[1][1] - 1].value !== 0) {//3,4 becomes a 4,3
                return false
            }
            return true
        },
        rI: (array, reference) => {
            if (array.arr[2][1] === 9) {
                if (reference[array.arr[1][0]][array.arr[1][1] - 1].value === 0 &&
                    reference[array.arr[0][0]][array.arr[0][1] + 1].value === 0
                    ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[1][0] + 1][array.arr[1][1] + 1].value !== 0) {
                return false;
            } if (reference[array.arr[0][0]][array.arr[0][1] + 2].value !== 0) {
                if (array.arr[1][1] === 0) {// border so alt rotation impossible
                    return false;
                }
                if (reference[array.arr[1][0]][array.arr[1][1] - 1].value === 0) {
                    return "alt";
                }
                return false;
            }
            return true
        },
        rII: (array, reference) => {
            if (reference[array.arr[0][0] - 2][array.arr[0][1]].value !== 0) {
                return false
            } if (reference[array.arr[1][0] - 1][array.arr[1][1] + 1].value !== 0) {
                return false
            }
            return true
        },
        rIII: (array, reference) => {
            if (array.arr[2][1] === 0) {
                if (reference[array.arr[0][0]][array.arr[0][1] - 1].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] + 1].value === 0
                    ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[1][0] - 1][array.arr[1][1] - 1].value !== 0) {//Q
                return false
            } 
            if (reference[array.arr[0][0]][array.arr[0][1] - 2].value !== 0) { 
                if (array.arr[1][1] === 9) { //if it's border it won't alt rotate anyway.
                    return false
                }
                if (reference[array.arr[1][0]][array.arr[1][1] + 1].value === 0 //only one condition because
                    ) {                                                    // Q already has checked the other
                    return "alt";
                }
                return false;
            }return true
        }
    },
    lr: {
        def: (array, reference) => {
            if (array.arr[2][0] === 22) {//hit the bottom
                return false;
            }
            if (reference[array.arr[0][0]][array.arr[0][1] - 2].value !== 0) {
                return false
            } if (reference[array.arr[1][0] + 1][array.arr[1][1] + 1].value !== 0) {
                return false
            } if (reference[array.arr[3][0] - 1][array.arr[3][1] - 1].value !== 0) {
                return false
            }
            return true
        },
        rI: (array, reference) => { 
            if (array.arr[2][1] === 9) {// hit the right border
                if (reference[array.arr[2][0]][array.arr[2][1]-1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1]-2].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1]-2].value === 0
                    ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[3][0] + 1][array.arr[3][1] - 1].value !== 0) {
                return false
            }
            if (reference[array.arr[0][0] + 2][array.arr[0][1]].value !== 0) {
                return false
            } if (reference[array.arr[1][0] - 1][array.arr[1][1] + 1].value !== 0) {
                if (array.arr[0][1] === 0) {
                    return false; //there's a border to the left so alt rotation would be impossible anyway
                }
                if (reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] - 2].value === 0
                    ) {
                    return "alt";
                }
                return false
            }
            return true
        },
        rII: (array, reference) => {
            if (reference[array.arr[0][0]][array.arr[0][1] + 2].value !== 0) {
                return false
            } if (reference[array.arr[1][0] - 1][array.arr[1][1] - 1].value !== 0) {
                return false
            } if (reference[array.arr[3][0] + 1][array.arr[3][1] + 1].value !== 0) {
                return false
            }
            return true
        },
        rIII: (array, reference) => {
            if (array.arr[2][1] === 0) {
                if (reference[array.arr[2][0]][array.arr[2][1] + 1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] + 2].value === 0 &&
                    reference[array.arr[1][0]][array.arr[1][1] + 2].value === 0
                    ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[0][0] - 2][array.arr[0][1]].value !== 0) {
                return false
            } if (reference[array.arr[3][0] - 1][array.arr[3][1] + 1].value !== 0) {
                return false
            } if (reference[array.arr[1][0] + 1][array.arr[1][1] - 1].value !== 0) {
                if (array.arr[0][1] === 9) {
                    return false;
                } if (reference[array.arr[1][0]][array.arr[1][1] + 2].value === 0 &&
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
            if (reference[array.arr[0][0] + 2][array.arr[0][1]].value !== 0) {
                return false
            } if (reference[array.arr[1][0] + 1][array.arr[1][1] + 1].value !== 0) {
                return false
            } if (reference[array.arr[3][0] - 1][array.arr[3][1] - 1].value !== 0) {
                return false
            }
            return true;
        },
        rI: (array, reference) => {
            if (array.arr[2][1] === 9) {
                if (reference[array.arr[2][0]][array.arr[2][1] - 1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 
                    ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[3][0] + 1][array.arr[3][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[1][0] - 1][array.arr[1][1] + 1].value !== 0 ||
                reference[array.arr[0][0] + 0][array.arr[0][1] + 2].value !== 0) {
                if (array.arr[0] === 0) {
                    return false;
                }
                if (reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] - 1].value === 0//condition present in classic tetris.
                    ) {                    //abscent in modern. The piece will be less "rotable" so to speak.
                    return "alt";
                }
                return false;
            }
            return true;
        },
        rII: (array, reference) => {
            if (reference[array.arr[0][0] - 2][array.arr[0][1]].value !== 0) {
                return false
            } if (reference[array.arr[1][0] - 1][array.arr[1][1] - 1].value !== 0) {
                return false
            } if (reference[array.arr[3][0] + 1][array.arr[3][1] + 1].value !== 0) {
                if (array.arr[0][1] === 0) {
                    return false;
                } if (reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 &&
                    reference[array.arr[0][0]][array.arr[0][1] - 1].value === 0
                    ) {
                    return "alt";
                }
                return false
            }
            return true;
        },
        rIII: (array, reference) => {
            if (array.arr[2][1] === 0) {
                if (reference[array.arr[2][0]][array.arr[2][1] + 1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] + 2].value === 0
                    ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[3][0] - 1][array.arr[3][1] + 1].value !== 0) {
                return false;
            }
            if (reference[array.arr[1][0] + 1][array.arr[1][1] - 1].value !== 0 ||
                reference[array.arr[0][0]][array.arr[0][1] - 2].value !== 0) {
                if (array.arr[0][1] === 9) {
                    return false;
                } if (reference[array.arr[2][0]][array.arr[2][1] + 2].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] + 1].value === 0//intentional condition 
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
                if (reference[array.arr[1][0] + 1][array.arr[1][1]].value === 0 &&
                    reference[array.arr[1][0] - 1][array.arr[1][1]].value === 0 &&
                    reference[array.arr[1][0] - 2][array.arr[1][1]].value === 0
                    ) {
                    return "alt";
                } return false;
            }
            if (reference[array.arr[2][0] + 1][array.arr[2][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[3][0] - 1][array.arr[3][1] - 2].value !== 0) {
                return false;
            } if (reference[array.arr[0][0] + 2][array.arr[0][1] + 1].value !== 0) {
                if (reference[array.arr[1][0] - 2][array.arr[1][1]].value === 0
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
                    reference[array.arr[2][0]][array.arr[2][1] - 1].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0 &&
                    reference[array.arr[2][0]][array.arr[2][1] + 1].value === 0
                    ) {
                    return "alt"; // moves to the left
                } return false;
            }
            if (reference[array.arr[1][0] + 1][array.arr[1][1] + 1].value !== 0) {
                return false;
            } if (reference[array.arr[3][0] + 2][array.arr[3][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[0][0] - 1][array.arr[0][1] + 2].value !== 0) {
                if (array.arr[0][1] === 0 || array.arr[0][1] === 1) {
                    return false;
                }
                if (
                    reference[array.arr[2][0]][array.arr[2][1] - 2].value === 0
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
            if (reference[array.arr[0][0] - 2][array.arr[0][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[3][0] - 1][array.arr[3][1] + 2].value !== 0) {
                return false;
            } if (reference[array.arr[2][0] + 1][array.arr[2][1] + 1].value !== 0) {
                //if (reference[array.arr[1][0] - 3][array.arr[1][1]].value === 0) { //Go to the Addendum
                //    return "alt"; 
                //}
                return false;
            }
            return true;
        },
        rIII: (array, reference) => {
            if (array.arr[0][1] === 0 || array.arr[0][1]===9) {
                return false;
            }
            if (array.arr[0][1] === 1) {
                if (
                    reference[array.arr[3][0]][array.arr[3][1] - 1].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] + 1].value === 0 &&
                    reference[array.arr[3][0]][array.arr[3][1] + 2].value === 0
                    ) {
                    return "alt";
                }return false;
            }
            if (reference[array.arr[1][0] - 1][array.arr[1][1] - 1].value !== 0) {
                return false;
            } if (reference[array.arr[3][0]][array.arr[3][1] + 1].value !== 0) {
                return false;
            } if (reference[array.arr[0][0] + 1][array.arr[0][1] - 2].value !== 0) {
                if (array.arr[0][1] === 8 || array.arr[0][1] === 9) {
                    return false
                } if (
                    reference[array.arr[3][0]][array.arr[3][1] - 3].value === 0
                    ) {
                    return "alt";
                }
                return false;
            } 
            return true;
        },

    }
}



const leftRotator = {
    tp: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                };
                leftRotator.tp.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                leftRotator.tp.rIII(array);
                }
        },
        def: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] -= 1;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 1;
            array.state = "rI";
            return true;
        },
        rI: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] += 1;
            array.arr[1][0] -= 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },

        rII: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] += 1;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 1;
            array.state = "rIII";
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] -= 1;
            array.arr[1][0] += 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 1;
            array.state = "def";
            return true;
        },
    },
    zr: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                leftRotator.zr.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++){
                    array.arr[q][1] += 1;
                }
                leftRotator.zr.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] -= 1;
            array.arr[1][1] -= 2;
            array.arr[2][0] += 1;
            array.arr[2][1] += 1;
            array.state = "rI"
            return true;
        }, rI: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] += 1;
            array.arr[1][0] += 2;
            array.arr[2][0] -= 1;
            array.arr[2][1] += 1;
            array.state = "rII"
            return true;
        },
        rII: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] += 1;
            array.arr[1][1] += 2;
            array.arr[2][0] -= 1;
            array.arr[2][1] -= 1;
            array.state = "rIII"
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] -= 1;
            array.arr[1][0] -= 2;
            array.arr[2][0] += 1;
            array.arr[2][1] -= 1;
            array.state = "def";
            return true;
        },

    },
    zl: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                leftRotator.zl.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                leftRotator.zl.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][0] += 2;
            array.arr[1][0] += 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 1;
            array.state = "rI";
            return true;
        },
        rI: (array) => {
            array.arr[0][1] += 2;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },
        rII: (array) => {
            array.arr[0][0] -= 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 1;
            array.state = "rIII";
            return true;
        },
        rIII: (array) => {
            array.arr[0][1] -= 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 1;
            array.state = "def";
            return true;
        },
    },
    lr: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                leftRotator.lr.rI(array);
            },
            rIII: (array)=>{
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                leftRotator.lr.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][1] -= 2;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 1;
            array.state = "rI";
            return true;
        },
        rI: (array) => {
            array.arr[0][0] += 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },
        rII: (array) => {
            array.arr[0][1] += 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 1;
            array.state = "rIII";
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] -= 2;
            array.arr[1][0] += 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 1;
            array.state = "def";
            return true;
        },

    },
    ll: {
        alt: {
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                leftRotator.ll.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                leftRotator.ll.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][0] += 2;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 1;
            array.state = "rI";
            return true;
        },
        rI: (array) => {
            array.arr[0][1] += 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 1;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },
        rII: (array) => {
            array.arr[0][0] -= 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] += 1;
            array.arr[3][1] += 1;
            array.state = "rIII";
            return true;
        },
        rIII: (array) => {
            array.arr[0][1] -= 2;
            array.arr[1][0] += 1;
            array.arr[1][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 1;
            array.state = "def";
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
                leftRotator.hp.def(array);
            },
            rI: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] -= 1;
                }
                leftRotator.hp.rI(array);
            },
            rIII: (array) => {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][1] += 1;
                }
                leftRotator.hp.rIII(array);
            }
        },
        def: (array) => {
            array.arr[0][0] += 2;
            array.arr[0][1] += 1;
            array.arr[2][0] += 1;
            array.arr[2][1] -= 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] -= 2;
            array.state = "rI"
            return true;
        },
        rI: (array) => {
            array.arr[0][0] -= 1;
            array.arr[0][1] += 2;
            array.arr[1][0] += 1;
            array.arr[1][1] += 1;
            array.arr[3][0] += 2;
            array.arr[3][1] -= 1;
            array.state = "rII";
            return true;
        },
        rII: (array) => {
            array.arr[0][0] -= 2;
            array.arr[0][1] -= 1;
            array.arr[2][0] += 1;
            array.arr[2][1] += 1;
            array.arr[3][0] -= 1;
            array.arr[3][1] += 2;
            array.state = "rIII";
            return true;
        },
        rIII: (array) => {
            array.arr[0][0] += 1;
            array.arr[0][1] -= 2;
            array.arr[1][0] -= 1;
            array.arr[1][1] -= 1;
            array.arr[2][0] -= 2;
            array.arr[3][1] += 1;
            if (array.alt) {
                for (let q = 0; q < 4; q++) {
                    array.arr[q][0] += 1;
                }
            }
            array.state = "def";
            return true;
        },

    }
}
export { leftRotator, leftRotatorCheck };