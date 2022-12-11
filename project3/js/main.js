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
let startScene, chosenBoard, score, selectedTile, desiredTile, hoverTile, selectedPiece;
let gameScene, waveNum, turnLabel, waveLabel;

let gameOverLabel, takenLabel, lostLabel;

let endScene;

let turnNum, pturnNum, piecesTaken, piecesLost;

//Public Board Info
let boardWidth, boardHeight, tileWidth;
let offX, offY;

//Object Trackers and Handlers
let tiles = [,];
let enemyPieces = [];
let homePieces = [];
let pieceMoved, enemyPieceMoved;

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

    endScene = new PIXI.Container();
    endScene.visible = false;
    stage.addChild(endScene);


    createLabelsandButtons();
    

    app.ticker.add(gameLoop);


}

function createLabelsandButtons(){
    

    let startLabel1 = new PIXI.Text("Siege of the");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 60,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 2
    });
    startLabel1.x = 75;
    startLabel1.y = 150;
    startScene.addChild(startLabel1);

    let startLabel2 = new PIXI.Text("Board");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 120,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 3
    });
    startLabel2.x = 175;
    startLabel2.y = 200;
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

    turnNum=1;
    turnLabel = new PIXI.Text();
    turnLabel.style = new PIXI.TextStyle({
        fill : 0xFFFFFF,
        fontSize:20
    });
    turnLabel.x = 50;
    turnLabel.y = 50;
    gameScene.addChild(turnLabel);
    updateTurnLabel();

    waveLabel = new PIXI.Text();
    waveLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 20
    });
    waveLabel.x = 150;
    waveLabel.y = 50;
    gameScene.addChild(waveLabel);
    

    gameOverLabel = new PIXI.Text("Game Over :(");
    gameOverLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily:"Futura",
    });
    gameOverLabel.x = 50;
    gameOverLabel.y = 100;
    endScene.addChild(gameOverLabel);

    takenLabel = new PIXI.Text();
    takenLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 40,
        fontFamily: "Futura"
    });
    takenLabel.x = 140;
    takenLabel.y = 300;
    endScene.addChild(takenLabel);

    lostLabel = new PIXI.Text();
    lostLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 40,
        fontFamily: "Futura"
    });
    lostLabel.x = 145;
    lostLabel.y = 350;
    endScene.addChild(lostLabel);
}

function startGame(){
    startScene.visible = false;
    gameScene.visible = true;
    waveNum = 1;
    updateWaveLabel();
    score = 0;
    tileWidth = 50;
    piecesLost = 0;
    piecesTaken = 0;
    pieceMoved = false;
    createBoard();
    console.log("starting game");
}

function gameLoop(){
    if(gameScene.visible){
        //once player selects a piece and new tile
        if(selectedPiece != undefined && desiredTile != undefined){
            checkAndMove();
            selectedPiece = undefined;
                selectedTile = undefined;
                desiredTile = undefined;
       }
    
       if(pieceMoved){
        //after player has moved
            for(let h = 0; h < homePieces.length; h++){
                for(let e = 0; e < enemyPieces.length; e++){
                    if(homePieces[h].bX == enemyPieces[e].bX && homePieces[h].bY == enemyPieces[e].bY){
                        enemyPieces[e].isAlive = false;
                        piecesTaken++;
                        gameScene.removeChild(enemyPieces[e]);
                    }
                }
            }
    
            enemyPieces = enemyPieces.filter(e =>e.isAlive);
    
            if(enemyPieces.length > 0){
                findEnemyMove();
                
                for(let h = 0; h < homePieces.length; h++){
                    for(let e = 0; e < enemyPieces.length; e++){
                        if(homePieces[h].bX == enemyPieces[e].bX && homePieces[h].bY == enemyPieces[e].bY){
                            homePieces[h].isAlive = false;
                            piecesLost++;
                            gameScene.removeChild(homePieces[h]);
                        }
                    }
                }
    
                homePieces = homePieces.filter(h =>h.isAlive);
    
                
            }
            else if(enemyPieces.length == 0 && homePieces.length > 0){
                generateNextWave();
            }
            if(homePieces.length > 0) nextTurn();
    
            if(homePieces.length == 0){
                //GAME OVER!!!
                gameScene.visible = false;
                endScene.visible = true;
                updateScores();
            }
    
       }
    }
}


