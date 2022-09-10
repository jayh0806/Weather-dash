// current date
	let $cityDate = moment().format("llll");
	$("#currentdate").text($cityDate);
	

	/* City Search Functions */
	let $clicked = $(".buttonsearch");
	$clicked.on("click", citysearch);
	$clicked.on("click", searchSave);
	
	$("input").keyup(function () {
	    if (event.key === "Enter") {
	        $clicked.click();
	    }
	})
	// Seachcityname function
	function citysearch() {
	    let cityname = (($(this).parent()).siblings("#cityenter")).val().toLowerCase();
	    function clear() {
	        $("#cityenter").val("");
	    }
	    setTimeout(clear, 300);
	    //Query for Current Weather  
	    let firstQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
	        cityname + "&units=imperial&appid=e7c303b6206e1039548ab3f11d2207b3";
	    $.ajax({
	        url: firstQueryURL,
	        method: "GET"
	    }).then(function (response) {
	        console.log(response);
	        // var current information
	        let $currentTemp = parseInt(response.main.temp) + "°F";
	        let $currentHum = response.main.humidity + "%";
	        let $currentWind = parseInt(response.wind.speed) + "mph";
	        let $currentIcon = response.weather[0].icon;
	        let $currentIconURL = "http://openweathermap.org/img/w/" + $currentIcon + ".png";
	

	        // display in html
	        $("#namecity").text(cityname);
	        $("#tempcity").text( $currentTemp);
	        $("#humcity").text( $currentHum);
	        $("#windspeed").text( $currentWind);
	        $("#weathericon").attr({ "src": $currentIconURL, "alt": "Current Weather Icon" });
	        
	        let lat = response.coord.lat;
	        let lon = response.coord.lon;
	        /* info for 5 Day Forecast cards */
	        let secondQueryURL =
	            "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +
	            "&exclude=hourly&units=imperial&appid=e7c303b6206e1039548ab3f11d2207b3";
	        $.ajax({
	            url: secondQueryURL,
	            method: "GET"
	        }).then(function (response) {
	            console.log(response);
	            let $uv = response.current.uvi;
	            // var for displaying in html 
	            let $uvIndex = $("#uv-index");
	            $uvIndex.text($uv);
	            $uvIndex.blur();
	            // if conditionals to 
	            if ($uv <= 2) {
	                $uvIndex.addClass("btn-success");
	                $uvIndex.removeClass("btn-warning btn-hazard btn-danger btn-climate-change");
	            }
	            else if ($uv <= 5) {
	                $uvIndex.addClass("btn-warning");
	                $uvIndex.removeClass("btn-success btn-hazard btn-danger btn-climate-change");
	            }
	            // .btn-hazard is a custom class, Bootstrap-see style
	            else if ($uv <= 7) {
	                $uvIndex.addClass("btn-hazard");
	                $uvIndex.removeClass("btn-success btn-warning btn-danger btn-climate-change");
	            }
	            else if ($uv <= 10.99) {
	                $uvIndex.addClass("btn-danger");
	                $uvIndex.removeClass("btn-success btn-warning btn-hazard btn-climate-change");
	            }
	            // .btn-climate-change
	            else if ($uv >= 11) {
	                $uvIndex.addClass("btn-climate-change");
	                $uvIndex.removeClass("btn-success btn-warning btn-hazard btn-danger");
	            }
	            // Date Assignment 
	            // array to hold timestamps
	            let days = [];
	            
	            for (i = 1; i < 6; i++) {
	                days[i] = response.daily[i].dt;
	            }
	            days = days.filter(item => item);
	            // convert, extract, display:
	            for (i = 0; i < days.length; i++) {
	                days[i] = moment.unix(days[i]);
	                days[i] = days[i].format("ddd,ll");
	                $("#day" + i).text(days[i]);
	            }
	            console.log(days);
	            // array for highTemps on cards
	            let highTemps = [];
	            
	            for (i = 1; i < 6; i++) {
	                highTemps[i] = parseInt(response.daily[i].temp.max) + "°F";
	            }
	            highTemps = highTemps.filter(item => item);
	            // loop through and display
	            for (i = 0; i < highTemps.length; i++) {
	                $("#highday" + i).text("High: " + highTemps[i]);
	            }
	            // same process for lows 
	            let lowTemps = [];
	            for (i = 1; i < 6; i++) {
	                lowTemps[i] = parseInt(response.daily[i].temp.min) + "°F";
	            }
	            lowTemps = lowTemps.filter(item => item);
	            for (i = 0; i < lowTemps.length; i++) {
	                $("#lowday" + i).text("Low: " + lowTemps[i]);
	            }
	            
	            let hums = [];
	            for (i = 1; i < 6; i++) {
	                hums[i] = response.daily[i].humidity + "%";
	            }
	            hums = hums.filter(item => item);
	            for (i = 0; i < hums.length; i++) {
	                $("#humday" + i).text("Humidity: " + hums[i]);
	            }
	            //  for icons, w/ extra step
	            let icons = [];
	            
	            let iconsURL = [];
	            for (i = 1; i < 6; i++) {
	                icons[i] = response.daily[i].weather[0].icon;
	            }
	            icons = icons.filter(item => item);
	            // filling iconsURL[] w/ unique URLs using icons[] indices
	            for (i = 0; i < icons.length; i++) {
	                iconsURL[i] = "http://openweathermap.org/img/w/" + icons[i] + ".png";
	            }
	            for (i = 0; i < iconsURL.length; i++) {
	                $("#icon" + i).attr({ "src": iconsURL[i], "alt": "Daily Weather Icon" });
	            }
	        });
	    });
	}
	// fillFromStorage fills sidebar with anthything in localStorage
	$(document).ready(function () {
	    // if localStorage is not empty, call fillFromStorage()
	    if (localStorage.getItem("cities")) {
	         // grab data, parse and push into searchHistory[], s
	         historydisplay = localStorage.getItem("cities", JSON.stringify(historydisplay));
	         historydisplay = JSON.parse(historydisplay);
	         // iterate through searchHistory, displaying in HTML
	         for (i = 0; i <= historydisplay.length - 1; i++) {
	             $("#search" + i).text(historydisplay[i]);
	         }
	 
	         let lastIndex = (historydisplay.length - 1);
	         // concat a jQuery selector & click listener that calls savedsearch()
	         $("#search" + lastIndex).on("click", savedsearch);
	         // .trigger() method that 'clicks' on that #searchx
	         $("#search" + lastIndex).trigger("click");
	     }
	 });
	    
	// Array  display HISTORY
	let historydisplay = [];
	// Function to Load and display Search
	function searchSave() {
	    
	    let newcity = (($(this).parent()).siblings("#cityenter")).val().toLowerCase();
	    console.log(newcity);
	    historydisplay.push(newcity);
	    historydisplay = [...new Set(historydisplay)];
	    // put in localStorage
	    localStorage.setItem("cities", JSON.stringify(historydisplay));
	    // display in HTML
	    for (i = 0; i <= historydisplay.length - 1; i++) {
	        // iterate through,
	        $("#search" + i).text(historydisplay[i]);
	        // add .past class to create listener (below),
	        $("#search" + i).addClass("past");
	    }
	}
	

	$("section").on("click", ".past", savedsearch);
	

	function savedsearch() {
	    // var  pastcityname
	    let $oldCity = $(this).text();
	    
	    $("#cityenter").val($oldCity);
	    
	    $clicked.trigger("click");
	}
	

	// Function to reinitilaize the Hisory
	let $clear = $("#clearhist");
	$clear.on("click", function () {
	    //clear local storage
	    localStorage.clear();
	    //clear the History Display
	    historydisplay = []
	    for (i = 0; i < 11; i++) {
	        $("#search" + i).text("");
	    }
	

	}); 
