// Displays current date:
let $cityDate = moment().format("MMMM Do YYYY");
$("#current-date").text($cityDate);
let apiKey = "7a2a4531b6dde918bafd9e09e87424dd";

// City search function
let $clicked = $(".buttonsearch");
$clicked.on("click", citySearch);
$clicked.on("click", searchSave);
// search city name function
function citySearch() {
    let cityName = (($(this).parent()).siblings("#city-enter")).val().toLowerCase();
    // Clears city enter button after text is submitted
    function clear() {
        $("#city-enter").val("");
    }
    setTimeout(clear, 300);

    // Query for current weather using Weather API and Ajax
    let firstQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: firstQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    // Initializes jQuery data variables for pulled data:
    let $currentTemp = parseInt(response.main.temp) + "F";
    let $currentHum = response.main.humidity + "%";
    let $currentWind = parseInt(response.wind.speed) + "mph";
    let $currentIcon = response.weather[0].icon;
    let $currentIconURL = "http://openweathermap.org/img/w/" + $currentIcon + ".png";

    // Display querried information in html:
    $("#name-city").text(cityName);
    $("#temp-city").text($currentTemp);
    $("#hum-city").text($currentHum);
    $("#wind-speed").text($currentWind);
    $("weathericon").attr({"src": $currentIconURL, "alt": "Current Weather Icon"});

    let secondQueryURL =
        "api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
    $.ajax({
        url: secondQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    }) 
})
};

$(document).ready(function () {
    // if localStorage is not empty, call fillFromStorage()
    if (localStorage.getItem("cities")) {
         // Grab data, parse and push into searchHistory[], s
        historydisplay = localStorage.getItem("cities", JSON.stringify(historydisplay));
        historydisplay = JSON.parse(historydisplay);
         // Iterate through searchHistory, displaying in HTML
        for (i = 0; i <= historydisplay.length - 1; i++) {
            $("#search" + i).text(historydisplay[i]);
        }

        let lastIndex = (historydisplay.length - 1);
         // Concat a jQuery selector & click listener that calls savedsearch()
        $("#search" + lastIndex).on("click", savedsearch);
         // .trigger() method that 'clicks' on that #search
        $("#search" + lastIndex).trigger("click");
    }
});

// Array to display the list of history
let historydisplay = [];
// Function to Load Seach In local Storage and Display on HTML page
function searchSave() {
    // Same jQuery selector from citysearch() puts value into newcity
    let newcity = (($(this).parent()).siblings("#city-enter")).val().toLowerCase();
    console.log(newcity);
    historydisplay.push(newcity);
    historydisplay = [...new Set(historydisplay)];
    // Save in local storage
    localStorage.setItem("cities", JSON.stringify(historydisplay));
    // display in HTML
    for (i = 0; i <= historydisplay.length - 1; i++) {
        // iterate through, displaying in HTML
        $("#search" + i).text(historydisplay[i]);
        // add .past class to create listener (below),
        $("#search" + i).addClass("past");
    }
}

$("section").on("click", ".past", savedsearch);

function savedsearch() {
    // Initialize variable for already searched city
    let $oldCity = $(this).text();
    // Put it in the input field
    $("#city-enter").val($oldCity);
    // Triggers the original click listener, above citysearch()
    $clicked.trigger("click");
}

// Function to reinitilaize the History
let $clear = $("#clear-history");
$clear.on("click", function () {
    // Clear local storage
    localStorage.clear();
    // Clear the History Display
    historydisplay = []
    for (i = 0; i < 11; i++) {
        $("#search" + i).text("");
    }

}); 
