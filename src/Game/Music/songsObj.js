const songs = [
    {
        title: "Shiawase no Monosashi - Mariya Takeuchi, Vantage",
        audio: require("./Songs/Shiawase no Monosashi - Mariya Takeuchi, Vantage.mp3")
    },
    {
        title: "Emotional Prism - BigWave",
        audio: require("./Songs/BIGWAVE - Emotional Prism.mp3")
    },
    {
        title: "Remember Summer Days - Anri, Macross",
        audio: require("./Songs/Remember Summer Days - Anri, Macross.mp3")
    },
    {
        title: "Selfish High Heels - Macross, Yung Bae",
        audio: require("./Songs/Selfish High Heels - Macross, Yung Bae.mp3")
    },
    {
        title: "Plastic Love - Mariya Takeuchi, night tempo",
        audio: require("./Songs/Plastic Love - Mariya Takeuchi, night tempo.mp3")
    },
    {
        title: "Desired - Last Dance Of The Night",
        audio: require("./Songs/Desired - Last Dance Of The Night.mp3")
    },
    {
        title: "I Can't Stop The Loneliness - Anri, night tempo",
        audio: require("./Songs/I Can't Stop The Loneliness - Anri, night tempo.mp3")
    },
]
const generatePlaylist = (arr) => {
    let temp = arr.length
    let temp2 = [];
    let temp3 = [];
    for (let x = 0; x < temp; x++) {
        temp2.push(x);
    };
    for (let x = 0; x < temp; x++) {
        if (temp2.length === 1) {
            temp3.push(temp2[0]);
            break;
        }
        let tempI = Math.floor(Math.random() * temp2.length);
        temp3.push(temp2[tempI]);
        temp2.splice(tempI, 1);
    }
    return temp3;
};
export { songs, generatePlaylist };