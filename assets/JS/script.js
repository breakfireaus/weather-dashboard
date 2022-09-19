var currentDateEl = $('#date-and-time');
var currentDate;

function currentMomentDate() {
    currentDate = moment().format('LLLL');
    currentDateEl.text(currentDate);
};
// Weather refreshes on a set Interval
var refresh = setInterval(function () {
    currentMomentDate();
}, 1000);


function init() {
    currentMomentDate();
    loadData();
    displaySearchHistory();
};

// API 
var APIkey = "fe7c4a49b2f70c76f7ca3f6d351a96ee";
var rawCityInfo = {};
var currentCityInfo = {};
var previousSearchArray = [];

// Latitude and Longitude from the api
var cityLongitude = 0;
var cityLatitude = 0;

var aside = $('aside');
var weatherFormEl = $('#weather-Form');
var cityInputEl = $('#cityfield');
var stateInputEl = $('#statefield');
var countryInputEl = $('#countryfield');
var historyList = $('#historyList');
var currentWeatherEl = $('#currentWeather');
var futureWeatherEl = $('#futureWeather');
var currentCityName = '';
var btnSubmit = $('#action-submit-city')
// obtain data from the user input can search for a City also save data into search history
function getUserInput(e) {
    e.preventDefault();
    e.stopPropagation()

    var search = {};
    if (cityInputEl.val() !== '') {
        // stores the users search as an object
        search.city = cityInputEl.val().toLowerCase();
        search.state = stateInputEl.val().toUpperCase();
        search.country = countryInputEl.val().toUpperCase();

        // Capitilise first letter for the city
        var arr = search.city.split('');
        arr[0].toUpperCase();
        search.city = arr.join('');

        // Sets the global city name
        currentCityName = search.city;

        // object is then saved to the object
        previousSearchArray.unshift(search);
        saveData();

        // search renders into the li
        var liEl = $("<li>" + search.city + "</li>");
        liEl.attr('data-state', search.state);
        liEl.attr('data-country', search.country);
        historyList.prepend(liEl);

        console.log(previousSearchArray);
        renderAPI(search.city, search.state, search.country);
    }

    cityInputEl.val('');
    stateInputEl.val('');
    countryInputEl.val('');
    return false
}

btnSubmit.on('click', getUserInput);

// obtain data from search history Li Element
function searchByHistory(event) {
    event.preventDefault();
    var element = event.target;
    if (element.matches("li") === true) {
        var cityName = element.textContent;
        var cityState = element.getAttribute("data-state");
        var cityCountry = element.getAttribute("data-country");

        //sets global variable of the current city
        currentCityName = element.textContent;

        //Adds search history to list
        var liEl = $("<li>" + cityName + "</li>");
        liEl.attr('data-state', cityState);
        liEl.attr('data-country', cityCountry);
        historyList.prepend(liEl);

        //saves history list 
        var search = {};
        search.city = cityName;
        search.state = cityState;
        search.country = cityCountry;

        // Object saved into search history array
        previousSearchArray.unshift(search);
        saveData();

        renderAPI(cityName, cityState, cityCountry);

        // Clears search history list
    if (element.matches('button') === true) {
        searchHistroyArray = [];
        historyList.empty();
        saveData();
    }
    }

    // clear the search history 

    if (element.matches('button') === true) {
        previousSearchArray = [];
        historyList.empty();
        saveData();
    }
}


aside.on("click", searchByHistory)

// city results will display the current conditions and future conditions

// Render the API info - Forces all async functions to sync *Must be labeled an a sync function with an async action such as fetch*
async function renderAPI (cityName, cityState, cityCountry) {
    // Async functions
    await nameConverter (cityName, cityState, cityCountry);
    await obtainCityInfoAPI();

    //after these function occur for the sync
    processtheCityWeather();
    displaytheCityInfo();

    // Unhides weather boxes
    currentWeatherEl.removeClass('hidden');
    futureWeatherEl.removeClass('hidden');
    console.log('Raw info: ', rawCityInfo);
}

async function nameConverter(cityName, cityState, cityCountry) {
    // https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    // creates the query string
    var queryString = '';
    queryString += (cityName);
    if (cityState !== '') {
        queryString += (',' + cityState);
    }

    if (cityCountry !== '') {
        queryString += (',' + cityCountry);
    }

    var limit = 1;

    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + queryString + '&limit=' + limit + '&appid=fe7c4a49b2f70c76f7ca3f6d351a96ee'
    console.log(requestUrl);
    // Fetch longitude and Latitude
    await fetch(requestUrl, {
        credentials: 'same-origin'
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //loop over the fech response. right now the array is one item but it may be scaled
            //this assigns the longitude and latitude for the city
            for (var i = 0; i < data.length; i++) {
                cityLongitude = data[i].lon;
                cityLatitude = data[i].lat;
            }
        })
}

