var resultWeatherEl = document.querySelector("#result-weather");
var resultTextEl = document.querySelector("#result-text");
var weatherInputEl = document.getElementById("cityName");
var APIKey = "82a943e11b0e9d19839aec89044e37c6";

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
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light','text-dark')
  if(resultsObj.main){
    resultCard.innerHTML +=
    '<strong>Date:</strong>' + resultsObj.dt_txt + '<br/>'
    '<strong>Temp:</strong>' + resultsObj.main.temp + '<br/>' + '<strong>Temp_Max:</strong>'+resultsObj.main.temp_max + '<br/v'
    '<strong>Temp_Low:</strong>'+ resultsObj.main.temp_low;
  } else{
    resultCard.innerHTML +=
    '<strong>Main:</strong> No main for this entry. ';
  }
  resultWeatherEl.append(resultCard);
}

document.getElementById("searchCity").addEventListener("click", getWeatherApi);
