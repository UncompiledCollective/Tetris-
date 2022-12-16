import * as React from "react";
const ScoreBoard = ({ currentLevel, linesCleared, resetLinesCleared, gameOn, Text, lang }) => {
    console.log("ScoreBoard renders")
    const [isChanged, setIsChanged] = React.useState(false);
    const FirstRenderRef = React.useRef(true);
    const ScoreObj = React.useRef({
        Score: 0,
        lines_4: 0,
        lines_3: 0,
        lines_2: 0,
        lines_1: 0,
        lines_total: 0,
    }
        )
    const calculateScore = () => {
        console.log("calculate score runs.")
        switch (linesCleared) {
            case 1:
                ScoreObj.current.lines_1 += 1;
                ScoreObj.current.Score += 40 * (currentLevel+1);
                break;
            case 2:
                ScoreObj.current.lines_2 += 1;
                ScoreObj.current.Score += 100 * (currentLevel + 1);
                break;
            case 3:
                ScoreObj.current.lines_3 += 1;
                ScoreObj.current.Score += 300 * (currentLevel + 1);
                break;
            case 4:
                ScoreObj.current.lines_4 += 1;
                ScoreObj.current.Score += 1200 * (currentLevel + 1);
                break;
        };
        ScoreObj.current.lines_total += linesCleared;
        return;
    }
    React.useEffect(() => {
        if (FirstRenderRef.current) {
            FirstRenderRef.current = false;
            return;
        }
        if (!linesCleared) {
            return;
        }
        calculateScore();
        resetLinesCleared(null)
        return;
    }, [linesCleared])
    useRefreshScore(FirstRenderRef, gameOn, ScoreObj, setIsChanged);
    return (
        <div className="scoreBoard">
            <table className="scoreBoardTable">
                <tbody>
                    <tr>
                        <th colSpan="2">{Text[lang].scoreBoard.score }</th>
                    </tr>
                    <tr>
                        <td>{Text[lang].scoreBoard.total}</td>

                        <td>{ScoreObj.current.Score}</td>
                    </tr>
                    <tr>
                        <td>
                            <InternalTable whichOn={[true, true, true, true]}/>
                        </td>
                        <td>{ScoreObj.current.lines_4}</td>
                    </tr>
                    <tr>
                        <td>
                            <InternalTable whichOn={[true, false, true, true]} />
                        </td>
                        <td>{ScoreObj.current.lines_3}</td>
                    </tr>
                    <tr>
                        <td>
                            <InternalTable whichOn={[true, false, true, false]} />
                        </td>
                        <td>{ScoreObj.current.lines_2}</td>
                    </tr>
                    <tr>
                        <td>
                            <InternalTable whichOn={[false, false, true, false]} />
                        </td>
                        <td>{ScoreObj.current.lines_1}</td>
                    </tr>
                    <tr>
                        <td>{Text[lang].scoreBoard.lines_total}</td>
                        <td>{ScoreObj.current.lines_total}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        )
}
const InternalTable = ({whichOn}) => {
    const first = whichOn[0]
    const second = whichOn[1]
    const third = whichOn[2]
    const forth = whichOn[3]
    return (
        <div className="internalTableDiv">
            <table className="internalTable">
                <tbody>
                    <tr>
                        <IndicatorCell lightUp={first} />
                        <IndicatorCell lightUp={second}/>
                    </tr>
                    <tr>
                        <IndicatorCell lightUp={third} />
                        <IndicatorCell lightUp={forth} />
                    </tr>
                </tbody>
            </table>
        </div>
        )
}
const IndicatorCell = ({lightUp}) => {
    return (
        <>
        <td className={`${lightUp ? "light" : ""}`}>&nbsp;</td>
        </>
            )
}
const LevelIndicator = ({currentLevel, Text, lang}) => {

    return (
        <div className="levelIndicator">
            <span className="levelIndicatorText">{Text[lang].scoreBoard.level} {currentLevel}</span>
        </div>
        )
}
const useRefreshScore = (firstRender, gameOn, scoreObj, resetState) => {
    React.useEffect(() => {
        if (firstRender.current) {
            return;
        }
        if (gameOn === false) {
            remakeScoreObj(scoreObj);
            console.log(scoreObj, "logging score object");
            return;
        }
    },[gameOn])
}
const remakeScoreObj = (obj) => {
    obj.current.Score = 0;
    obj.current.lines_4 = 0;
    obj.current.lines_3 = 0;
    obj.current.lines_2 = 0;
    obj.current.lines_1 = 0;
    obj.current.lines_total = 0;
    return;
}
export { ScoreBoard, LevelIndicator };