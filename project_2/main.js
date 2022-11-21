window.onload = (e) => {document.querySelector("#activator").onclick = searchButtonClicked};

let crewCount = 0;
let epNum = 0;
let rick = false;

///Event for when generator button is called
function searchButtonClicked(){
    console.log("Button Clicked!");

    //pulls values from numboxes in html
    crewCount = document.querySelector("#people").value;
    epNum = document.querySelector("#eptheme").value;
    rick = document.querySelector("#withRick").checked;

    //BASE URLS
    const EP_URL = "https://rickandmortyapi.com/api/episode/" + epNum;
    const CHAR_URL = "https://rickandmortyapi.com/api/character";
    const LOC_URL = "https://rickandmortyapi.com/api/location";

    //debug testers
    console.log("User wants " + crewCount + " members for episode " + epNum);
    console.log(rick);


    document.querySelector("#crewresult").innerHTML = "";

    //calls data queries from API
    if(rick){
        getChar(CHAR_URL + "/1");
    }
    for(let i = 0; i < crewCount; i++){
        getChar(CHAR_URL + "/" + (Math.floor(Math.random() *800)));
    }
    getEp(EP_URL);
    
    getLoc(LOC_URL + "/" + (Math.floor(Math.random() *40)));

}

///Retrieves character info from API
function getChar(url){
    let xhr = new XMLHttpRequest();

    xhr.onload = charDataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

///Retrieves episode data from API
function getEp(url){
    let xhr = new XMLHttpRequest();

    xhr.onload = epDataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

///Gets location data from API
function getLoc(url){
    let xhr = new XMLHttpRequest();

    xhr.onload = locDataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

///Handles character info from API
function charDataLoaded(e){

    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    let charList = obj.results;

    //lays out display of character info
    let charOutput = `<div class="charInfo"><img src ="${obj.image}" alt="Image of ${obj.name}">${obj.name} a ${obj.species} who was last seen at ${obj.location.name}.</div>`;

    //sets character info to character results location
    document.querySelector("#crewresult").innerHTML += charOutput;

}

///Handles episode name from API
function epDataLoaded(e){
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    //Gives the episode results location the name of desired episode
    document.querySelector("#epname").innerHTML = `<div class="epInfo">${obj.name}</div>`;
}

///Handles Location data from API
function locDataLoaded(e){
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    console.log(obj);

    //If the dimension of the location is known
    if(obj.dimension != "unknown"){
        document.querySelector("#locresult").innerHTML = `<div class="locInfo">${obj.name} in the ${obj.dimension}.</div>`;
    } //otherwise
    else{
        document.querySelector("#locresult").innerHTML = `<div class="locInfo">${obj.name} in an unknown dimension.</div>`;

    }
    
}

function dataError(e){
    console.log("An error occured");
}