// this will request the city info from the API using the long and lat and stores it in the current city object
async function obtainCityInfoAPI() {
    // async functions
    var requestUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + cityLatitude + '&lon=' + cityLongitude + '&units=metric' + '&appid=fe7c4a49b2f70c76f7ca3f6d351a96ee';

    await fetch(requestUrl, {
        credentials: 'same-origin'

    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            rawCityInfo = data;
        });
}

// Displays city info for current and future
function displayCityInfo() {
    displayCurrentCityInfo();
    displayFutureCityInfo();
}

// display current city name, the date, an icon that represents the weather conditions, 
// the temperature, humidity, wind speed, and the UV index in a box
function displayCurrentCityInfo() {
    // Emptys all child elements
    currentWeatherEl.empty();
    // creates a header
    currentWeatherEl.append('<h2 class="col-12" id="currentWeatherHeader">Current Weather</h2>');


    // Obtains currentCity object values
    var cityName = currentCityName;
    var cityDate = currentCityInfo.date;
    var icon = currentCityInfo.icon;
    var temp = currentCityInfo.temp;
    var humidity = currentCityInfo.humidity;
    var wind = currentCityInfo.wind;
    var uvIndex = currentCityInfo.uv;

    var month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(cityDate);
    var month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(cityDate);

    var lastNumber = day[day.length - 1]
    if (lastNumber === 1) {
        day += 'st';
    }
    else if (lastNumber === 2) {
        day += 'nd';
    }
    else if (lastNumber === 4) {
        day += 'rd';
    }
    else {
        day += 'th';
    }

    cityDate = month + ' ' + day;

    //creates  all the current city elements
    var cityMainEl = $('<div id="currentCityMain" class="row"></div>');
    var cityNameEl = $('<div class=""><h1 id="currentCityHeader">' + cityName + '</h1></div>');
    var cityDateEl = $('<div class=""><h2>' + cityDate + '</h2></div>');
    var iconEl = $('<div class=""><img src=' + icon + '></div>');

    // element headers
    var citySubEl = $('<div id="currentCitySub" class="row"></div>');
    var tempEl = $('<div class=""><h4>' + 'Temperature: ' + '</h4>' + '<p>' + temp + '</p></div>');
    var humidityEl = $('<div class=""><h4>' + 'Humidity: ' + '</h4>' + '<p>' + humidity + '</p></div>');
    var windEl = $('<div class=""><h4>' + 'Wind Speed: ' + '</h4>' + '<p>' + wind + '</p></div>');

    // This element also needs additional paramenters
    var uvClass = '';
    var uvText = '';
    if (uvIndex <= 2) {
        uvClass = 'uv-low'
        uvText = ' Low';
    } else if (uvIndex <= 7) {
        uvClass = 'uv-mod';
        uvText = ' Moderate';
    }
    else {
        uvClass = 'uv-high';
        uvText = ' High';
    }
    var uvIndexEl = $('<div class=""><h4>' + 'UV Index: ' + '</h4>' + '<p>' + uvIndex + '<span class="' + uvClass + '">' + uvText + '</span></p></div>');

    var elementArr = [cityNameEl, iconEl, cityDateEl];
    for (var i = 0; i < elementArr.length; i++) {
        cityMainEl.append(elementArr[i]);
    }

    elementArr = [tempEl, humidityEl, windEl, uvIndexEl];
    for (var i = 0; i < elementArr.length; i++) {
        citySubEl.append(elementArr[i]);
    }

    currentWeatherEl.append(cityMainEl);
    currentWeatherEl.append(citySubEl);
}

