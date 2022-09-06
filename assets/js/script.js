
// API key for using openweather source
var apiKey = "98fbab5c25594a7fcd2eb52c792c6718";
//var apiSecondKey = "b711e217ca46753654634ae778a24382";

// declare variables to store the user's city name input, geo coordinates in a raw format and geo coordinates rounded to two decimals
var cityName;
var searchTerm;
var allWeather;
var lonRaw;
var latRaw;
var lon;
var lat;

// create a variable to store a reference to the <form> with an id city-form
var cityFormEl = document.querySelector("#city-form");
//create a variable to store a reference to the <input> with an id cityName
var cityInputEl = document.querySelector("#cityName");

// create a variable to reference the search-term div to display currently viewed city name, date and weathericon
var citySearchTerm = document.querySelector("#search-term");
//create a variable to reference the cityInfo-container where the info about temp, wind, humidity and UV index will go
var cityInfoContainerEl = document.querySelector("#cityInfo-container");

//create a variable to reference the city search history container on the left
var searchHistoryContainer = document.querySelector("#search-history");

//create five variables to reference the containers for the next five days forecast
var oneDayAfterContainer = document.querySelector("#day1");
var twoDaysAfterContainer = document.querySelector("#day2");
var threeDaysAfterContainer = document.querySelector("#day3");
var fourDaysAfterContainer = document.querySelector("#day4");
var fiveDaysAfterContainer = document.querySelector("#day5");


// construct openweather query URL which will store the current weather data
// everything before ? is the base URL for calling the Current Weather Data API
// ? marks the boundary between the base URL of the API call and the query terms of the API call
// q= is the query parameter where you can add any user input to specify the data we want to request in the API call. the value assigned to this parameter is called the query string
// ampersand & indicates that we're adding another parameter after the query parameter, appid= concatenates another parameter where we'll add the key, units imperial means the measure unit (Farenheit, MPH etc.)


var formSubmitHandler = function(event) {
    event.preventDefault();
    //console.log(event);

    // capture the value from <input>
    var userCityName = cityInputEl.value.trim();
    // check if the input is an actual city name
    if (userCityName) {
        // if it is then call getCityName function with user's input
        getCityName(userCityName);
        // clear the input form for the next submission
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }
};


// create a function 
var getCityName = function(cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey+"&units=imperial";
    // call the fetch api to pass the query URL as a parameter
    fetch(queryURL).then(function(response) {

        // check if the response is ok - meaning the requested city name exists
        if (response.ok) {
            response.json().then(function(data) {
                
                
                //send response data to getCityCoordinates function
                getCityCoordinates(data, cityName);

            });
        } else {
            alert("Error: City Name Not Found");
        }
    })

    //handle the response in case there's a network error
    .catch(function(error) {
        alert("Unable to connect to server");
    });
};



var getCityCoordinates = function(cityInfo, searchTerm) {
    lonRaw = cityInfo.coord.lon;
    latRaw = cityInfo.coord.lat;
    lon = Math.round(lonRaw * 100)/100;
    lat = Math.round(latRaw * 100)/100; 

    // make sure to clear out old content before displaying new input content
    citySearchTerm.textContent = "";

    // dynamically create a span element to hold a currently viewed city name and append to search-term div
    var currentCity = document.createElement("span");
    currentCity.classList = "text-uppercase";
    currentCity.textContent = searchTerm;
    citySearchTerm.appendChild(currentCity);

    //dynamically create a span element to hold the current date info for the selected city
    var currentDate = moment().format("L");
    var currentDateEl = document.createElement("span");
    currentDateEl.textContent = " ("+currentDate+") ";
    citySearchTerm.appendChild(currentDateEl);


    console.log(searchTerm, lon, lat);

    getSearchHistory(searchTerm);
    console.log(searchTerm);
    getAllWeather(allWeather);
};



//create a function to dynamically generate element for search history
var getSearchHistory = function(searchTerm) {
    
    //dynamically create buttons/holders to store the city name in the search history container
    var cityHistoryList = document.createElement("button");
    cityHistoryList.classList = "search-history-container text-uppercase";
    var cityHistoryEl = document.createElement("span");
    cityHistoryEl.textContent = searchTerm;
    cityHistoryList.appendChild(cityHistoryEl);
    searchHistoryContainer.appendChild(cityHistoryList);
};





