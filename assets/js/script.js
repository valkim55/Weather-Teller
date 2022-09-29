var apiKey = "b711e217ca46753654634ae778a24382";

var cityName;
var lonRaw;
var latRaw;
var lon;
var lat;
var geoLocation = [];
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#cityName");
var searchHistoryContainer = document.querySelector("#search-history");

var rightSection = document.querySelector("#section-right");
rightSection.className = "col-12 col-md-9 col-lg-10";

var currentDayContainer = document.querySelector("#current-day");

var allCardsContainer = document.querySelector("#allCards");
allCardsContainer.className = "d-flex flex-wrap justify-content-between";

var cityInfoArray = [];


var formSubmitHandler = function (event) {
    event.preventDefault();
    // capture the value from <input>
    var userCityName = cityInputEl.value.trim();
    firstCall(userCityName);
};


var firstCall = function (userCityName) {
    // check if the input is not empty
    if (userCityName) {
        var queryURLcity = "https://api.openweathermap.org/data/2.5/weather?q=" + userCityName + "&appid=" + apiKey + "&units=imperial";
        // call the fetch api and pass the query URL as a parameter
        fetch(queryURLcity).then(function (response) {
            // check if the response is ok - meaning the requested city name exists and get lon/lat for that city
            if (response.ok) {
                response.json().then(function (data) {
                    getCityCoordinates(userCityName, data);
                    // check if entered city name isn't already in the storage array
                    if (!cityInfoArray.includes(userCityName)) {
                        cityInfoArray.push(userCityName);
                        localStorage.setItem("allCities", JSON.stringify(cityInfoArray));
                        createSearchHistory(cityInfoArray);
                    }
                });
            } else { alert("Error: City Name Not Found") }
        })
            //handle the response in case there's a network error
            .catch(function (error) {
                alert("Unable to connect to server");
            });
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }
};

var getCities = function () {
    cityInfoArray = JSON.parse(localStorage.getItem("allCities"))
    if (!cityInfoArray) {
        cityInfoArray = []
    } else {
        createSearchHistory(cityInfoArray)
    }
};

var createSearchHistory = function (cityInfoArray) {
    // empty before new inpit
    searchHistoryContainer.textContent = "";
    for (let i = 0; i < cityInfoArray.length; i++) {
        let cityBtnEl = document.createElement('button')
        cityBtnEl.setAttribute('id', 'savedCity')
        searchHistoryContainer.appendChild(cityBtnEl);
        cityBtnEl.textContent = cityInfoArray[i];
        cityBtnEl.className = "search-history-container text-uppercase";
        cityBtnEl.setAttribute("value", cityInfoArray[i]);
        // console.log(cityInfoArray[i])
    }
    
};

var getCityCoordinates = function (cityName, data) {
    lonRaw = data.coord.lon;
    latRaw = data.coord.lat;
    console.log(lonRaw, latRaw);
    lon = Math.round(lonRaw * 100) / 100;
    lat = Math.round(latRaw * 100) / 100;
    geoLocation.push(lon, lat);
    //console.log(geoLocation);
    getWeatherData(cityName, geoLocation);
};


var getWeatherData = function (cityName, coordinates) {
    var queryURLcoord = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
    fetch(queryURLcoord).then(function (response) {
        if (response.ok) {
            response.json().then(function (weatherData) {
                console.log(weatherData);
                displayWeather(cityName, weatherData);
                displayForecast(cityName, weatherData);
            });
        } else {
            console.log("data not found");
        }
    })
        .catch(function (error) {
            console.log("unable to connect to server");
        });
};


