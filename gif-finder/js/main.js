// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
// 2
let displayTerm = "";

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");

    //1
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
    
    //2
    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

    //3
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    //4
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //5
    term = term.trim();

    //6
    term = encodeURIComponent(term);

    //7
    if(term.length < 1) return;

    //8
    url += "&q=" + term;

    //9
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    //10
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    //11
    console.log(url);

    // 12 Request data!
    getData(url);

    
}

function getData(url){
    //1 - create a new XHR object
    let xhr = new XMLHttpRequest();

    //2 - set the onload handler
    xhr.onload = dataLoaded;

    //3 - set the onerror
    xhr.onerror = dataError;

    //4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e){
    //5 - event.target is the xhr object
    let xhr = e.target;

    //6 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.response);

    //7
    let obj = JSON.parse(xhr.responseText);

    //8 - if there are no results, print a message and return
    if(!obj.data || obj.data.length == 0){
        document.querySelector("#status").innerHTML = "<b>No Results found for '" + displayTerm + "'</b>";
        return;
    }

    //9 - Start building an html string we will display to the user
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "<p><i>Here are " + results.length + "results for '" + displayTerm + "'</i></p>";

    //10 - loop through the array of results
    for(let i = 0; i < results.length; i++){
        let result = results[i];

        //11 - get the url to the GIF
        let smallURL = result.images.fixed_width_downsampled.url;
        if(!smallURL) smallURL = "images/no-image-found.png";

        //Example of data collection from result to display in the span
        let rating = "N/A";
        if(result.rating){
            rating = result.rating.toUpperCase();
        }

        //12 - get the url to the GIPHY page
        let url = result.url;

        //13 - Build a <div> to hold each result
            // ES6 String Template
            let line = `<div class= 'result'><img src= '${smallURL}' title= '${result.id}' />`;
            line += `<span><a target= '_blank' href= '${url}'>View on Giphy</a></span><br><span>Rating: ${rating}</span></div>`;

        //15 = add the <div> to 'bigString' and loop
        bigString += line;
    }

    //16 - all done building the htm - show it to the user
    document.querySelector("#content").innerHTML = bigString;

    //17 - update the status
    document.querySelector("#status").innerHTML = "<b>Success!</b>";
}

function dataError(e){
    console.log("An error occured");
}

