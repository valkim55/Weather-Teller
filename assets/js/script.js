
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

var cityInfoArray = [];


//create five variables to reference the containers for the next five days forecast
var dayOneAfter = moment().add(1, 'd').format("L");
$("#day1 .card-header").text(dayOneAfter);

var twoDaysAfter = moment().add(2, 'd').format("L");
$("#day2 .card-header").text(twoDaysAfter);

var threeDaysAfter = moment().add(3, 'd').format("L");
$("#day3 .card-header").text(threeDaysAfter);

var fourDaysAfter = moment().add(4, 'd').format("L");
$("#day4 .card-header").text(fourDaysAfter);

var fiveDaysAfter = moment().add(5, 'd').format("L");
$("#day5 .card-header").text(fiveDaysAfter);


var formSubmitHandler = function(event) {
    event.preventDefault();

    // capture the value from <input>
    var userCityName = cityInputEl.value.trim();
    // check if the input is an actual city name
    if (userCityName) {
        // if it is then call getCityName function with user's input
        getCityName(userCityName);

        // once you get the city name push into empty array to store
        if (!cityInfoArray.includes(userCityName)) {
            cityInfoArray.push(userCityName);
            localStorage.setItem("allCities", JSON.stringify(cityInfoArray));
        }
        
        // clear the input form for the next submission
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }
};


// create a function 
var getCityName = function(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey+"&units=imperial";
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

    // dynamically create a span element to hold a currently viewed city name, date and weather icon and append to search-term div
    // var currentCity = document.createElement("span");
    // currentCity.classList = "text-uppercase";
    // currentCity.textContent = searchTerm;
    // citySearchTerm.appendChild(currentCity);
    // 5 lines from above in two lines
    var currentCity = $("<span></span>").appendTo(citySearchTerm);
    currentCity.addClass("text-uppercase").text(searchTerm);

    var currentDate = moment().format("L");
    var currentDateEl = $("<span></span>").appendTo(citySearchTerm);
    currentDateEl.text(" ("+currentDate+") ");
    
    getSearchHistory(searchTerm);
    getAllWeather(allWeather);
};


//create a function to dynamically generate element for search history
var getSearchHistory = function(searchTerm) {
    var cityHistoryList = $("<button>").addClass("search-history-container text-uppercase")
    cityHistoryList.attr("value", searchTerm);
    var cityHistoryEl = $("<span>").text(searchTerm);
    cityHistoryList.append(cityHistoryEl);
    $("#search-history").append(cityHistoryList);
};