function nextTurn(){ //called at the end of a turn to pr4epare the board for the next turn
    selectedTile = undefined;
    pieceMoved = false;
    enemyPieceMoved = false;

    turnNum++;
    updateTurnLabel();
}

function updateTurnLabel(){
    turnLabel.text = `Turns: ${turnNum}`;
}

function updateWaveLabel(){
    waveLabel.text = `Wave ${waveNum}`;
}

function updateScores(){
    lostLabel.text = `You lost ${piecesLost} pieces`;
    takenLabel.text = `You took ${piecesTaken} pieces`;
}

//sees if tile is viable
function testTile(){
    if(selectedPiece == undefined){
        selectedTile = hoverTile;
        selectedPiece = getPieceOnTile();
    }else if(selectedPiece && selectedTile){
         desiredTile = hoverTile;
    }
    
}

function checkAndMove(){
    for(let m = 0; m < selectedPiece.moveset.length; m++){
        //tests if it is a valid move for selected piece
        if(desiredTile.x == selectedPiece.bX + selectedPiece.moveset[m][0] && desiredTile.y == selectedPiece.bY + selectedPiece.moveset[m][1]){
            //check for if there is a team piece 
            let spaceFull = false;
            for(let p = 0; p < homePieces.length; p++){
                if(selectedPiece.bX + selectedPiece.moveset[m][0] == homePieces[p].bX && selectedPiece.bY + selectedPiece.moveset[m][1] == homePieces[p].bY){
                    spaceFull = true;
                }
            }
            //if no allies in desired space
            if(!spaceFull){
                selectedPiece.Move(desiredTile.x,desiredTile.y);
                pieceMoved = true;
            }
        }
    }
    
}

//determines enemies next move
function findEnemyMove(){
    //scans if a enemy piece can take a pawn
    for(let e = 0; e < enemyPieces.length; e++){
        for(let m = 0; m < enemyPieces[e].moveset.length; m++){
            for(let h = 0; h < homePieces.length; h++){
                if(enemyPieces[e].bX + enemyPieces[e].moveset[m][0] == homePieces[h].bX && enemyPieces[e].bY + enemyPieces[e].moveset[m][1] == homePieces[h].bY){
                    let allyPresent = false;
                    for(let f = 0; f < enemyPieces.length; f++){
                        if(enemyPieces[e].bX + enemyPieces[e].moveset[m][0] == enemyPieces[f].bX && enemyPieces[e].bY + enemyPieces[e].moveset[m][1] == enemyPieces[f].bY) allyPresent = true;
                    }
                    if(!allyPresent){
                        //takes pawn
                        enemyPieces[e].Move(enemyPieces[e].bX + enemyPieces[e].moveset[m][0], enemyPieces[e].bY + enemyPieces[e].moveset[m][1]);
                        enemyPieceMoved = true;
                        break;
                    }
                    
                }
            }
            if(enemyPieceMoved) break;
        }
        if(enemyPieceMoved) break;
    }
    //if the piece hasn't taken a pawn move to a new position
    if(!enemyPieceMoved){
        while(!enemyPieceMoved){
            let randP = enemyPieces[Math.floor(Math.random()*enemyPieces.length)];
            let randM = randP.moveset[Math.floor(Math.random()*randP.moveset.length)];
            if(randP.bX + randM[0] >= 0 && randP.bX + randM[0] < boardWidth && randP.bY + randM[1] >= 0 && randP.bY + randM[1] < boardHeight){
                let allyPresent = false;
                for(let f = 0; f < enemyPieces.length; f++){
                    if(randP.bX + randM[0] == enemyPieces[f].bX && randP.bX + randM[1] == enemyPieces[f].bY){
                        allyPresent = true;
                    }
                }
                if(!allyPresent){
                    randP.Move(randP.bX + randM[0], randP.bY + randM[1]);
                    enemyPieceMoved = true;
                }
            }
        }
    }
}

//gathers dimension for type of board player chose
function queryBoardDim(){
    let layout = document.querySelector("#boards").value;
    if(layout == "classic"){
        boardHeight = 8;
        boardWidth = 8;
        offX = 100;
        offY = 100;
    }
    if(layout == "small"){
        boardHeight = 4;
        boardWidth = 4;
        offX = 200;
        offY = 200;
    }
    if(layout == "demo"){
        boardHeight = 10;
        boardWidth = 10;
        offX = 75;
        offY = 75;
    }
}

