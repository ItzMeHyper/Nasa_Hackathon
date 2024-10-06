// NASA Astronomy Picture of the Day API
const apiKey = 'hPc6uHMELDxnbhOMEY6z1lNRobMIAefbr9b5u0yZ'; // Replace with your API key
const apodContainer = document.getElementById('apod-container');

async function fetchAPOD() {
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    const data = await response.json();
    displayAPOD(data);
  } catch (error) {
    console.error('Error fetching APOD:', error);
  }
}

function displayAPOD(data) {
  const { title, explanation, url, media_type } = data;
  apodContainer.innerHTML = `
    <h3>${title}</h3>
    ${media_type === 'video' ? `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>` : `<img src="${url}" alt="${title}">`}
    <p>${explanation}</p>
  `;
}

// Weather API
const weatherApiKey = 'a31dc844fbbaf454382e5be2d17e947d'; // Replace with your OpenWeatherMap API key
const weatherContainer = document.getElementById('weather-container');

async function fetchWeather(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function displayWeather(data) {
  const { main, weather, name } = data;
  weatherContainer.innerHTML = `
    <h3>Weather in ${name}</h3>
    <p>Temperature: ${main.temp}°C</p>
    <p>Condition: ${weather[0].description}</p>
  `;
}

// Smooth scrolling for the call-to-action button
document.getElementById("cta-button").addEventListener("click", function () {
  window.scrollTo({
    top: document.querySelector('.intro-sdg13').offsetTop,
    behavior: 'smooth'
  });
});

// Scroll down arrow functionality
document.getElementById("cta-button").addEventListener("click", function () {
  window.scrollTo({
    top: document.querySelector('#problem').offsetTop,
    behavior: 'smooth'
  });
});

// Feedback form submission
document.getElementById('form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission
  alert('Thank you for your feedback!');
  this.reset(); // Reset form fields
});

// Fetch data on page load
fetchAPOD();
fetchWeather('London'); // Replace 'London' with any city name

// Weather button functionality
document.getElementById('weather-button').addEventListener('click', function () {
  const city = document.getElementById('city-input').value;
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a city name');
  }
});
