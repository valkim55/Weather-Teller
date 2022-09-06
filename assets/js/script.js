
// API key for using openweather source
var apiKey = "b711e217ca46753654634ae778a24382";
// declare a variable to store the user's city name input
var cityName;

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
// ampersand & indicates that we're adding another parameter after the query parameter, appid= concatenates another parameter where we'll add the key
//var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

var getCityName = function(cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey+"&units=imperial";
    // call the fetch api to pass the query URL as a parameter
    fetch(queryURL).then(function(response) {

        // check if the response is ok - meaning the requested city name exists
        if (response.ok) {
            response.json().then(function(data) {
                //after displayWeather function was created we will send the response data from getCityName to displayWeather
                displayWeather(data, cityName);
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
//getCityName("Seattle");



//create a function to be executed when the form is submitted
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);

    // capture the vale from <input>
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


//create a functin to display info about the city, for now the array of data for that city and the serchTerm we'll set up
var displayWeather = function(cityInfo, searchTerm) {
    console.log(cityInfo);
    console.log(searchTerm);

    // make sure to clear out old content before displaying new input content
    cityInfoContainerEl.textContent = "";
    citySearchTerm.textContent = "";
    oneDayAfterContainer.textContent = "";
    twoDaysAfterContainer.textContent = "";
    threeDaysAfterContainer.textContent = "";
    fourDaysAfterContainer.textContent = "";
    fiveDaysAfterContainer.textContent = "";

   
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


    //dynamically create buttons/holders to store the city name in the search history container
    var cityHistoryList = document.createElement("button");
    cityHistoryList.classList = "search-history-container text-uppercase";
    var cityHistoryEl = document.createElement("span");
    cityHistoryEl.textContent = searchTerm;
    cityHistoryList.appendChild(cityHistoryEl);
    searchHistoryContainer.appendChild(cityHistoryList);


    // go throught the data for selected city and format the data for temperature, wind, humidity and UV
    var temp = "Temp: " + cityInfo.main.temp + "°F";
    var wind = "Wind: " + cityInfo.wind.speed + " MPH";
    var humidity = "Humidity: " + cityInfo.main.humidity + "%";
    
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

    // call the function for the next five days to display after submitting city name
    nextFiveDates();
    
};


// create function to generate the dates for the next five days from current view date
var nextFiveDates = function() {
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



