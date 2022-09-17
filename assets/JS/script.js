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
var weatherFormEl = $('weather-Form');
var cityInputEl = $('#cityfield');
var stateInputEl = $('#statefield');
var countryInputEl = $('#countryfield');
var historyList = $('#historyList');
var currentWeatherEl = $('currentWeather');
var futureWeatherEl = $('futureWeather');
var currentCityName = '';

// user can search for a City also save data into search history
function getUserInput(e) {
    e.preventDefault();

    var search ={};
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
        saveData ();

        // search renders into the li
        var liEl = $("<li>" + search.city + "</li>");
        liEl.attr('data-state', search.state);
        liEl.attr('data-country', search.country);
        historyList.prepend(liEl);
        console.log(previousSearchArray);
        renderAPI (search.city, search.state, search.country);
    }
    
    cityInputEl.val('');
    stateInputEl.val('');
    countryInputEl.val('');
}

weatherFormEl.on('submit', getUserInput);


// if clicked the same info can be viewed again

// city results will display the current conditions and future conditions

// display current city name, the date, an icon that represents the weather conditions, 
// the temperature, humidity, wind speed, and the UV index in a box

// data displayed for a 5-day forecast is the date, weather conditions icon, temp, windspeed and humidity

// City is added to a search history array
// Need to be saved locally
// delete button for search history

// Cities in search history can be selected.
// Once selected the same info can be viewed again.
// Consider a delete button for search history

init();