//creates the tiles on the board 
function createBoard(){
    queryBoardDim();
        for(let i = 0; i < boardHeight; i++){
            
            for(let j = 0; j < boardWidth; j++){

                let graphic = new PIXI.Graphics();

                let unitTile = new Tile(j, i, false, false, "empty", graphic);

                //responsible for checkerboard
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
                unitTile.graphic.x = offX + j * tileWidth;
                unitTile.graphic.y = offY + i * tileWidth;

                //sets up interactivity
                unitTile.graphic.interactive = true;
                unitTile.graphic.buttonMode = true;
                unitTile.graphic.on('pointerup', testTile);
                unitTile.graphic.on('pointerover', e => {e.target.alpha = 0.8; e.target.lineStyle(4,0xDD0000,1); hoverTile = unitTile;});
                unitTile.graphic.on('pointerout', e => {e.currentTarget.alpha = 1.0; e.currentTarget.lineStyle(2,0x000000, 0.5);});

                gameScene.addChild(unitTile.graphic);       

                tiles[j,i] = unitTile;
            }
        }
    loadBoard();
}

function loadBoard(){
    let layout = document.querySelector("#boards").value;
    //loader for classic map
    if(layout == "classic"){
        //setting base values for team pieces
        createPiece(4, 4, "king", "home");
        createPiece(3, 7, "pawn", "home");
        createPiece(2, 2, "knight", "home");
        createPiece(7, 6, "rook", "home");

        //setting base values for enemy pieces
        createPiece(1, 1, "king", "enemy");
    }
    //loader for small map
    if(layout == "small"){
        //setting base values for team pieces
        createPiece(0, 3, "knight", "home");
        createPiece(2, 3, "rook", "home");

        //setting base values for enemy pieces
        createPiece(3, 0, "king", "enemy");
    }
    //loader for demo map
    if(layout == "demo"){
        createPiece(0,1,"dummy","enemy");

        createPiece(1,8,"king","home");
        createPiece(3,8, "pawn","home");
        createPiece(5,8,"knight","home");
        createPiece(7,8,"queen","home");
        createPiece(9,9,"terror","home");

    }
}

