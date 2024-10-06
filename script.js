// NASA Astronomy Picture of the Day API
const apiKey = 'hPc6uHMELDxnbhOMEY6z1lNRobMIAefbr9b5u0yZ'; // Replace with your API key
const apodContainer = document.getElementById('apod-container');

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


function toggleDropdown() {
  const dropdown = document.getElementById('gameDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Close dropdown if clicked outside
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
          dropdowns[i].style.display = "none";
      }
  }
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
document.addEventListener('DOMContentLoaded', function () {
  // Initially hide all sections except the first one
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    if (index !== 0) {
      section.style.display = 'none'; // Hide all sections except the first one
    }
  });

  // Click event for navigation links
  const goalLinks = document.querySelectorAll('.goal-list a');
  goalLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default anchor behavior
      const target = document.querySelector(this.getAttribute('href'));

      // Hide all sections
      sections.forEach(section => {
        section.style.display = 'none'; // Hide all sections
      });
      // Show the selected section
      target.style.display = 'block'; // Show the selected section

      // Smooth scroll to the target section
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Click event for Next Goal buttons
  const nextGoalButtons = document.querySelectorAll('.next-goal');
  nextGoalButtons.forEach(button => {
    button.addEventListener('click', function () {
      const currentSection = this.parentElement; // Get the current section
      const nextSectionId = this.getAttribute('onclick').match(/'(.*?)'/)[1]; // Extract the ID of the next section
      const nextSection = document.getElementById(nextSectionId);

      // Hide the current section
      currentSection.style.display = 'none';
      // Show the next section
      nextSection.style.display = 'block';

      // Smooth scroll to the next section
      nextSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
});