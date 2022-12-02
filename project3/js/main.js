"use strict";
const app = new PIXI.Application({
    width: 600,
    height: 600
});

document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

let stage;

//game variables
let startScene, chosenBoard, score, boardWidth, boardHeight, tileWidth, selectedTile, desiredTile, hoverTile;
let gameScene, waveNum;

let tiles = [,];
let pieces = [];

//loading assets
app.loader.
    add([
            //images
            "images/pawn.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();




function setup(){
    stage = app.stage;

    startScene = new PIXI.Container();
    stage.addChild(startScene);

    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    createLabelsandButtons();

    app.ticker.add(gameLoop);


}

function createLabelsandButtons(){
    

    let startLabel1 = new PIXI.Text("Siege of the");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 32,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 2
    });
    startLabel1.x = 125;
    startLabel1.y = 50;
    startScene.addChild(startLabel1);

    let startLabel2 = new PIXI.Text("Board");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 3
    });
    startLabel2.x = 175;
    startLabel2.y = 70;
    startScene.addChild(startLabel2);

    let playButton = new PIXI.Text("Play");
    playButton.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 40,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 3
    })
    playButton.x = 200;
    playButton.y = 400;
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.on('pointerup', startGame);
    playButton.on('pointerover', e => e.target.alpha = 0.7);
    playButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(playButton);
}

function startGame(){
    startScene.visible = false;
    gameScene.visible = true;
    waveNum = 1;
    score = 0;
    tileWidth = 50;
    buildBoard();
    console.log("starting game");
}

function gameLoop(){

}

function buildBoard(){
    let layout = document.querySelector("#boards").value;
    if(layout == "classic"){
        boardWidth = 8;
        boardHeight = 8;
        for(let i = 0; i < boardHeight; i++){
            for(let j = 0; j < boardWidth; j++){

                let graphic = new PIXI.Graphics();

                let unitTile = new Tile(j, i, false, false, "empty", graphic);

                if(i % 2 == 1){
                    if(j % 2 == 0){
                        unitTile.graphic.beginFill(0xAAFFAA);
                    }
                    if(j % 2 == 1){
                        unitTile.graphic.beginFill(0xFFFFFF);
                    }
                }else{
                    if(j % 2 == 1){
                        unitTile.graphic.beginFill(0xAAFFAA);
                    }
                    if(j % 2 == 0){
                        unitTile.graphic.beginFill(0xFFFFFF);
                    }
                }
                
                unitTile.graphic.lineStyle(2,0x000000, 0.5);
                unitTile.graphic.drawRect(0,0,tileWidth,tileWidth);
                unitTile.graphic.endFill();
                unitTile.graphic.x = 100 + j * tileWidth;
                unitTile.graphic.y = 100 + i * tileWidth;

                unitTile.graphic.interactive = true;
                unitTile.graphic.buttonMode = true;
                unitTile.graphic.on('pointerup', testTile);
                unitTile.graphic.on('pointerover', e => {e.target.alpha = 0.8; e.target.lineStyle(4,0xDD0000,1); hoverTile = unitTile;});
                unitTile.graphic.on('pointerout', e => {e.currentTarget.alpha = 1.0; e.currentTarget.lineStyle(2,0x000000, 0.5);});

                gameScene.addChild(unitTile.graphic);

               

                tiles[j,i] = unitTile;


            }
        }
        let pawn = new PIXI.Graphics();
        pawn.beginFill(0x0000FF);
        pawn.drawCircle(tileWidth/2,tileWidth/2,20);
        pawn.endFill();
        pawn.x = tiles[3,3].graphic.x;
        pawn.y = tiles[3,3].graphic.y;
         gameScene.addChild(pawn);

        tiles[3,3].content = new Pawn(3, 3, "pawn", "home", pawn);
        tiles[3,3].full = true;
        tiles[3,3].viable = false;
    }

}

function testTile(){
    //console.log(hoverTile);
    if(hoverTile.full && hoverTile.content != "empty"){
        selectedTile = hoverTile;
    selectedTile.graphic._lineStyle = new PIXI.LineStyle({width: 4, color: 0xDD0000, alpha: 1});
    getMoves();
    } 
    if(hoverTile.viable){
        desiredTile = hoverTile;
    } 
}

function getMoves(){
    for(let i = 0; i < selectedTile.content.moveset.length; i++){
        let move = selectedTile.content.moveset[i];
        if(selectedTile.content.x + move[0] > 0 && selectedTile.content.x + move[0] < boardWidth && selectedTile.content.y + move[1] > 0 && selectedTile.content.y + move[1] < boardHeight){
            console.log(tiles[selectedTile.content.x + move[0], selectedTile.content.y + move[1]]);
            tiles[selectedTile.content.x + move[0],selectedTile.content.y + move[1]].viable = true;
        }
        
    }
}
