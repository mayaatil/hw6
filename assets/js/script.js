// variables
const searchedCities = JSON.parse(localStorage.getItem("cityHistory")) || [];

// functions
function handleCoords(searchCity) {
  const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

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

  const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

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
    .format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${
    currentCityData.temp
  } \xB0F</div> <div>Wind Speed: ${
    currentCityData.wind_speed
  } MPH</div> <div>Humidity: ${
    currentCityData.humidity
  }%</div> <div>UV Index: <span  id="uvi" >${currentCityData.uvi}</span></div>`;
  //uvi
  let uviRay = currentCityData.uvi;
  if (uviRay <= 4) {
    document.querySelector("#uvi").classList.add("Low", "bg-#00B74A");
  } else if (uviRay <= 8 && uviCurrent >= 4) {
    document.querySelector("#uvi").classList.add("Warning", "bg-#FFA900");
  } else {
    document.querySelector("#uvi").classList.add("Danger", "bg-#F93154");
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
      .format("MMM Do YY")}</div> <div><img src="${weatherIcon}"></div></div>`;
  });
}
//addmore

function handleFormSubmit(event) {
  document.querySelector("#searchHistory").innerHTML = "";
  event.preventDefault();

  const city = document.querySelector("#searchInput").value.trim();
  searchCities.push(city);

  //filter
  const filteredCities = searchCities.filter((city, index) => {
    return searchCities.indexOf(city) === index;
  });
  localStorage.setItem("cityHistory", JSON.stringify(filteredSearchedCities));

  showHistory(filteredCities);
  handleCoords(city);
}

//show history
function showHistory(allCities) {
  allCities.forEach((city) => {
    document.querySelector(
      "#searchHistory"
    ).innerHTML += `<button data-city="${city}">${city}</button>;`;
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
