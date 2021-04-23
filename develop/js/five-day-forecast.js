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
                    console.log("This uvData includes 7 day forecast use for 5 day forecast")
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



// Populate five-day forecast cards
function populateFive(uvData) {

    // Loop to populate cards
    console.log("Loop for Forecast");
    for (var cards = 0; cards < uvData.length; cards++) {
        // place into variables forecastData[cards].dt_txt        
        var fCdate = uvData[cards].daily[0].dt;
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
    // Add current conditions
    //document.querySelector(".card-title").innerHTML = data.name+": "+data.main.temp+" °F"
    //document.querySelector(".card-text").innerHTML = "Humidity: "+data.main.humidity+" %"+"<br> Wind speed: "+data.wind.speed+" mph"+"<br> Date: "+unixDate+"<br>UVI Index: "+uvData.current.uvi; 
    //var result = saveToLocal (userInput);

}