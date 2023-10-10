const locationInput = document.getElementById("location-input");
const searchButton = document.getElementById("search-button");
const weatherInfoDiv = document.getElementById("weather-info");
const containerDiv = document.getElementById("container-div");

searchButton.addEventListener("click", handleSearch);

async function handleSearch() {
  const location = locationInput.value;

  if (location.trim() === "") {
    alert("Please enter a location");
    return;
  }

  const openWeatherApiKey = "API KEY HERE";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openWeatherApiKey}`;

  weatherInfoDiv.innerHTML = "";

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      displayWeatherData(data);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    showError(error.message);
  }
}

function displayWeatherData(data) {
  const temperature = Math.round(data.main.temp - 273.15);
  const weatherCondition = data.weather[0].description;
  const humidity = data.main.humidity;

  // Display weather information
  weatherInfoDiv.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      <p>Temperature: ${temperature}°C</p>
    `;

  if (weatherCondition === "scattered clouds") {
    weatherInfoDiv.innerHTML += `
        <p>Condition: ${weatherCondition} ☁️</p>
        `;
  } else if (weatherCondition === "clear sky") {
    weatherInfoDiv.innerHTML += `
        <p>Condition: ${weatherCondition} 🌞</p>
        `;
  } else if (
    weatherCondition === "overcast clouds" ||
    weatherCondition === "broken clouds"
  ) {
    weatherInfoDiv.innerHTML += `
        <p>Condition: ${weatherCondition} ⛅</p>
        `;
  } else if (weatherCondition === "few clouds") {
    weatherInfoDiv.innerHTML += `
        <p>Condition: ${weatherCondition} 🌤️</p>
        `;
  } else if (weatherCondition.includes("rain")) {
    weatherInfoDiv.innerHTML += `
        <p>Condition: ${weatherCondition} ☔</p>
        `;
  }

  weatherInfoDiv.innerHTML += `
    <p>Humidity: ${humidity} 💧</p>
    `;

  // Fetch city image from Unsplash API
  fetchAndShowBackgroundImage(data.name);

  fetchAndShowFlagImage(data.sys.country);

  //reseting h1 to nothing
  const text = document.getElementById("text-h1");
  text.innerHTML = "";
  //reseting note p
  const pNote = document.getElementById("note-paragraph");
  pNote.innerHTML = "";

  //setting opacity and on hover removing opacity
  containerDiv.style.opacity = 0.5;

  containerDiv.addEventListener("mouseover", function () {
    containerDiv.style.opacity = 1; // Set opacity to 50% on hover
  });

  containerDiv.addEventListener("mouseout", function () {
    containerDiv.style.opacity = 0.5; // Reset opacity to 100% when not hovering
  });

  //adding option to move container div
  let isDragging = false;
  let dragStartX;
  let dragStartY;

  // Add the draggable class to the container div
  containerDiv.classList.add("draggable");

  // Function to handle the mousedown event
  function handleMouseDown(event) {
    isDragging = true;
    dragStartX = event.clientX - containerDiv.offsetLeft;
    dragStartY = event.clientY - containerDiv.offsetTop;
  }

  // Function to handle the mousemove event
  function handleMouseMove(event) {
    if (isDragging) {
      const newLeft = event.clientX - dragStartX;
      const newTop = event.clientY - dragStartY;
      containerDiv.style.left = `${newLeft}px`;
      containerDiv.style.top = `${newTop}px`;
    }
  }

  // Function to handle the mouseup event
  function handleMouseUp() {
    isDragging = false;
  }

  // Add event listeners for the mouse events
  containerDiv.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}

async function fetchAndShowBackgroundImage(cityName) {
  const unsplashApiKey = "API KEY HERE";
  const unsplashApiUrl = `https://api.unsplash.com/search/photos?query=${cityName}&client_id=${unsplashApiKey}`;

  try {
    const unsplashResponse = await fetch(unsplashApiUrl);
    const unsplashData = await unsplashResponse.json();

    if (unsplashResponse.ok) {
      const cityImage = unsplashData.results[0].urls.regular;

      const bodyElement = document.body;

      // Set the background image using CSS
      bodyElement.style.backgroundImage = `url(${cityImage})`;
    } else {
      throw new Error(unsplashData.message);
    }
  } catch (error) {
    console.error("Error fetching city image:", error);
  }
}

async function fetchAndShowFlagImage(countryCode) {
  const apiUrl = `https://restcountries.com/v3/alpha/${countryCode}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      const flagUrl = data[0].flags[0];

      const flagImage = document.getElementById("flag-image");
      flagImage.src = flagUrl;

      flagImage.style.display = "inline";
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
}

function showError(errorMessage) {
  weatherInfoDiv.innerHTML = `<p class="error-message">${errorMessage}</p>`;
}
