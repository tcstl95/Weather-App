var resultWeatherEl = document.querySelector("#result-weather");
var resultTextEl = document.querySelector("#result-text");
var weatherInputEl = document.getElementById("cityName");
var searchWeatherEl = document.querySelector("#search-weather");
var savedCity = document.querySelector("#saved-city");
var cityCount = document.querySelector("#city-count");
var saveButton = document.querySelector("#save");
var APIKey = "82a943e11b0e9d19839aec89044e37c6";
var cityList = [];

function getWeatherApi(event) {
  event.preventDefault();

  var city = weatherInputEl.value;
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey;

  fetch(weatherUrl)
    .then(function (response) {
      if (!response.ok) {
        console.log("Weather not found.");
        resultWeatherEl.innerHTML =
          "<h3> No weather results found, try again!</h3>";
        throw response.json();
      }

      return response.json();
    })
    .then(function (weaRes) {
      console.log(weaRes);
      var latVal = weaRes.coord.lat;
      var lonVal = weaRes.coord.lon;

      var lonlatWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latVal}&lon=${lonVal}&units=imperial&appid=${APIKey}`;
      fetch(lonlatWeatherURL)
        .then(function (response) {
          if (!response.ok) {
            console.log("Weather not found.");
            resultWeatherEl.innerHTML =
              "<h3> No weather results found, try again!</h3>";
            throw response.json();
          }
          return response.json();
        })
        .then(function (weatherData) {
          console.log(weatherData);
          for (var i = 0; i < weatherData.list.length; i += 8) {
            printWeatherApi(weatherData.list[i]);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    })
    .catch(function (error) {
      console.error(error);
    });
}

function printWeatherApi(resultsObj) {
  console.log(resultsObj);
  var resultCard = document.createElement("div");
  resultCard.classList.add("card", "bg-light", "text-dark");
  if (resultsObj.main) {
    resultCard.innerHTML +=
      "<strong>Date:</strong>" +
      resultsObj.dt_txt +
      "<br/>" +
      "<strong>Temp:</strong>" +
      resultsObj.main.temp +
      "<br/>" +
      "<strong>Temp_Max:</strong>" +
      resultsObj.main.temp_max +
      "<br/v>" +
      "<strong>Temp_Low:</strong>" +
      resultsObj.main.temp_min +
      "<br/v>"+
      "<strong>Humidity:</strong>"+
      resultsObj.main.humidity +
      "<br/>";
  } else {
    resultCard.innerHTML += "<strong>Main:</strong> No main for this entry. ";
  }
  resultWeatherEl.append(resultCard);
}

document
  .getElementById("searchCity")
  .addEventListener("click", function (event) {
    getWeatherApi(event);
    storeInput(event);
  });

function storeInput(event) {
  event.preventDefault();

  var searchText = weatherInputEl.value.trim();

  if (searchText === "") {
    return;
  }

  cityList.push(searchText);
  weatherInputEl.value = "";

  console.log(cityList);
  localStorage.setItem("cityNames", JSON.stringify(cityList));
}

function produceCities() {
  savedCity.innerHTML = "";
  cityCount.textContent = cityList.length;

  for (var i = 0; i < cityList.length; i++) {
    var city = cityList[i];

    var li = document.createElement("li");
    li.textContent = city;

    li.setAttribute("data-index", i);

    var button = document.createElement("button");
    button.textContent = "  City Saved";

    li.appendChild(button);
    savedCity.appendChild(li);
  }
}

function CityInit() {
  var storedCity = JSON.parse(localStorage.getItem("city"));

  if (storedCity !== null) {
    cities = storedCity;
  }
  produceCities();
}

function storeCity() {
  localStorage.setItem("city", JSON.stringify(cityList));
}

saveButton.addEventListener("click", function (event) {
  event.preventDefault();
  var cityText = weatherInputEl.value.trim();
  cityList.push(cityText);
  weatherInputEl.value = "";
  storeCity();
  produceCities();
  if (cityText === "") {
    return;
  }
});
