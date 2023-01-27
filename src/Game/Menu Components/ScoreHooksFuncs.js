import * as React from "react";
const remakeScoreObj = (obj) => {
    obj.current.Score = 0;
    obj.current.lines_4 = 0;
    obj.current.lines_3 = 0;
    obj.current.lines_2 = 0;
    obj.current.lines_1 = 0;
    obj.current.lines_total = 0;
    obj.current.name = "";
    obj.current.avatar = "";
    return;
}
const calculateScore = (ScoreObj, linesCleared, currentLevel) => {
    switch (linesCleared) {
        case 1:
            ScoreObj.current.lines_1 += 1;
            ScoreObj.current.Score += 40 * (currentLevel + 1);
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

const useUpdateScore = (FirstRenderRef, lines, obj, level, resetLinesCleared, calculateScore) => {
    React.useEffect(() => {
        if (FirstRenderRef.current) {
            return;
        }
        if (!lines) {
            return;
        }
        calculateScore(obj, lines, level);
        resetLinesCleared(null)
        return;
    }, [lines])
}
const useRefreshScore = (firstRender, gameOn, scoreObj, setHoldScore, remakeScoreObj) => {
    React.useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (gameOn === "over") {
            setHoldScore(scoreObj.current) //not sure if setting it right now is necessary.
            return;
        }
        if (gameOn === false) {
            remakeScoreObj(scoreObj);
            return;
        }
    }, [gameOn])
}



const isNameTrue = (string) => {
    if (string.length > 13) {
        return "long";
    }
    if (string.length < 6) {
        return "short";
    }
    if (regTests.spaceBoundry.test(string)) {
        return "spaceBound"
    }
    if (string.match(regTests.manySpace) && string.match(regTests.manySpace).length > 1) {
        return "spaceCount"
    }
    if (string.match(regTests.illicitChar)) {
        return "special"
    }
    if (!regTests.letter.test(string)) {
        return "letter"
    }
    return true;
}
const regTests = {
    spaceBoundry: /^\s|\s$/,
    illicitChar: /[^\w\s$#^*\(\)-:;<>~]/g,
    manySpace: /\s/g,
    letter: /[A-Za-z]/i
}

const useDisplayError = (isCorrect, setIsCorrect) => {
    React.useEffect(() => {
        if (!isCorrect) {
            return;
        }
        if (isCorrect === true) {
            let delay = setTimeout(() => { setIsCorrect("pop") }, 1400)
            return;
        }
        let delay2 = setTimeout(() => { setIsCorrect(false) }, 2400);
        return;
    }, [isCorrect])
}
export { calculateScore, useUpdateScore, useRefreshScore, remakeScoreObj, isNameTrue, useDisplayError };