var displayWeather = function (cityName, weatherData) {
    currentDayContainer.textContent = "";
    currentDayContainer.className = "col-12 current-day";

    var cityTitleContainer = document.createElement("div");
    cityTitleContainer.className = "current-city-title text-uppercase";
    var currCityName = document.createElement("span");
    currCityName.textContent = cityName + " ";
    cityTitleContainer.appendChild(currCityName);
    currentDayContainer.appendChild(cityTitleContainer);

    var currCityTime = document.createElement("span");
    var date = new Date(); //current date
    var currCityOffset = weatherData.timezone_offset;
    var localTime = date.getTime(); // milliseconds elapsed between Unix epoch and given date
    var localOffset = date.getTimezoneOffset() * 60000;
    var utc = localTime + localOffset;
    var currentTime = utc + (1000 * currCityOffset);
    var newDate = new Date(currentTime);
    console.log(newDate.toLocaleDateString());
    currCityTime.textContent = newDate.toLocaleDateString();
    cityTitleContainer.appendChild(currCityTime);

    var currentWeatherIcon = document.createElement("img");
    var currIconCode = weatherData.current.weather[0].icon;
    var currIconURL = "http://openweathermap.org/img/wn/" + currIconCode + "@2x.png";
    currentWeatherIcon.setAttribute('src', currIconURL);
    cityTitleContainer.appendChild(currentWeatherIcon);

    var temp = "Temp: " + weatherData.current.temp + "°F";
    var tempEl = document.createElement("div");
    tempEl.className = "param-list-item flex-row justify-space-between align-center";
    var tempTitleEl = document.createElement("span");
    tempTitleEl.textContent = temp;
    tempEl.appendChild(tempTitleEl);
    currentDayContainer.appendChild(tempEl);

    var wind = "Wind: " + weatherData.current.wind_speed + " MPH";
    var windEl = document.createElement("div");
    windEl.className = "param-list-item flex-row justify-space-between align-center";
    var windTitleEl = document.createElement("span");
    windTitleEl.textContent = wind;
    windEl.appendChild(windTitleEl);
    currentDayContainer.appendChild(windEl);

    var humidity = "Humidity: " + weatherData.current.humidity + "%";
    var humidEl = document.createElement("div");
    humidEl.className = "param-list-item flex-row justify-space-between align-center";
    var humidTitleEl = document.createElement("span");
    humidTitleEl.textContent = humidity;
    humidEl.appendChild(humidTitleEl);
    currentDayContainer.appendChild(humidEl);

    //handle UV index and check its status to display the color-code
    var uvContainer = document.createElement("div");
    currentDayContainer.appendChild(uvContainer);
    uvContainer.className = "param-list-item flex-row justify-space-between align-center";
    var uvIndexEl = document.createElement("span");
    if (weatherData.current.uvi >= 0 && weatherData.current.uvi <= 4) {
        uvIndexEl.classList.add("favorable");
    } else if (weatherData.current.uvi >= 4 && weatherData.current.uvi <= 7) {
        uvIndexEl.classList.remove("favorable");
        uvIndexEl.classList.add("moderate");
    } else if (weatherData.current.uvi >= 7 && weatherData.current.uvi <= 10) {
        uvIndexEl.classList.remove("favorable");
        uvIndexEl.classList.remove("moderate");
        uvIndexEl.classList.add("severe");
    } else if (weatherData.current.uvi > 10) {
        uvIndexEl.classList.remove("favorable");
        uvIndexEl.classList.remove("moderate");
        uvIndexEl.classList.remove("severe");
        uvIndexEl.classList.add("danger");
    };
    uvIndexEl.textContent = "UV index: " + weatherData.current.uvi;
    uvContainer.appendChild(uvIndexEl);
    rightSection.appendChild(currentDayContainer);
};

var displayForecast = function (cityName, weatherData) {

    var dailyArray = weatherData.daily;
    allCardsContainer.textContent = "";

    var forecastHeader = document.createElement("h3");
    forecastHeader.className = "col-12 future-forecast hidden";
    forecastHeader.textContent = "Weather Forecast for the next 5 Days: ";
    allCardsContainer.appendChild(forecastHeader);

    for (var i = 1; i < 6; i++) {
        var dayCardContainer = document.createElement("div");
        dayCardContainer.className = "card card-content col-12 col-md-6 col-lg-2 mb-3";
        var dayCardHeader = document.createElement("h4");
        dayCardHeader.className = "card-header";
        var dailyDT = dailyArray[i].dt;
        var dtConverted = new Date(dailyDT * 1000);
        dayCardHeader.textContent = dtConverted.toLocaleDateString();
        dayCardContainer.appendChild(dayCardHeader);
        allCardsContainer.appendChild(dayCardContainer);

        var iconBox = document.createElement("div");
        var dayCardIcon = document.createElement("img");
        var dayIconCode = dailyArray[i].weather[0].icon;
        var dayIconURL = "http://openweathermap.org/img/wn/" + dayIconCode + "@2x.png";
        dayCardIcon.setAttribute('src', dayIconURL);
        iconBox.appendChild(dayCardIcon);
        dayCardContainer.appendChild(iconBox);

        var dailyTemp = document.createElement("div");
        dailyTemp.className = "param-list-item";
        dailyTemp.textContent = "Temp: " + dailyArray[i].temp.day + " °F";
        dayCardContainer.appendChild(dailyTemp);

        var dailyWind = document.createElement("div");
        dailyWind.className = "param-list-item";
        dailyWind.textContent = "Wind: " + dailyArray[i].wind_speed + " MPH";
        dayCardContainer.appendChild(dailyWind);

        var dailyHumid = document.createElement("div");
        dailyHumid.className = "param-list-item";
        dailyHumid.textContent = "Humidity: " + dailyArray[i].humidity + " %";
        dayCardContainer.appendChild(dailyHumid);
    }
    rightSection.appendChild(allCardsContainer);
};

searchHistoryContainer.addEventListener("click", (e) => {
    e.preventDefault();

    currentDayContainer.textContent = "";
    allCardsContainer.textContent = "";
    const cityClicked = this.event.target.value;
    firstCall(cityClicked);
    getWeatherData(cityClicked);
    //getCities(cityClicked);
    console.log(cityClicked, "click");
});

cityFormEl.addEventListener("submit", formSubmitHandler);

getCities();
