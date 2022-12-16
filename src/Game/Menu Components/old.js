let old = {
    js: ```
<div className="controlsBox side">
                <div className="keysTop">
                    <div className="keyContainer">
                        <img src={escKey} className="squareKey" alt="escKey" />
                    </div>
                    <div className="keyContainer" style={{ width:"60%" }}>
                        <ArrowRight width="25%" className="svgRight" />
                        <div className="keyText right" style={{ width: "100%", bottom: "50%",left:"30%" } }>Pause, unpause, close open menus</div>
                    </div>
                    <div className="keyContainer">
                        <img src={qKey} className="squareKey" alt="qKey" />
                    </div>
                    <div className="keyContainer">
                        <ArrowRight width="45%" className="svgRight" />
                        <div className="keyText right">Rotate left</div>
                    </div>
                    <div className="keyContainer">
                        <img src={eKey} className="squareKey" alt="eKey" />
                    </div>
                </div>
                <div className="keysText">
                    <div className="keyContainer">
                        <div className="keyText up">Move left</div>
                        <ArrowUp className="svgUp"/>
                    </div>
                    <div className="keyContainer">
                        <div className="keyText up">Move down</div>
                        <ArrowUp className="svgUp" />
                    </div>
                    <div className="keyContainer">
                    </div>
                    <div className="keyContainer">
                        <img src={aKey} className="squareKey" alt="aKey" />
                    </div>
                    <div className="keyContainer">
                        <img src={sKey} className="squareKey" alt="sKey" />
                    </div>
                    <div className="keyContainer">
                        <img src={dKey} className="squareKey" alt="dKey" />
                    </div>
                </div>
                <div className="keysBottom">
                    <div className="keyContainer">
                    </div>
                    <div className="keyContainer">
                        <div className="keyText curved">Rotate right</div>
                    </div>
                    <div className="keyContainer">
                        <ArrowLeftCurved className="svgLeftCurved"/>
                    </div>
                    <div className="keyContainer">
                        <img src={zKey} className="squareKey" alt="cKey" />
                    </div>
                    <div className="keyContainer">
                        <ArrowRight width="45%" className="svgRight" />
                        <div className="keyText right">Rotate left</div>
                    </div>
                    <div className="keyContainer">
                        <img src={cKey} className="squareKey" alt="cKey" />
                    </div>
                </div>
            </div>

            <div className="controlsBox center">
                <div className="keysTop">
                    <div className="spaceContainer">
                        <ArrowLeft width="16%" className="svgLeft" />
                        <div className="keyText left">previous song</div>
                    </div>
                    <div className="spaceContainer">
                        <ArrowRight width="16%" className="svgRight"/>
                        <div className="keyText right">Rotate right</div>
                    </div>
                </div>
                <div className="keysText">
                    <div className="spaceContainer">
                    </div>
                    <div className="spaceContainer">
                        <ArrowRight width="16%" className="svgRight" />
                        <div className="keyText right">Move right</div>
                    </div>
                </div>
                <div className="keysBottom">
                    <div className="spaceContainer">
                        <div className="keyText up">Move to the very bottom</div>
                        <ArrowUp className="svgUp"/>
                    </div>
                    <div className="spaceContainer">
                        <img src={spaceBar} className="spaceKey" alt="spaceBar"/>
                    </div>
                </div>
            </div>

            <div className="controlsBox side">
                <div className="keysTop">
                    <div className="keyContainer">
                        <img src={oKey} className="squareKey" alt="oKey" />
                    </div>
                    <div className="keyContainer">
                        <ArrowLeft className="svgLeft" alt="arrowLeft" />
                        <div className="keyText left">next song</div>
                    </div>
                    <div className="keyContainer">
                        <img src={pKey} className="squareKey" alt="pKey" />
                    </div>
                    <div className="keyContainer">
                    </div>
                    <div className="keyContainer">
                    </div>
                    <div className="keyContainer">
                    </div>
                </div>
                <div className="keysText">

                </div>
                <div className="keysBottom">
                    <div className="keyContainer">
                        <div className="keyText up">Move left</div>
                        <ArrowUp className="svgUp" />
                    </div>
                    <div className="keyContainer">
                        <div className="keyText up">Move down</div>
                        <ArrowUp className="svgUp" />
                    </div>
                    <div className="keyContainer">
                        <div className="keyText up">Move right</div>
                        <ArrowUp className="svgUp" />
                    </div>
                    <div className="keyContainer">
                        <img src={arrowLeft} className="squareKey" alt="arrowLeft" />
                    </div>
                    <div className="keyContainer">
                        <img src={arrowDown} className="squareKey" alt="arrowDown" />
                    </div>
                    <div className="keyContainer">
                        <img src={arrowRight} className="squareKey" alt="arrowRight" />
                    </div>
                </div>
            </div>

```,
    style: ```
.controlsBox {
    font-size:26px;
    display: flex;
    flex-direction: column;
    width: 33%;
    box-sizing: border-box;
    padding: 1% 0.5% 1% 0.5%;
    align-items: stretch;
}
.keysTop {
    display:flex;
    height:33%;
    flex-wrap:wrap;
}
.keysText {
    display: flex;
    height: 33%;
    flex-wrap: wrap;
}

.keysBottom {
    display: flex;
    height: 33%;
    flex-wrap: wrap;
}
.keyContainer {
    box-sizing:border-box;
    height: 50%;
    width: 32%;
}
.keyContainer > img {
    border: 2px solid #2369ff;
    border-radius: 11%;
    background-color: white;
    position: relative;
    width: 75%;
    left: 18%;
}
.spaceContainer{
    box-sizing:border-box;
    height:50%;
    width:100%;
}
.spaceContainer>img{
    border-radius:9%;
    background-color:#ffffffde;
    position:relative;
    width:100%;
    height:95%;
}
.spaceContainer>.keyText.right{
    position:relative;
    display:inline;
    left:-2.5%;
    bottom:16%;
}
.spaceContainer>.svgRight{
    position:relative;
    top:7.5%;
    left:-5%;
}
.keyContainer>.svgRight{
    position:relative;
    top:7.5%;
}
.keyContainer>.keyText.right{
    position:relative;
    width:40%;
    display:inline-block;
    vertical-align:central;
    left:5%;
    line-height:23px;


}
.spaceContainer > .svgLeft {
    position:relative;
    left:5%;
    top:9%;
    float:right;
}
.spaceContainer > .keyText.left {
    position: relative;
    top: 20%;
    float: right;
}
.keyContainer > .keyText.left {
    float: right;
    position: relative;
    top: 10%;
    left: 3%;
}
.keyContainer>.svgLeft{
    float:right;
    position:relative;
    width:50%;
    top:10%;
    left:10%;

}
.keyContainer>.svgUp{
    float:right;
    position:relative;
    top:15%;
    right:25%;
    height:40%;
}
.keyContainer>.keyText.up{
    position:relative;
    top:10%;
    text-align:center;
    float:right;
    width:80%;
    line-height:23px;

}
.keyContainer>.keyText.curved{
    line-height:23px;
    position:absolute;
    width:5%;
    bottom:19%;
    left:17.5%;
}
.keyContainer>.svgLeftCurved{
    position:absolute;
    transform:rotate(180deg) scaleX(-1);
    bottom:17%;
    left:23.5%;
}
.spaceContainer>.keyText.up{
    text-align:center;
    position:relative;
    right:1%;
    top:10%;
}
.spaceContainer>.svgUp{
    position:absolute;
    height:7%;
    bottom:17%;
    left:47%;
}
```
}