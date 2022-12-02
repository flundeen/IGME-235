class Piece{
    constructor(moveset,x,y,name, team, graphic){
        this.moveset = moveset;
        this.x = x;
        this.y = y;
        this.name = name;
        this.team = team;
        this.graphic = graphic;
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