// data displayed for a 5-day forecast is the date, weather conditions icon, temp, windspeed and humidity
function displayFutureCityInfo() {
    // empty child elements
    futureWeatherEl.empty();
    //creates the header
    futureWeatherEl.append('<h2 id="futureWeatherHeader" class="col-12">5-Day Forecast</h2>');
    // Obtains FutureCityInfo object values
    for (var k = 1; k < Object.keys(futureCityInfo).length + 1; k++) {

        var day = 'day' + k;
        var cityName = currentCityName;
        var cityDate = futureCityInfo[day].date;
        var icon = futureCityInfo[day].icon;
        var tempHigh = futureCityInfo[day].tempHigh;
        var tempLow = futureCityInfo[day].tempLow;
        var humidity = futureCityInfo[day].humidity;
        var wind = futureCityInfo[day].wind;
    }

    // adds ordinal to date
    var month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(cityDate);
    var day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(cityDate);

    var lastNumber = day[day.length - 1]
    if (lastNumber === 1) {
        day += 'st';
    }
    else if (lastNumber === 2) {
        day += 'nd';
    }
    else if (lastNumber === 4) {
        day += 'rd';
    }
    else {
        day += 'th';
    }

    cityDate = month + ' ' + day;

    // Creates elements based off the values
    var cityMainEl = $('<div class="futureCityMain"></div>');
    var cityNameEl = $('<div><h2>' + cityName + '</h2></div>');
    var cityDateEl = $('<div><h3>' + cityDate + '</h3></div>');
    var iconEl = $('<div><img src=' + icon + '></div>');
    // These elements need headers
    var citySubEl = $('<div class="futureCitySub"></div>');
    var tempEl = $('<div><h4>' + 'Temperature: ' + '</h4>' + '<p>High: ' + tempHigh + '</p><p>Low: ' + tempLow + '</p></div>');
    var humidityEl = $('<div><h5>' + 'Humidity: ' + '</h5>' + '<p>' + humidity + '</p></div>');
    var windEl = $('<div><h5>' + 'Wind Speed: ' + '</h5>' + '<p>' + wind + '</p></div>');

    // Appends elements
    var elementArr = [cityNameEl, cityDateEl, iconEl];
    for (var i = 0; i < elementArr.length; i++) {
        cityMainEl.append(elementArr[i]);
    }

    elementArr = [tempEl, humidityEl, windEl];
    for (var i = 0; i < elementArr.length; i++) {
        citySubEl.append(elementArr[i]);
    }

    var futureCityEl = $('<div class="futureCityCard"></div>');
    futureCityEl.append(cityMainEl);
    futureCityEl.append(citySubEl);

    futureWeatherEl.append(futureCityEl);

}

// function to process the city weather 
function processtheCityWeather() {
    processCurrentWeather();
    processFutureWeather();
}

// Current weather
function processCurrentWeather() {

    // Converts unix date
    var date = new Date(rawCityInfo.current.dt * 1000);
    currentCityInfo.date = date;

    // Icon image representing current weather. Uses API icon code
    console.log(rawCityInfo)
    var iconCode = rawCityInfo.current.weather[0].icon;
    currentCityInfo.icon = 'http://openweathermap.org/img/w/' + iconCode + '.png';

    // Humidity
    var humidity = rawCityInfo.current.humidity;
    currentCityInfo.humidity = humidity + '%';

    // uvIndex
    var uv = rawCityInfo.current.uvi;
    currentCityInfo.uv = uv;
    console.log('currrent city info: ', currentCityInfo);
}
// Future weather
function processFutureWeather() {

    // Start loop at 1 because 0 is current day's forecast.
    for (var k = 1; k < 6; k++) {
        // Creates day objects
        var day = 'day' + k;
        futureCityInfo[day] = {};

        // Converts unix date
        var date = new Date(rawCityInfo.daily[k].dt * 1000);
        futureCityInfo[day].date = date;

        // Icon image representing current weather. Uses API icon code
        var iconCode = rawCityInfo.daily[k].weather[0].icon;
        futureCityInfo[day].icon = 'http://openweathermap.org/img/w/' + iconCode + '.png';

        // Humidity
        var humidity = rawCityInfo.daily[k].humidity;
        futureCityInfo[day].humidity = humidity + '%';
    }

    console.log('future city info: ', futureCityInfo);
}
// Save data locally from input
function saveData() {
    // Stores new data into the object
    localStorage.setItem("citySearches", JSON.stringify(previousSearchArray));
}

// loads local data if present
function loadData () {
    // Stores new data into the object
    var storedCityData = JSON.parse(localStorage.getItem("citySearches"));
    if (storedCityData !== null) {
        previousSearchArray = storedCityData;
    }
}

// Displays search history
function displaySearchHistory () {
    for (var k = 0; k < previousSearchArray.length; k++) {
        var liEl = $("<li>" + previousSearchArray[k].city + "</li>");
        liEl.attr('data-state', previousSearchArray[k].state);
        liEl.attr('data-country', previousSearchArray[k].country);
        historyList.append(liEl);
    }
}

init();