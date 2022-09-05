
// API key for using openweather source
var apiKey = "b711e217ca46753654634ae778a24382";
// declare a variable to store the user's city name input
var cityName;

// create a variable to store a reference to the <form> with an id city-form
var cityFormEl = document.querySelector("#city-form");
//create a variable to store a reference to the <input> with an id cityName
var cityInputEl = document.querySelector("#cityName");

// create a variable to reference the search-term <span> to display currently viewed city name
var citySearchTerm = document.querySelector("#search-term");
//create a variable to reference the cityInfo-container where the info about temp, wind, humidity and UV index will go
var cityInfoContainerEl = document.querySelector("#cityInfo-container");



// construct openweather query URL which will store the current weather data
// everything before ? is the base URL for calling the Current Weather Data API
// ? marks the boundary between the base URL of the API call and the query terms of the API call
// q= is the query parameter where you can add any user input to specify the data we want to request in the API call. the value assigned to this parameter is called the query string
// ampersand & indicates that we're adding another parameter after the query parameter, appid= concatenates another parameter where we'll add the key
//var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

var getCityName = function(cityName) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey;
    // call the fetch api to pass the query URL as a parameter
    fetch(queryURL).then(function(response) {
        response.json().then(function(data) {
        
        //after displayWeather function was created we will send the response data from getCityName to displayWeather
        displayWeather(data, cityName);
        });
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

    // before any input make sure to clear out old content before displaying new input content
    cityInfoContainerEl.textContent = "";
    citySearchTerm.textContent = searchTerm;

    //loop through the info of the cities
    //format the data for the temperature
    var temp = "Temp: " + cityInfo.main.temp;
    console.log(temp);
    //format the data for the wind
    var wind = "Wind: " + cityInfo.wind.speed;
    console.log(wind);
    //format the data for humidity
    var humidity = "Humidity: " + cityInfo.main.humidity + "%";
    console.log(humidity);
    //create a container and span for each data
    // append span to container, and then append that container to cityInfo-container div
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
};


// add submit event listener to the cityFormEl
cityFormEl.addEventListener("submit", formSubmitHandler);