// Lab Game by Mark Foster - 2022

// Top bar numbers and state
var money = 100;
var currentDay = 1;
var currentGameTimeHours = 9;
var currentGameTimeMinutes = 0;
var currentGameTimeIsPM = false;

// Current tab & room selected
var currentRoom = "shipping";

// Background state
var usingDayBG = true;

// For getting delta time between ticks
var lastDate;

// References to elements
var background_daytime;

var date_tracker;
var time_tracker;
var money_tracker;

var room_tab_shipping;
var room_tab_laboratory;
var room_tab_office;
var room_tab_break_room;
var room_tab_storage;
var room_tab_ALL;
var tabs_bar;

// Initial setup
function Init () {
	// Get references to elements
	background_daytime = document.querySelector(".background.daytime");
	date_tracker = document.querySelector(".date_tracker");
	time_tracker = document.querySelector(".time_tracker");
	money_tracker = document.querySelector(".money_tracker");
	room_tab_shipping = document.querySelector(".room_tab.shipping");
	room_tab_laboratory = document.querySelector(".room_tab.laboratory");
	room_tab_office = document.querySelector(".room_tab.office");
	room_tab_break_room = document.querySelector(".room_tab.break_room");
	room_tab_storage = document.querySelector(".room_tab.storage");
	room_tab_ALL = document.querySelectorAll(".room_tab");
	tabs_bar = document.querySelector(".tabs_bar");

	// Switching tabs
	tabs_bar.addEventListener("click", TabClick);

	lastDate = Date.now();
	setTimeout(GameLoop, 100);
}

// Click a tab
function TabClick (event) {
	if (event.target.classList.contains("room_tab")) {
		var goToRoom = event.target.attributes.room.nodeValue;
		if (goToRoom !== undefined) {
			currentRoom = goToRoom;
			room_tab_ALL.forEach(function (value, index, list) {
				if (value.classList.contains(currentRoom)) {
					value.classList.add("selected_tab");
				}
				else {
					value.classList.remove("selected_tab");
				}
			});

		}
	}
}

// Game loop
function GameLoop () {
	// Loop forever
	setTimeout(GameLoop, 100);
	
	// Get delta time
	var newDate = Date.now();
	var deltaTime = newDate - lastDate;
	lastDate = newDate;

	currentGameTimeMinutes += deltaTime / 1000;
	// At 60 minutes, go to next hour
	if (currentGameTimeMinutes > 60) {
		currentGameTimeMinutes -= 60;
		currentGameTimeHours += 1;
		// At 12:00, switch AM and PM and possibly go to next day
		if (currentGameTimeHours === 12) {
			if (currentGameTimeIsPM) {
				// Just hit midnight, go to AM and progress day
				currentGameTimeIsPM = false;
				currentDay += 1;
			}
			else {
				// Just hit noon, switch from AM to PM
				currentGameTimeIsPM = true;
			}
		}
		if (currentGameTimeHours > 12) {
			currentGameTimeHours -= 12;
		}
	}
	money += 1;

	UpdateTopBar();
	UpdateBackground();
}

// Update the top bar stats
function UpdateTopBar () {
	// Update Day
	date_tracker.textContent = "Day " + currentDay;
	// Update Time
	var minutesText = Math.floor(currentGameTimeMinutes);
	if (minutesText < 10) {
		minutesText = "0" + minutesText;
	}
	time_tracker.textContent = currentGameTimeHours + ":" + minutesText + " " + (currentGameTimeIsPM ? "PM" : "AM");
	// Mpdate Money
	money_tracker.textContent = "$" + money.toFixed(2);
}

function UpdateBackground () {
	// Go to night
	if (usingDayBG && currentGameTimeIsPM && currentGameTimeHours === 8) {
		usingDayBG = false;
		background_daytime.classList.add("hidden");
	}
	// Go to day
	if (!usingDayBG && !currentGameTimeIsPM && currentGameTimeHours === 6) {
		usingDayBG = true;
		background_daytime.classList.remove("hidden");
	}
}
