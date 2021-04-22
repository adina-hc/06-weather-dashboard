// 0. Variables & elements retrieval
var userInputEl = document.getElementById('userSearch');
var historySec = document.getElementById('history');
var searchBtn = document.getElementById('fetchBtn');
var formLabel = document.getElementById('#form-label');
var historyBtn = document.querySelector('.historyBtn');
var wImage = document.querySelector(".card-img-top");


// 1. Fetch data based on user selection
var appKey = 'e81626d7be11e6979c57af627d900393';
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
                // Populate card with fetched data
                document.querySelector(".card-title").innerHTML = data.name+": "+data.main.temp+" °F"
                document.querySelector(".card-text").innerHTML = "Humidity: "+data.main.humidity+"<br> Wind speed: "+data.wind.speed;
                // Add icon to the img section
                var wPic = data.weather[0].icon;
                var wImageSrc = 'http://openweathermap.org/img/wn/'+wPic+'@2x.png';
                wImage.src = wImageSrc;
                console.log(wImage.src);
                saveToLocal (userInput);
                // Prevent duplication of buttons
                while (historySec.firstChild) {
                    historySec.removeChild(historySec.firstChild);
                }
                // Print search history
                printHistory(historySec);
            // Fetch the UV data    
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${appKey}`)
                .then(res => res.json())
                .then(uvData => {
                    console.log(uvData)
                    /* to add if
                    if(uvData.current.uvi < 3){
                        // color green
                    };
                    */
                });   
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
            historyEl.setAttribute("class", "historyBtn");
            historySec.appendChild(historyEl);
            historyEl.textContent = wHistory[i];
            var hBtn = wHistory[i];          
        }
        console.log(hBtn); //remove later, this to see if I can use for fech history
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