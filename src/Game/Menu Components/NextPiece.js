import * as React from "react";
const NextPiece = ({ getNextPiece, createMutableArray }) => {
    const [mutableArray, setMutableArray] = React.useState(createMutableArray)
    const boardArray = [0, 1, 2, 3, 4, 5]
    const cellArray = [0, 1, 2, 3]
    const firstRender = React.useRef(true)
    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = !firstRender.current
            return;
        }
        if (getNextPiece == null) {
            return;
        }
        setArray(getNextPiece);
        console.log(getNextPiece)
    },[getNextPiece])

    const setArray = (piece) => {
        setMutableArray((x) => {    
            let temp = createMutableArray();
            for (let y = 0; y < piece.arr.length; y++) {
                temp[piece.arr[y][0]-2][piece.arr[y][1]-3].value = piece.val
            }
            return x = temp;
        })
        return;
    }

    return (
        <div className="nextPiece">
            <table className="nextPieceTable">
                <tbody>
            {boardArray.map(function (x, index) {
                return (
                    <NextPieceRow array_prop={cellArray} row_reference={index} key={"row" + x} id={"r" + x} mutable_array={mutableArray }/>
                    )
            })}
                </tbody>
            </table>
        </div>
        )
}
const NextPieceRow = ({ row_reference, array_prop, mutable_array }) => {
    return (
        <tr className="nextPieceRow" id={"row " + row_reference }>
            {array_prop.map(function (y, index2) {
                return (
                    <NextPieceCell key={"r" + row_reference + "c" + y} id={"r" + row_reference + "c" + y} row_id={row_reference} cell_id={index2} mutableFinal={mutable_array } />
                    )
            }) }
        </tr >
        )
}
const NextPieceCell = ({ cell_id, row_id, mutableFinal }) => {
    var cellValue = mutableFinal[row_id][cell_id].value
    var color = []
    switch (cellValue) {
        case 0:
            color.push("");
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
    }
    return (
        <td className={"nextPieceCell " + color} id={"r" + row_id + "c" + cell_id }  value={cellValue}></td>
        )
}
export { NextPiece };