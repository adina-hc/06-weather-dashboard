// 0. Variables & elements retrieval
var userInputEl = document.getElementById('userSearch');
var historySec = document.getElementById('history');
var searchBtn = document.getElementById('fetchBtn');
var formLabel = document.getElementById('#form-label');
var historyBtn = document.querySelector('.historyBtn');
var wImage = document.querySelector(".card-img-top");


// 1. Fetch data based on user selection
var appKey = '766dfa77a15860a4f2cd465763e36bb6';
var displayWeather = function (e) {
    e.preventDefault();
    // use userInput to fecth data in openweathermap.org
    userInput = userInputEl.value;
    userInput = userInput.toUpperCase();
    fetchWeather(userInput);    
}

// 2. Print search history
printHistory(historySec);

function fetchWeather(userInput) {
    var wthrUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+userInput+'&appid='+appKey+'&units=imperial';
    var forecastFiveDay = 'https://api.openweathermap.org/data/2.5/forecast?q='+userInput+'&appid='+appKey+'&units=imperial';

    fetch (wthrUrl)
    .then (function(response){
        if(response.ok){
            response.json().then(function(data) {
                console.log(data);

            // Fetch the UV data    
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${appKey}`)
                .then(res => res.json())
                .then(uvData => {
                    console.log(uvData)
                    if(uvData.current.uvi < 3){
                        // color green
                    }
                    populateCard(data,uvData);
                })   
                // Function pullData --> to gather the current data by humidity, wind, etc

            }); 
            
        }
        else {
            // type of errors
            alert(response.statusText);
        }
    })
    // If errors are found
    .catch (function (error){
        alert("Could not connect to OpenWeather");
    });
    fetch(forecastFiveDay)
        .then(res => res.json())
        .then(forecastData => {
            console.log(forecastData)
            var filteredDays = forecastData.list.filter(query => query.dt_txt.includes('12:00:00'))
            console.log(filteredDays)
// call function for printing the 5 cards
        })

}

// Populate card with fetched data
function populateCard(data,uvData){
    // Add icon to the image section
    var wPic = data.weather[0].icon;
    var wImageSrc = 'http://openweathermap.org/img/wn/'+wPic+'@2x.png';
    wImage.src = wImageSrc;
    console.log(wImage.src);
    // Add current conditions
    var currentData = {
        city: data.name, temp: data.main.temp+" °F", humidity: data.main.humidity, windSpeed: data.wind.speed}
    document.querySelector(".card-title").innerHTML = data.name+": "+data.main.temp+" °F"
    document.querySelector(".card-text").innerHTML = "Humidity: "+data.main.humidity+"<br> Wind speed: "+data.wind.speed+"<br> Date: "+data.dt+"<br>UVI Index: "+uvData.current.uvi;
    
    
    saveToLocal (userInput);
    // Prevent duplication of buttons
    while (historySec.firstChild) {
        historySec.removeChild(historySec.firstChild);
}
// Print search history
printHistory(historySec);
}








// 3. Store City Search History in the stored History Buttons
function saveToLocal (userInput) {
    // creates array to save and inializes local storage array
    var keyFromSearch = JSON.parse(localStorage.getItem("weatherHistory"))||[];
    // Save city back to local storage
    keyFromSearch.push(userInput);
    // Remove duplicate elements from the history array
    noDup = [...new Set(keyFromSearch)]; 
    localStorage.setItem("weatherHistory", JSON.stringify(noDup));
}



// Variable to print the search history
function printHistory(historySec){
    var wHistory = JSON.parse(localStorage.getItem("weatherHistory"))||[];
    if (wHistory.length > 0) { 

        // Loop to create history buttons
        for (var i = 0; i < wHistory.length; i++){
            //creates and adds button for the element in history
            var historyEl = document.createElement("button");
            historyEl.setAttribute("class", "historyBtn")
            historySec.appendChild(historyEl);
            historyEl.textContent = wHistory[i];          
        }
    
    }
   
   }
/*
// Get string from history button to perform fetch   
var displayCityHistory = function (e) {
    e.preventDefault();
    // use userInput to fecth data in openweathermap.org
    e.target.getAttribute("class");
    history = history.toUpperCase();
    fetchWeather(history);    
}
*/

// function to print cards with for loop



// On click search button, create button with city name
searchBtn.addEventListener('click',displayWeather);
//historyBtn.addEventListener('click', displayCityHistory);