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
var APIkey = "fe7c4a49b2f70c76f7ca3f6d351a96ee";





// Maybe add some autolocation...refresh the time and date

// user can search for a City
// city can be added to search history
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