function generateNextWave(){
    let layout = document.querySelector("#boards").value;
    waveNum++;
    
    //generation for classic map
    if(layout == "classic"){
        if(waveNum < 4 && waveNum > 1){
            //enemies
            createPiece(3, 0, "king", "enemy");
            for(let i = 0; i <= waveNum; i++){
                createPiece(i*2, 1, "pawn", "enemy");
            }
            if(waveNum == 3){
                createPiece(4,0,"knight","enemy");
            }

            //allies
            createPiece(waveNum*2-1,7,"pawn", "home");
            if(waveNum == 4){
                createPiece(3, 7, "knight", "home");
            }
        }
        if(waveNum == 4){
            for(let i = 0; i < 4;i++){
                createPiece(i*2,0,"knight","enemy");
                createPiece(7-i,7,"pawn","home");
            }
        }

        if(waveNum == 5){
            for(let i = 0; i < boardWidth; i++){
                createPiece(i, 0, "pawn", "enemy");
            }
            createPiece(0,7,"knight","home");
        }
        if(waveNum == 6){
            createPiece(2,0, "rook", "enemy");
            createPiece(1,0,"king","enemy");
            createPiece(0,1,"pawn","enemy");
            createPiece(1,1,"pawn","enemy");
            createPiece(2,1,"pawn","enemy");
            createPiece(7,0, "queen", "enemy");
        }
        if(waveNum == 7){
            for(let i = 0; i < 4; i++){
                createPiece(i*2+1, 0, "rook", "enemy");
                createPiece(i*2,1,"king","enemy");
            }
        }
        if(waveNum == 8){
            for(let i = 0; i < boardWidth; i++){
                createPiece(i, 0, "pawn", "enemy");
            }
            createPiece(0,0,"rook","enemy");
            createPiece(7,0,"rook","enemy");
            createPiece(0,3,"queen","enemy");
            createPiece(0,4,"king", "enemy");
            createPiece(2,0,"knight","enemy");
            createPiece(5,0,"knight","enemy");
        }
        if(waveNum == 9){
            createPiece(0,3,"terror","enemy");

            createPiece(7,1,"pawn","home");
            createPiece(4,3,"king","home");
            createPiece(6,7,"rook","home");
        }
        if(waveNum >= 10){
            createPiece(Math.floor(Math.random()*7),Math.floor(Math.random()*7),"terror","enemy");
            let piece = Math.floor(Math.random()*6);
            if(piece == 0){
                createPiece(2,0,"pawn","enemy");
                createPiece(3,7,"pawn","home");
            }else if(piece == 1){
                createPiece(2,0,"knight","enemy");
                createPiece(3,7,"knight","home");
            }else if(piece == 2){
                createPiece(2,0,"king","enemy");
                createPiece(3,7,"king","home");
            }else if(piece == 3){
                createPiece(2,0,"rook","enemy");
                createPiece(3,7,"rook","home");
            }else if(piece == 4){
                createPiece(2,0,"queen","enemy");
                createPiece(3,7,"queen","home");
            }else if(piece == 5){
                createPiece(2,0,"terror","enemy");
            }
        }
        
        updateWaveLabel();
    }
    //generation for small map
    if(layout == "small"){
        if(waveNum == 2){
            createPiece(0,0,"king","enemy");
            createPiece(2,3,"king","enemy");

            createPiece(0,3,"pawn","home");
        }
        if(waveNum == 3){
            createPiece(3,0,"knight","enemy");
            createPiece(2,0,"knight","enemy");
            createPiece(3,1,"knight","enemy");

            createPiece(2,3,"king", "home");
            createPiece(3,3,"pawn","home");
        }
        if(waveNum == 4){
            createPiece(3,0,"rook","enemy");
            createPiece(2,0,"pawn","enemy");
        }
        if(waveNum == 5){
            createPiece(0,0,"pawn","enemy");
            createPiece(1,0,"pawn","enemy");
            createPiece(2,0,"pawn","enemy");
            createPiece(3,0,"pawn","enemy");
        }
        if(waveNum == 6){
            createPiece(3,0,"queen","enemy");
            createPiece(1,2,"king","enemy");

            createPiece(0,3,"pawn","home");
            createPiece(1,3,"pawn","home");
        }
        if(waveNum == 7){
            createPiece(3,0,"rook","enemy");
            createPiece(3,3,"rook","enemy");

            createPiece(0,2,"queen","home");
        }
        if(waveNum == 8){
            createPiece(0,0,"queen","home");
            createPiece(1,0,"knight","home");
            createPiece(2,0,"pawn","enemy");

            createPiece(1,3,"rook","home");
            createPiece(0,3,"king","home");
        }
        if(waveNum == 9){
            createPiece(0,1,"pawn","enemy");
            createPiece(1,1,"pawn","enemy");
            createPiece(2,1,"pawn","enemy");
            createPiece(3,1,"pawn","enemy");
            createPiece(0,0,"knight","enemy");

            createPiece(3,3,"king","home");
            createPiece(3,2,"pawn","home");
        }
        if(waveNum >= 10){
            createPiece(3,0,"terror","enemy");
            let piece = Math.floor(Math.random()*6);
            if(piece == 0){
                createPiece(2,0,"pawn","enemy");
                createPiece(3,2,"pawn","home");
            }else if(piece == 1){
                createPiece(2,0,"knight","enemy");
                createPiece(3,2,"knight","home");
            }else if(piece == 2){
                createPiece(2,0,"king","enemy");
                createPiece(3,2,"king","home");
            }else if(piece == 3){
                createPiece(2,0,"rook","enemy");
                createPiece(3,2,"rook","home");
            }else if(piece == 4){
                createPiece(2,0,"queen","enemy");
                createPiece(3,2,"queen","home");
            }else if(piece == 5){
                createPiece(2,0,"terror","enemy");
            }
        }
        updateWaveLabel();
    }

    if(layout == "demo"){
        createPiece(waveNum%9,0,"dummy","enemy");
        createPiece((waveNum + 3)%9,0,"dummy","enemy");
        createPiece((waveNum + 6)%9,0,"dummy","enemy");
    }
    
}

