class piece{
    constructor(moveset,x,y,name, team){
        this.moveset = moveset;
        this.x = x;
        this.y = y;
        this.name = name;
        this.team = team;
    }
}

class board{
    constructor(name, layout){
        this.name = name;
        this.layout = layout;
    }
}