//create a function to get current UV index using lon and lat
var getAllWeather = function(allWeather) {
    var uvQueryUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly&appid="+apiKey;
    fetch(uvQueryUrl).then(function(response) {
        //check if the response is ok
        if(response.ok) {
            console.log(response);
            response.json().then(function(data) {
                
                displayWeather(data);
                console.log(data);
            });
        } else {
            console.log("data not found");
        }
    })
    .catch(function(error) {
        console.log("unable to connect to server");
    });
};


var displayWeather = function(cityInfo) {
    //console.log(cityInfo);

    // make sure to clear out old content before displaying new input content
    cityInfoContainerEl.textContent = "";
    

    // go throught the data for selected city and format the data for temperature, wind, humidity and UV
    var temp = "Temp: " + cityInfo.current.temp + "°F";
    console.log(temp);
    var wind = "Wind: " + cityInfo.current.wind_speed + " MPH";
    console.log(wind);
    var humidity = "Humidity: " + cityInfo.current.humidity + "%";
    console.log(humidity);
    var currentUV = "UV index: " + cityInfo.current.uvi;
    console.log(currentUV);
    
    //create a container and span for each data. append span to container, and then append that container to cityInfo-container div
    var tempEl = document.createElement("div");
    tempEl.classList = "param-list-item flex-row justify-space-between align-center";
    var tempTitleEl = document.createElement("span");
    tempTitleEl.textContent = temp;
    tempEl.appendChild(tempTitleEl);
    cityInfoContainerEl.appendChild(tempEl);

    var windEl = document.createElement("div");
    windEl.classList = "param-list-item flex-row justify-space-between align-center";
    var windTitleEl = document.createElement("span");
    windTitleEl.textContent = wind;
    windEl.appendChild(windTitleEl);
    cityInfoContainerEl.appendChild(windEl);

    var humidEl = document.createElement("div");
    humidEl.classList = "param-list-item flex-row justify-space-between align-center";
    var humidTitleEl = document.createElement("span");
    humidTitleEl.textContent = humidity;
    humidEl.appendChild(humidTitleEl);
    cityInfoContainerEl.appendChild(humidEl);

    var uvIndexEl = document.createElement("div");
    uvIndexEl.classList = "param-list-item flex-row justify-space-between align-center";
    var uvIndexTitleEl = document.createElement("span");
    uvIndexTitleEl.textContent = currentUV;
    uvIndexEl.appendChild(uvIndexTitleEl);
    cityInfoContainerEl.appendChild(uvIndexEl);

    // call the function for the next five days to display after submitting city name
    nextFiveDates();
    
};


// create function to generate the dates for the next five days from current view date
var nextFiveDates = function() {

    // make sure to clear out old content before displaying new input content
    oneDayAfterContainer.textContent = "";
    twoDaysAfterContainer.textContent = "";
    threeDaysAfterContainer.textContent = "";
    fourDaysAfterContainer.textContent = "";
    fiveDaysAfterContainer.textContent = "";

    // get the dates for the next 5 days cards
    var dayOneAfter = moment().add(1, 'd').format("L");
    var oneDayAfterEl = document.createElement("h4");
    oneDayAfterEl.textContent = dayOneAfter;
    oneDayAfterEl.classList = "card-header";
    oneDayAfterContainer.appendChild(oneDayAfterEl);

    var twoDaysAfter = moment().add(2, 'd').format("L");
    var twoDaysAfterEl = document.createElement("h4");
    twoDaysAfterEl.textContent = twoDaysAfter;
    twoDaysAfterEl.classList = "card-header";
    twoDaysAfterContainer.appendChild(twoDaysAfterEl);

    var threeDaysAfter = moment().add(3, 'd').format("L");
    var threeDaysAfterEl = document.createElement("h4");
    threeDaysAfterEl.textContent = threeDaysAfter;
    threeDaysAfterEl.classList = "card-header";
    threeDaysAfterContainer.appendChild(threeDaysAfterEl);

    var fourDaysAfter = moment().add(4, 'd').format("L");
    var fourDaysAfterEl = document.createElement("h4");
    fourDaysAfterEl.textContent = fourDaysAfter;
    fourDaysAfterEl.classList = "card-header";
    fourDaysAfterContainer.appendChild(fourDaysAfterEl);

    var fiveDaysAfter = moment().add(5, 'd').format("L");
    var fiveDaysAfterEl = document.createElement("h4");
    fiveDaysAfterEl.textContent = fiveDaysAfter;
    fiveDaysAfterEl.classList = "card-header";
    fiveDaysAfterContainer.appendChild(fiveDaysAfterEl);
};


// add submit event listener to the cityFormEl
cityFormEl.addEventListener("submit", formSubmitHandler);