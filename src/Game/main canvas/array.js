import * as React from "react";
const GameOfFunction = () => {
    let array = [];
    let temp = [];
    for (let x = 0; x < 10; x++) {
        temp.push({
            value: 0,
            motion: false
        });
    }
    let y = 0;
    while (y < 23) {
        array.push(temp);
        y++;
    }
    return JSON.parse(JSON.stringify(array));
};
// encountered a very peculiar problem with using an array generated this way. Hard to explain, but when changing value of a single "cell"
// all the cells that share the index would change their values too. Example:
// let array = GameOfFunction();
// array[1][5].valaue = 1 ==> the value of every array of this 2d array with index 5 would become 1
// console.log(array[1][5].value, array[2][5].value, array[5][5].valaue) will output 1, 1, 1, instead of 1, 0 and a 0.
// after searching for a solution I console.log-ed the array, copied the output, put it into a variable called "StartArray"
// after performing the following change of value:
// StartArray[1][5].valaue = 1;
// console.log(StartArray[1][5].value, StartArray[2][5].value, StartArray[19][5].value) ==> the outcome is 1, 0, 0 so this behavior no longer persists
// it's a very strange phenomena.
// I will export StartArray and use it for the rest of the app.
// GameOfFunction stays here along this explaination as a comment.
// This StartArray is a constant and will be use to generate a 10 x 20 Table.
// However a mutable stated variable will be generated from StartArray too. 
// I will use that variable to mutate selected cells of that table as I see fit.
const StartArray = [
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ]
]
const StartArray2 = [
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ],
    [
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false },
        { value: 0, motion: false }
    ]
]
const nextPieceArray = [
    [
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 }
    ],
    [
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 }
    ],
    [
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 }
    ],
    [
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 }
    ],
    [
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 }
    ],
    [
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 },
        { value: 0 }, { value: 0 }
    ]
]
const createNextPieceArray = () => {
    let clone = JSON.parse(JSON.stringify(nextPieceArray))
    return clone;
}
export { StartArray, StartArray2, createNextPieceArray, GameOfFunction }