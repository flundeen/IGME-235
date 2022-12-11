class Piece extends PIXI.Graphics{
    
    constructor(moveset,bX,bY,name, team){
        super();
        if(team == "enemy" && name == "king"){
            this.beginFill(0xFF0000);
            this.lineStyle(4, 0xFFFF66, 0.8);
        }else if(team == "enemy" && name == "pawn"){
            this.beginFill(0xFF0000);
            this.lineStyle(4, 0x00FF00, 0.8);
        }else if(team == "enemy" && name == "knight"){
            this.beginFill(0xFF0000);
            this.lineStyle(4, 0x00CCFF, 0.8);
        }else if(team == "enemy" && name == "rook"){
            this.beginFill(0x660066);
            this.lineStyle(4, 0x000000, 0.8);
        }else if(team == "enemy" && name == "queen"){
            this.beginFill(0xFFCC66);
            this.lineStyle(4, 0xFFFF66, 0.8);
        }else if(team == "enemy" && name == "terror"){
            this.beginFill(0x000000);
            this.lineStyle(4, 0xFFFFFF, 0.8);
        }else if(team == "home" && name == "king"){
            this.beginFill(0xFFFF66);
            this.lineStyle(2, 0x000000, 0.8);
        }else if(team == "home" && name == "pawn"){
            this.beginFill(0x00FF00);
            this.lineStyle(2, 0x000000, 0.8);
        }else if(team == "home" && name == "knight"){
            this.beginFill(0x00CCFF0);
            this.lineStyle(2, 0x000000, 0.8);
        }else if(team == "home" && name == "rook"){
            this.beginFill(0x660066);
            this.lineStyle(2, 0x000000, 0.8);
        }else if(team == "home" && name == "terror"){
            this.beginFill(0xFFFFFF);
            this.lineStyle(2, 0x000000, 0.8);
        }else if(team == "home" && name == "queen"){
            this.beginFill(0xFFCC66);
            this.lineStyle(2, 0x000000, 0.8);
        }else if(team == "enemy" && name == "dummy"){
            this.beginFill(0x994D00);
            this.lineStyle(5, 0x663300, 0.8);
        }

        this.drawCircle(25,25,20);
        this.endFill();
        this.interactive = true;
        this.buttonMode = true;
        this.moveset = moveset;
        this.bX = bX;
        this.bY = bY;
        this.name = name;
        this.team = team;
        this.isAlive = true;
    }

    Move(nX,nY){
        this.bX = nX;
        this.bY = nY;
        this.x = offX + tileWidth * this.bX;
        this.y = offY + tileWidth * this.bY;
        if((this.bY == boardHeight-1 && this.name == "pawn" && this.team == "enemy")||(this.bY == 0 && this.name == "pawn" && this.team == "home")){
            this.moveset = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7],
            [1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0],
            [1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[-1,-1],[-2,-2],[-31,-3],[-4,-4],[-5,-5],[-6,-6],[-7,-7],
            [1,-1],[2,-2],[3,-3],[4,-4],[5,-5],[6,-6],[7,-7],[-1,1],[-2,2],[-3,3],[-4,4],[-5,5],[-6,6],[-7,7]];
            this.clear();
            this.beginFill(0xFFCC66);
            if(this.team == "home"){
                this.lineStyle(2, 0x000000, 0.8);
            } else if(this.team == "enemy"){
                this.lineStyle(4, 0xFFFF66, 0.8);
            }
            this.drawCircle(25,25,20);
            this.endFill();
        }
    }
}

class Tile{
    constructor(x,y,full, viable,content, graphic){
        this.x=x;
        this.y=y;
        this.full=full;
        this.viable = viable;
        this.content=content;
        this.graphic = graphic;
    }
}

class Pawn extends Piece{
    constructor(x,y,name, team,graphic){
        
        
        super([[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],x,y,name,team,graphic)
    }
}