document.addEventListener('DOMContentLoaded', function () {
  const app = document.querySelector('.weather-app');
  const temp = document.querySelector('.temp');
  const dateOutput = document.querySelector('.date');
  const timeOutput = document.querySelector('.time');
  const conditionOutput = document.querySelector('.condition');
  const nameOutput = document.querySelector('.name');
  const icon = document.querySelector('.ico');
  const cloudOutput = document.querySelector('.cloud');
  const humidityOutput = document.querySelector('.humidity');
  const windOutput = document.querySelector('.wind');
  const form = document.getElementById('locationInput');
  const search = document.querySelector('.search');
  const btn = document.querySelector('.submit');
  const cities = document.querySelectorAll('.city');

  let cityInput = "Madrid";

  cities.forEach((city) => {
    city.addEventListener('click', (e) => {
      cityInput = e.target.innerHTML;
      fetchWeatherDataAndForecast(); // Default data for default city
      app.style.opacity = "0";
    });
  });

  form.addEventListener('submit', (e) => {
    if (search.value.length == 0) {
      alert('Please type in a city name');
    } else {
      cityInput = search.value;
      fetchWeatherDataAndForecast(); // Update data for new city introduced
      search.value = "";
      app.style.opacity = "0";
    }
    e.preventDefault();
  });

  function dayOfTheWeek(day, month, year) {   //Function for show correct day of the week
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()];
  }

  function fetchWeatherDataAndForecast() {    //Getting data from API
    fetch(`https://api.weatherapi.com/v1/current.json?key=eef4e30132124eef80f203739240502&q=${cityInput}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;
        // Taking and printing all needed data
        const date = data.location.localtime.split(' ')[0];
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = data.location.localtime.split(' ')[1];

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}/${m}/${y}`;
        timeOutput.innerHTML = time;
        nameOutput.innerHTML = data.location.name;
        const iconId = data.current.condition.icon.substr(2);
        icon.src = "http:" + iconId;

        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        let timeOfDay = "day";    //Selecting between day and night backgrounds
        if (!data.current.is_day) {
          timeOfDay = "night";
        }

        let cc = data.current.condition.code // current condition code
        let cLink = `url(./images/${timeOfDay}/`  // shortcut for link to backgrounds

        if(cc === 1000) {                  // Function for changes of background
          app.style.backgroundImage = cLink + "lCloud0.jpg)"
        } else if(cc === 1003) {
          app.style.backgroundImage = cLink + "lCloud33.jpg)"
        } else if(cc === 1006) {
          app.style.backgroundImage = cLink + "lCloud66.jpg)"
        } else if(cc === 1009) {
          app.style.backgroundImage = cLink + "lCloud100.jpg)"
        } else if(cc === 1030) {
          app.style.backgroundImage = cLink + "mist.jpg)"
        } else if(cc === 1063) {
          app.style.backgroundImage = cLink + "bRain.jpg)"
        } else if(cc === 1066 || cc === 1069) {
          app.style.backgroundImage = cLink + "bSnow.jpg)"
        } else if(cc === 1072) {
          app.style.backgroundImage = cLink + "fRain.jpg)"
        } else if(cc === 1087) {
          app.style.backgroundImage = cLink + "thunder.jpg)"
        } else if(cc === 1114) {
          app.style.backgroundImage = cLink + "wSnow.jpg)"
        } else if(cc === 1117) {
          app.style.backgroundImage = cLink + "blizzard.jpg)"
        } else if(cc === 1135 || cc === 1147) {
          app.style.backgroundImage = cLink + "fog.jpg)"
        } else if(cc === 1150 || cc === 1153 || cc === 1168 ||
          cc === 1171 || cc === 1180 || cc === 1183 || cc === 1204
          || cc === 1240 || cc === 1246 || cc === 1249 || cc === 1273) {
          app.style.backgroundImage = cLink + "lRain.jpg)"
        } else if(cc === 1186 || cc === 1189 || cc === 1192 || cc === 1195 || cc === 1198 
          || cc === 1201 || cc === 1207 || cc === 1243 || cc === 1252 || cc === 1276) {
          app.style.backgroundImage = cLink + "rain.jpg)"
        } else if(cc === 1210 || cc === 1213 || cc === 1216 || cc === 1255 || cc === 1261 
          || cc === 1279) {app.style.backgroundImage = cLink + "lSnow.jpg)"
        } else if(cc === 1219 || cc === 1222 || cc === 1225 || cc === 1237 || cc === 1258 
          || cc === 1264 || cc === 1282) {app.style.backgroundImage = cLink + "snow.jpg)"
        }
        app.style.opacity = "1";
      })
      .catch(() => {      // Checking for existing city name
        alert('City not found, please try again!');
        app.style.opacity = "1";
      });

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=eef4e30132124eef80f203739240502&q=${cityInput}&days=7`)
      .then(response => response.json())
      .then(data => {
        console.log(data);

        // Checking for weather to next days
        for (let i = 0; i < data.forecast.forecastday.length; i++) {
          const forecast = data.forecast.forecastday[i];
          const dayElement = document.getElementById(`day${i + 1}`);

          // Checking if searched element exist
          if (dayElement) {
            // Data for next days
            const date = forecast.date;
            const dayOfWeek = dayOfTheWeek(parseInt(date.substr(8, 2)), parseInt(date.substr(5, 2)), parseInt(date.substr(0, 4)));
            const iconId = forecast.day.condition.icon.substr(2);
            const iconUrl = "http:" + iconId;
            const tempMax = forecast.day.maxtemp_c;
            const tempMin = forecast.day.mintemp_c;

            // Update data in HTML file
            dayElement.querySelector('.day-of-week').innerHTML = dayOfWeek;
            dayElement.querySelector('.icon').src = iconUrl;
            dayElement.querySelector('.temp-max').innerHTML = tempMax + "&#176;C";
            dayElement.querySelector('.temp-min').innerHTML = tempMin + "&#176;C";
          }
        }
      })
      .catch(error => {
        console.error('Error fetching weather forecast:', error);
      });
  }

  fetchWeatherDataAndForecast(); // Fetching data for landing page
});