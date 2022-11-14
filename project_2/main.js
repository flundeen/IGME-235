window.onload = (e) => {document.querySelector("#activator").onclick = searchButtonClicked};

let crewCount = 0;
let epNum = 0;
let rick = false;

function searchButtonClicked(){
    console.log("Button Clicked!");
    const CHAR_URL = "https://rickandmortyapi.com/api/character";
    const LOC_URL = "https://rickandmortyapi.com/api/location";
    const EP_URL = "https://rickandmortyapi.com/api/episode";

    //pulls values from numboxes in html
    crewCount = document.querySelector("#people").value;
    epNum = document.querySelector("#eptheme").value;
    rick = document.querySelector("#withRick").checked;


    //debug testers
    console.log("User wants " + crewCount + " members for episode " + epNum);
    console.log(rick);

    getChar(CHAR_URL);

    getEp(EP_URL);
    
    getLoc(LOC_URL);

}

function getChar(url){
    let xhr = new XMLHttpRequest();

    xhr.onload = charDataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function getEp(url){
    let xhr = new XMLHttpRequest();

    xhr.onload = epDataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function getLoc(url){
    let xhr = new XMLHttpRequest();

    xhr.onload = locDataLoaded;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function charDataLoaded(e){
    let xhr = e.target;

    //console.log(xhr.response);

    let obj = JSON.parse(xhr.responseText);

    if(!obj.results || obj.results == 0){
        document.querySelector("#crewresult").innerHTML = "<b> No one wanted to join you </b>";
    }

    let charList = obj.results;
    console.log("Charlist length: " + charList.length);
    let bigString = "";

    if(rick){
        bigString += `<li><div class="charInfo"><img src ="${charList[0].image}" alt="Image of ${charList[0].name}">${charList[0].name} a ${charList[0].species} who was last seen at ${charList[0].location.name}.</div></li>`;
    }

    for (let i = 0; i < crewCount; i++) {
        let result = charList[Math.floor(Math.random() * charList.length)];

        //Console output for character info
        //console.log(result);


        let charOutput = `<li><div class="charInfo"><img src ="${result.image}" alt="Image of ${result.name}">${result.name} a ${result.species} who was last seen at ${result.location.name}.</div></li>`;

        bigString += charOutput;
    }

    document.querySelector("#crewresult").innerHTML = bigString;

}

function epDataLoaded(e){
    let xhr = e.target;

    //console.log(xhr.response);

    let obj = JSON.parse(xhr.responseText);

    if(!obj.results || obj.results == 0){
        document.querySelector("epresult").innerHTML = "<b> an unreleased episode so you'll just have to guess.</b>";

    }

    let episode = obj.results[epNum-1];

    document.querySelector("#epname").innerHTML = `<div class="epInfo">${episode.name}</div>`;
}

function locDataLoaded(e){
    let xhr = e.target;

    //console.log(xhr.response);

    let obj = JSON.parse(xhr.responseText);

    if(!obj.results || obj.results == 0){
        document.querySelector("locresult").innerHTML = "<b> nowhere. Your portal gun isn't working for some reason.</b>";

    }

    let destination = obj.results[Math.floor(Math.random() * obj.results.length)];

    if(destination.dimension != "unknown"){
        document.querySelector("#locresult").innerHTML = `<div class="locInfo">${destination.name} in the ${destination.dimension}.</div>`;
    }
    else{
        document.querySelector("#locresult").innerHTML = `<div class="locInfo">${destination.name} in an unknown dimension.</div>`;

    }
    
}

function dataError(e){
    console.log("An error occured");
}