//create a function to get current UV index using lon and lat
var getAllWeather = function(allWeather) {
    var uvQueryUrl = "https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly&appid="+apiKey;
    fetch(uvQueryUrl).then(function(response) {
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

    // handle the current day weather icon here becuase this function gets called when the second API call gives a response
    var currentWeatherIcon = $("<img>");
    var currIconCode = cityInfo.current.weather[0].icon;
    console.log(currIconCode);
    var currIconURL = "http://openweathermap.org/img/wn/" + currIconCode + "@2x.png";
    currentWeatherIcon.attr('src', currIconURL);
    currentWeatherIcon.append(currIconURL).appendTo(citySearchTerm);
    
    // make sure to clear out old content before displaying new input content
    cityInfoContainerEl.textContent = "";
    
    // go throught the data for selected city and format the data for temperature, wind, humidity and UV
    var temp = "Temp: " + cityInfo.current.temp + "°F";
    var wind = "Wind: " + cityInfo.current.wind_speed + " MPH";
    var humidity = "Humidity: " + cityInfo.current.humidity + "%";
    
    var tempEl = $("<div></div>").appendTo(cityInfoContainerEl).addClass("param-list-item flex-row justify-space-between align-center");
    var tempTitleEl = $("<span></span>").appendTo(tempEl).text(temp);
    
    var windEl = $("<div></div>").appendTo(cityInfoContainerEl).addClass("param-list-item flex-row justify-space-between align-center");
    var windTitleEl = $("<span></span>").appendTo(windEl).text(wind);

    var humidEl = $("<div></div>").appendTo(cityInfoContainerEl).addClass("param-list-item flex-row justify-space-between align-center");
    var humidTitleEl = $("<span></span>").appendTo(humidEl).text(humidity);

    //handle UV index and check its status to display the color-code
    var uvContainer = $("<div></div").appendTo(cityInfoContainerEl).addClass("param-list-item flex-row justify-space-between align-center");
    var uvTitleEl = $("<span></span>").appendTo(uvContainer).text("UV index: ");
    var uvIndexEl = $("<span></span>");
    if(cityInfo.current.uvi >= 0 && cityInfo.current.uvi <= 4 ) {
        uvIndexEl.addClass("favorable");
    } else if(cityInfo.current.uvi >= 4 && cityInfo.current.uvi <= 7) {
        uvIndexEl.removeClass("favorable");
        uvIndexEl.addClass("moderate");
    } else if(cityInfo.current.uvi >= 7 && cityInfo.current.uvi <= 10) {
        uvIndexEl.removeClass("favorable");
        uvIndexEl.removeClass("moderate");
        uvIndexEl.addClass("severe");
    };
    uvIndexEl.append(cityInfo.current.uvi).appendTo(uvContainer);

    getFutureForecast(cityInfo);

    // call saveWeather function so the data will be saved in local storage once it's displayed
    //saveWeather();
};


var getFutureForecast = function(cityInfo) {

    // create a variable to store an array of dialy forecast and get the values for 5 days
    var dailyArray = cityInfo.daily;
   
    var dayOneIcon = $("<img>");
    var icon1 = cityInfo.daily[0].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/"+icon1+"@2x.png";
    dayOneIcon.attr('src', iconURL).append(iconURL).appendTo($("#iconday1"));

    $("#temp1").text("");
    var temp1 = $("<span>").text("Temp: " + dailyArray[0].temp.day + " °F");
    $("#temp1").append(temp1);

    $("#wind1").text("");
    var wind1 = $("<span>").text("Wind: " + dailyArray[0].wind_speed + " MPH");
    $("#wind1").append(wind1);

    $("#humid1").text("");
    var humid1 = $("<span>").text("Humidity: " + dailyArray[0].humidity + " %");
    $("#humid1").append(humid1);

    // ---------- 2nd day after current day -----------//
    var dayTwoIcon = $("<img>");
    var icon2 = cityInfo.daily[1].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/"+icon2+"@2x.png";
    dayTwoIcon.attr('src', iconURL).append(iconURL).appendTo($("#iconday2"));

    $("#temp2").text("");
    var temp2 = $("<span>").text("Temp: " + dailyArray[1].temp.day + " °F");
    $("#temp2").append(temp2);

    $("#wind2").text("");
    var wind2 = $("<span>").text("Wind: " + dailyArray[1].wind_speed + " MPH");
    $("#wind2").append(wind2);

    $("#humid2").text("");
    var humid2 = $("<span>").text("Humidity: " + dailyArray[1].humidity + " %");
    $("#humid2").append(humid2);

    // ---------- 3rd day after current day -----------//
    var dayThreeIcon = $("<img>");
    var icon3 = cityInfo.daily[2].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/"+icon3+"@2x.png";
    dayThreeIcon.attr('src', iconURL).append(iconURL).appendTo($("#iconday3"));

    $("#temp3").text("");
    var temp3 = $("<span>").text("Temp: " + dailyArray[2].temp.day + " °F");
    $("#temp3").append(temp3);

    $("#wind3").text("");
    var wind3 = $("<span>").text("Wind: " + dailyArray[2].wind_speed + " MPH");
    $("#wind3").append(wind3);

    $("#humid3").text("");
    var humid3 = $("<span>").text("Humidity: " + dailyArray[2].humidity + " %");
    $("#humid3").append(humid3);

    // ---------- 4th day after current day -----------//
    var dayFourIcon = $("<img>");
    var icon4 = cityInfo.daily[3].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/"+icon4+"@2x.png";
    dayFourIcon.attr('src', iconURL).append(iconURL).appendTo($("#iconday4"));

    $("#temp4").text("");
    var temp4 = $("<span>").text("Temp: " + dailyArray[3].temp.day + " °F");
    $("#temp4").append(temp4);

    $("#wind4").text("");
    var wind4 = $("<span>").text("Wind: " + dailyArray[3].wind_speed + " MPH");
    $("#wind4").append(wind4);

    $("#humid4").text("");
    var humid4 = $("<span>").text("Humidity: " + dailyArray[3].humidity + " %");
    $("#humid4").append(humid4);

    // ---------- 5th day after current day -----------//
    var dayFiveIcon = $("<img>");
    var icon5 = cityInfo.daily[4].weather[0].icon;
    var iconURL = "http://openweathermap.org/img/wn/"+icon5+"@2x.png";
    dayFiveIcon.attr('src', iconURL).append(iconURL).appendTo($("#iconday5"));

    $("#temp5").text("");
    var temp5 = $("<span>").text("Temp: " + dailyArray[4].temp.day + " °F");
    $("#temp5").append(temp5);

    $("#wind5").text("");
    var wind5 = $("<span>").text("Wind: " + dailyArray[4].wind_speed + " MPH");
    $("#wind5").append(wind5);

    $("#humid5").text("");
    var humid5 = $("<span>").text("Humidity: " + dailyArray[4].humidity + " %");
    $("#humid5").append(humid5);
    
};

// add submit event listener to the cityFormEl
cityFormEl.addEventListener("submit", formSubmitHandler);


// => sub for function
searchHistoryContainer.addEventListener("click", () => {
    // cityInfoContainerEl.empty();
    const cityClicked = this.event.target.value;
    console.log(cityClicked, "click");
});



// var saveWeather = function() {

// };


// this function will be called when the page is loaded
//loadWeather();