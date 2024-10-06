// NASA Astronomy Picture of the Day API
const apiKey = 'hPc6uHMELDxnbhOMEY6z1lNRobMIAefbr9b5u0yZ'; // Replace with your API key
const apodContainer = document.getElementById('apod-container');

async function fetchAPOD() {
  if (!apiKey) {
    console.error('API key is missing');
    return;
  }

  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    const data = await response.json();
    displayAPOD(data);
  } catch (error) {
    console.error('Error fetching APOD:', error);
    apodContainer.innerHTML = '<p>Failed to fetch APOD. Please try again later.</p>';
  }
}

function displayAPOD(data) {
  const { title, explanation, url, media_type } = data;
  apodContainer.innerHTML = `
    <h3>${title}</h3>
    ${media_type === 'video' ? 
      `<iframe src="${url}" frameborder="0" allowfullscreen width="100%" height="400"></iframe>` 
      : `<img src="${url}" alt="${title}" width="100%">`}
    <p>${explanation}</p>
  `;
}

// Weather API
const weatherApiKey = 'a31dc844fbbaf454382e5be2d17e947d'; // Replace with your OpenWeatherMap API key
const weatherContainer = document.getElementById('weather-container');
const defaultCity = 'London'; // You can change this to any city

async function fetchWeather(city) {
  if (!weatherApiKey) {
    console.error('Weather API key is missing');
    return;
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`);
    const data = await response.json();
    
    if (data.cod === "404") {
      weatherContainer.innerHTML = `<p>City not found. Please enter a valid city.</p>`;
    } else {
      displayWeather(data);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherContainer.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
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
    top: document.querySelector('#problem').offsetTop,
    behavior: 'smooth'
  });
});

// Feedback form submission
document.getElementById('form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent default form submission
  const feedbackMessage = document.createElement('p');
  feedbackMessage.innerText = 'Thank you for your feedback!';
  feedbackMessage.style.color = '#f8d71c';
  feedbackMessage.style.fontWeight = 'bold'; // Make it more distinct
  this.appendChild(feedbackMessage);

  setTimeout(() => {
    feedbackMessage.remove(); // Remove the message after a few seconds
  }, 3000);

  this.reset(); // Reset form fields
});

// Fetch data on page load
fetchAPOD();
fetchWeather(defaultCity);

// Weather button functionality
document.getElementById('weather-button').addEventListener('click', function () {
  const city = document.getElementById('city-input').value;
  if (city) {
    fetchWeather(city);
  } else {
    alert('Please enter a city name');
  }
});
