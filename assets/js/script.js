// variables
const searchedCities = JSON.parse(localStorage.getItem("cityHistory")) || [];

let apiKey = "c8bf9352a7fc31b88f1966db48bcdf4f";

// functions
function handleCoords(searchCity) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}`;

  fetch(fetchUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("There was a problem with the response");
      }
    })

    .then(function (data) {
      handleCurrentWeather(data.coord, data.name);
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleCurrentWeather(coordinates, city) {
  const lat = coordinates.lat;
  const lon = coordinates.lon;

  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`;

  fetch(fetchUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      displayCurrentWeather(data.current, city);
      displayFiveDayWeather(data.daily);
    });
}

function displayCurrentWeather(currentCityData, cityName) {
  let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;

  document.querySelector(
    "#currentWeather"
  ).innerHTML = `<h2 class="h2">${cityName}, ${moment
    .unix(currentCityData.dt)
    .format(
      "MMM Do YY"
    )} <img src="${weatherIcon}"></h2><div>Weather forecast: ${
    currentCityData.weather[0].description
  } </div> <div>Temp: ${currentCityData.temp} \xB0F</div> <div>Wind Speed: ${
    currentCityData.wind_speed
  } MPH</div> <div>Humidity: ${
    currentCityData.humidity
  }%</div> <div>UV Index: <span  id="uvi"  >${
    currentCityData.uvi
  }</span></div>`;

  //uvi
  let uviRay = currentCityData.uvi;
  if (uviRay <= 4) {
    document.querySelector("#uvi").classList.add("bg-success");
  } else if (uviRay <= 8 && uviCurrent >= 4) {
    document.querySelector("#uvi").classList.add("bg-warning");
  } else {
    document.querySelector("#uvi").classList.add("bg-danger");
  }
}

function displayFiveDayWeather(fiveDayCityData) {
  const cityData = fiveDayCityData.slice(1, 6);
  document.querySelector("#fiveDayWeather").innerHTML = "";

  cityData.forEach((day) => {
    let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    document.querySelector(
      "#fiveDayWeather"
    ).innerHTML += `<div class="col-sm m-1 p-2 card"><div>${moment
      .unix(day.dt)
      .format(
        "MMM Do YY"
      )}</div> <div><img src="${weatherIcon}"></div><div>Weather forecast: ${
      day.weather[0].description
    } </div> <div>High of: ${day.temp.max} \xB0F</div> <div>Wind Speed: ${
      day.wind_speed
    } MPH</div> <div>Humidity: ${day.humidity}%</div> </div>`;
  });
}
//addmore

function handleFormSubmit(event) {
  document.querySelector("#searchHistory").innerHTML = "";
  event.preventDefault();

  const city = document.querySelector("#searchInput").value.trim();
  searchedCities.push(city);

  //filter
  const filteredCities = searchedCities.filter((city, index) => {
    return searchedCities.indexOf(city) === index;
  });
  localStorage.setItem("cityHistory", JSON.stringify(filteredCities));

  showHistory(filteredCities);
  handleCoords(city);
}

//show history
function showHistory(allCities) {
  allCities.forEach((city) => {
    document.querySelector(
      "#searchHistory"
    ).innerHTML += `<button class="btn btn-primary" data-city="${city}">${city}</button>`;
  });
}

function handleHistory(event) {
  const city = event.target.getAttribute("data-city");
  handleCoords(city);
}

document
  .querySelector("#searchForm")
  .addEventListener("submit", handleFormSubmit);
document
  .querySelector("#searchHistory")
  .addEventListener("click", handleHistory);
