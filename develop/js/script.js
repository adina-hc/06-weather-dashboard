// 0. Variables & elements retrieval
var userInputEl = document.getElementById('userSearch');
var currentSec = document.getElementById('currentSection');
var fiveDayFSec = document.querySelector('.fiveDayForecast');
var historySec = document.getElementById('history');
var searchBtn = document.getElementById('fetchBtn');
var formLabel = document.getElementById('#form-label');
var historyBtn = document.querySelector('.historyBtn');
var wImage = document.querySelector('.card-img-top');
var populateHistoryUl = document.querySelector('#populateHistory');
var forecastFilteredData;
var weatherForecast = {};
var appKey = '766dfa77a15860a4f2cd465763e36bb6';

// 1. Search data based on user selection
var displayWeather = function (e) {
    e.preventDefault();
    // use userInput to fecth data in openweathermap.org
    userInput = userInputEl.value;
    userInput = userInput.toUpperCase();
    // Unhide Current and Forecast Weather sections
    currentSec.setAttribute("style","display:block;");
    fiveDayFSec.setAttribute("style","display:block;");
    // Run fetch
    fetchWeather(userInput);    
}

// 2. Fetch weather data to populate cards
function fetchWeather(userInput) {
    var wthrUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+userInput+'&appid='+appKey+'&units=imperial';
    var fiveDayForecast = 'https://api.openweathermap.org/data/2.5/forecast?q='+userInput+'&appid='+appKey+'&units=imperial';

    fetch (wthrUrl)
    .then (function(response){
        if(response.ok){
            response.json().then(function(data) {
                console.log("Line 75 --> Data from first fetch"); // remove when done
                console.log(data); // remove when done

            // Fetch the UV data    
                fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${appKey}`)
                .then(res => res.json())
                .then(uvData => {
                    console.log("Line 81 --> List of uvData for Current"); // remove when done
                    console.log(uvData) // remove when done
                    if(uvData.current.uvi < 3){
                        // ----> set colors --- green, yellow, red
                        
                    }
                    populateCard(data,uvData);
                    dataForecast(userInput, fiveDayForecast);
                })   
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
    // Function to fetch 5 day Forecast
    function dataForecast(userInput, fiveDayForecast) {  
        fetch(fiveDayForecast)
            .then(res => res.json())

            .then(forecastData => {
                console.log("Line-64--> 5 day forecast");
                console.log(forecastData)
                var filteredDays = forecastData.list.filter(query => query.dt_txt.includes('12:00:00'));

                // Call to populate 5-day Forecast
                populateFive(filteredDays, fiveDayFSec);               
            })      
    }
}

// 4. Function to populate 5-day Forecast cards with loop --forecastFilteredData
function populateFive(filteredDays, fiveDayFSec){
    console.log(filteredDays); //remove when done
    for (var i = 0; i < filteredDays.length; i ++) {
        console.log(filteredDays[i].dt_txt);
        console.log("Line 158 ---> From Function populateFive ---> Data from filtered from local storage to populate 5-day Forecast:") // delete after test
        // Add new card in Five Day Forecast Sectioon
        var newCard = document.createElement('div');
        newCard.setAttribute("class","card tarjeta");
        fiveDayFSec.appendChild(newCard);
        // New Image in card   
        var newImg = document.createElement('img');
        newImg.setAttribute("id", "wthIcon");
        newCard.appendChild(newImg);
        newImg.setAttribute("class","card-img-top")
        var wIcon = document.querySelector('#wthIcon');
        var fPic = filteredDays[i].weather[0].icon;
        var fImageSrc = 'http://openweathermap.org/img/wn/'+fPic+'@2x.png';
        wIcon.src = fImageSrc;
        console.log(wIcon.src); //remove after done
        // New div to attach Weather info
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "card cardForecast");
        newCard.appendChild(newDiv);
        // New h5 in new div
        var newh5 = document.createElement("h5");
        newh5.setAttribute("class", "card-title");
        newDiv.appendChild(newh5);
        var newP = document.createElement("p");
        newP.setAttribute("class","card-text");
        newDiv.appendChild(newP);
        // Print data
        document.querySelector(".cardForecast").textContent = "Date: "+filteredDays[i].dt_txt+"<br>Temperature: "+filteredDays[i].main.temp+" °F"+"<br>Humidity: "+filteredDays[i].main.humidity+" %"+"<br>Wind: "+filteredDays[i].wind.speed+" mph";    
        
        /*
        // Display weather forecast
        function displayWeatherForecast() {
            iconElement.innerHTML = wIcon.source;
            cityElement.innerHTML = userInputEl.value;
            tempElement.innerHTML = filteredDays[i].main.temp + " °F";
        }
        */
    }
}  
    


// 3. Populate card with fetched data
function populateCard(data,uvData) {
    // Add icon to the image section
    var wPic = data.weather[0].icon;
    var wImageSrc = 'http://openweathermap.org/img/wn/'+wPic+'@2x.png';
    wImage.src = wImageSrc;
    console.log(wImage.src);
    // To convert unix number into date format
    var unixDate = moment.unix(data.dt).format("MMM Do, YYYY");
    // Add current conditions
    document.querySelector(".card-title").innerHTML = data.name+": "+data.main.temp+" °F"
    document.querySelector(".card-text").innerHTML = "Humidity: "+data.main.humidity+" %"+"<br>Wind speed: "+data.wind.speed+" mph"+"<br>Date: "+unixDate+"<br>UVI Index: "+uvData.current.uvi;
    var userInput = userInputEl.value;
    var result = saveToLocal (userInput);
    // Print search history
    if(!result){
        printHistory(historySec);
    }
    // Unhide Current and Forecast Weather sections
    currentSec.setAttribute("style","display:block;");
    fiveDayFSec.setAttribute("style","display:block;");
}

// 3. Store City Search History in the stored History Buttons
function saveToLocal (userInput) {
    // creates array to save and inializes local storage array
    var keyFromSearch = JSON.parse(localStorage.getItem("weatherHistory"))||[];
    // Prevent duplication of cities or buttons
    var isOnLocal = false;
    for(var i = 0; i < keyFromSearch.length; i ++){
        if(userInput == keyFromSearch[i]){
            isOnLocal = true;
            break;
        }
    }
    if(!isOnLocal){
        // Save city back to local storage
        keyFromSearch.push(userInput);
        localStorage.setItem("weatherHistory", JSON.stringify(keyFromSearch));
    }
    return isOnLocal;
}

// 4. Variable to print the search history
function printHistory(){
    var wHistory = JSON.parse(localStorage.getItem("weatherHistory"))||[];
    populateHistoryUl.textContent='';
    if (wHistory.length > 0) { 
        // Loop to create history buttons
        for (var i = 0; i < wHistory.length; i++){
            // Creates and adds button for the element in history
            var historyEl = document.createElement("button");
            historyEl.setAttribute('data-value', wHistory[i]);
            historyEl.setAttribute("class", "historyBtn btn btn-outline-secondary");
            historyEl.textContent = wHistory[i]; 
            populateHistoryUl.appendChild(historyEl);
        }    
    }   
}

// 5. History buttons for fetch   
var displayCityHistory = function (e) {
    console.log(3);
    // if button has a value
    if (e.target.dataset.value =='') {
        return null;
    }
    else {
        userInputEl.value = e.target.dataset.value;
        fetchWeather(e.target.dataset.value);
    }     
}

// On click search button, create button with city name
searchBtn.addEventListener('click',displayWeather);
populateHistoryUl.addEventListener('click', displayCityHistory);

// Print Search History
printHistory(historySec);
