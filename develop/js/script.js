// 0. Variables & elements retrieval
var userInputEl = document.getElementById('userSearch');
var historySec = document.getElementById('history');
var searchBtn = document.getElementById('fetchBtn');
var formLabel = document.getElementById('#form-label');
var historyBtn = document.querySelector('.historyBtn');
var wImage = document.querySelector('.card-img-top');
var populateHistoryUl = document.querySelector('#populateHistory');


// 1. Search data based on user selection
var appKey = '766dfa77a15860a4f2cd465763e36bb6';
var displayWeather = function (e) {
    e.preventDefault();
    // use userInput to fecth data in openweathermap.org
    userInput = userInputEl.value;
    userInput = userInput.toUpperCase();
    fetchWeather(userInput);    
}

// 2. Fetch weather data to populate cards
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
                    console.log("List of uvData for 5 day forecast");
                    console.log(uvData)
                    if(uvData.current.uvi < 3){
                        // color green
                    }
                    populateCard(data,uvData);
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
    fetch(forecastFiveDay)
        .then(res => res.json())
        .then(forecastData => {
            console.log("What variables created for 5 day forecast");
            console.log(forecastData)
            var filteredDays = forecastData.list.filter(query => query.dt_txt.includes('12:00:00'))
            console.log(filteredDays)
// call function for printing the 5 cards
            populateFive(forecastData);
            console.log("What variables created for 5 day forecast");
        })

}



// Populate card with fetched data
function populateCard(data,uvData){
    // Add icon to the image section
    var wPic = data.weather[0].icon;
    var wImageSrc = 'http://openweathermap.org/img/wn/'+wPic+'@2x.png';
    wImage.src = wImageSrc;
    console.log(wImage.src);
    // To convert unix number into date format
    var unixDate = moment.unix(data.dt).format("MMM Do, YYYY");
    // Add current conditions
    document.querySelector(".card-title").innerHTML = data.name+": "+data.main.temp+" °F"
    document.querySelector(".card-text").innerHTML = "Humidity: "+data.main.humidity+" %"+"<br> Wind speed: "+data.wind.speed+" mph"+"<br> Date: "+unixDate+"<br>UVI Index: "+uvData.current.uvi;
    // 5-Day weather forecast
    


    var result = saveToLocal (userInput);
    // ** add forecast here
    // Print search history
    if(!result){
        printHistory(historySec);
    }
}

// Populate five-day forecast cards
function populateFive(forecastData) {

    // Loop to populate cards
    console.log("Loop for Forecast");
    for (var cards = 0; cards < forecastData.length; cards++) {
        // place into variables forecastData[cards].dt_txt        
        var fCdate = forecastData[cards].daily[0].dt;
        // convert unix date into date format
        var unixDateF = moment.unix(fCdate).format("MMM Do, YYYY");
        console.log(fCdate); // remove after test
        var fCtemp = uvData[cards].temp;
        console.log(fCtemp);
        var fCicon = uvData[cards].icon;
        //var wPic = data.weather[0].icon;
        var wImageSrcF = 'http://openweathermap.org/img/wn/'+fCicon+'@2x.png';
        console.log(fCicon);
        var fCwindSpd = uvData[cards].speed;
        console.log(fCwindSp);

        // create elements with attribute & class names, and append elements
    }

}


// 3. Store City Search History in the stored History Buttons
function saveToLocal (userInput) {
    // creates array to save and inializes local storage array
    var keyFromSearch = JSON.parse(localStorage.getItem("weatherHistory"))||[];
    // Prevent duplication of cities or buttons
    var isOnLocal=false;
    for(var i=0;i<keyFromSearch.length;i++){
        if(userInput == keyFromSearch[i]){
            isOnLocal=true;
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
        console.log(1);
        fetchWeather(e.target.dataset.value);
        
    }     
}

// 6. Function to print 5-day Forecast cards with loop





// On click search button, create button with city name
searchBtn.addEventListener('click',displayWeather);
populateHistoryUl.addEventListener('click', displayCityHistory);


// Print Search History
printHistory(historySec);