function getPieceOnTile(){
        for(let i = 0; i < homePieces.length; i++){
            if(homePieces[i].bX == selectedTile.x && homePieces[i].bY == selectedTile.y){
                return homePieces[i];
            }
        }
        return undefined;
}

function createPiece(bX, bY, name, team){
    let moveSet;
    //presets of movement paths for all the different pieces
    if(name == "king"){
        moveSet = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
    }
    if(name == "pawn" && team == "home"){
        moveSet = [[0,-1],[1,-1],[-1,-1]];
    }
    if(name == "pawn" && team == "enemy"){
        moveSet = [[0,1],[1,1],[-1,1]];
    }
    if(name == "knight"){
        moveSet = [[-2,1],[-2,-1],[2,1],[2,-1],[1,2],[-1,2],[1,-2],[-1,-2]];
    }
    if(name == "rook"){
        moveSet = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7],
                    [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0]]
    }
    if(name == "queen"){
        moveSet = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7],
            [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0],
            [1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[-1,-1],[-2,-2],[-31,-3],[-4,-4],[-5,-5],[-6,-6],[-7,-7],
            [1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[6,-6],[7,-7],[-1,1],[-2,2],[-3,3],[-4,4],[-5,5],[-6,6],[-7,7]]
    }
    if(name == "dummy"){
        moveSet = [[0,0]];
    }
    //homemade one to try and kill off the player in a very unfair way
    if(name == "terror"){
        moveSet = [
            [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],
            [1,-1],[1,-2],[1,-3],[1,-4],[1,-5],[1,-6],[1,-7],
            [-1,1],[-1,2],[-1,3],[-1,4],[-1,5],[-1,6],[-1,7],
            [-1,-1],-[1,-2],[-1,-3],[-1,-4],[-1,-5],[-1,-6],[-1,-7],
            [2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],
            [2,-1],[2,-2],[2,-3],[2,-4],[2,-5],[2,-6],[2,-7],
            [-2,1],[-2,2],[-2,3],[-2,4],[-2,5],[-2,6],[-2,7],
            [-2,-1],[-2,-2],[-2,-3],[-2,-4],[-2,-5],[-2,-6],[-2,-7],
            [3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],
            [3,-1],[3,-2],[3,-3],[3,-4],[3,-5],[3,-6],[3,-7],
            [-3,1],[-3,2],[-3,3],[-3,4],[-3,5],[-3,6],[-3,7],
            [-3,-1],[-3,-2],[-3,-3],[-3,-4],[-3,-5],[-3,-6],[-3,-7],
            [4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],
            [4,-1],[4,-2],[4,-3],[4,-4],[4,-5],[4,-6],[4,-7],
            [-4,1],[-4,2],[-4,3],[-4,4],[-4,5],[-4,6],[-4,7],
            [-4,-1],[-4,-2],[-4,-3],[-4,-4],[-4,-5],[-4,-6],[-4,-7],
            [5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],
            [5,-1],[5,-2],[5,-3],[5,-4],[5,-5],[5,-6],[5,-7],
            [-5,1],[-5,2],[-5,3],[-5,4],[-5,5],[-5,6],[-5,7],
            [-5,-1],[-5,-2],[-5,-3],[-5,-4],[-5,-5],[-5,-6],[-5,-7],
            [6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],
            [6,-1],[6,-2],[6,-3],[6,-4],[6,-5],[6,-6],[6,-7],
            [-6,1],[-6,2],[-6,3],[-6,4],[-6,5],[-6,6],[-6,7],
            [-6,-1],[-6,-2],[-6,-3],[-6,-4],[-6,-5],[-6,-6],[-6,-7]
        ];
    }
    let p = new Piece(moveSet, bX, bY, name, team);
        p.x = offX + tileWidth * p.bX;
        p.y = offY + tileWidth * p.bY;

        //tile prep
        tiles[bX,bY].full = true;

        //event listeners
        p.on('pointerup', testTile);
        p.on('pointerover', e => {hoverTile.graphic.alpha = 0.8;});
        p.on('pointerout', e => {hoverTile.graphic.alpha = 1.0;});

        //adding to list
        if(team == "home"){
            homePieces.push(p);
        }
        if(team == "enemy"){
            enemyPieces.push(p);
        }

        gameScene.addChild(p);
}
