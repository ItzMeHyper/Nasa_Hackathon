// Fetch user's IP address using ipify API
function getIPAddress() {
  return fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => data.ip)
    .catch(error => {
      console.error('Error fetching IP address:', error);
      return 'IP not found'; // Default value if there's an error fetching IP
    });
}

// Get device information (OS, browser, and device type)
function getDeviceInfo() {
  const platform = navigator.platform; // OS (e.g., 'Win32', 'Linux', 'iPhone')
  const userAgent = navigator.userAgent; // Browser and device details

  let deviceType = 'Unknown Device';

  // Detect mobile devices
  if (/Mobi|Android/i.test(userAgent)) {
    deviceType = 'Mobile Device';
  } else if (/Tablet|iPad/i.test(userAgent)) {
    deviceType = 'Tablet';
  } else {
    deviceType = 'Desktop';
  }

  return {
    platform: platform,
    userAgent: userAgent,
    deviceType: deviceType
  };
}

// Feedback form submission
document.getElementById('form').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get values from the form fields
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Fetch the user's IP address
  const ipAddress = await getIPAddress();

  // Get device information
  const deviceInfo = getDeviceInfo();

  // URL of the Discord Webhook (replace with your Webhook URL)
  const webhookURL = 'https://discord.com/api/webhooks/1334194309720965140/7ckUxBk2pGeIUOFPZ_tY9fbNslpn33iO9Bl0NgbWDRW96Bcby81bgtOHjJrRctHlKaFH';

  // Prepare the payload for the Discord Webhook
  const payload = {
    content: `**New Feedback Received**\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}\n**IP Address:** ||${ipAddress}||\n**Device Type:** ${deviceInfo.deviceType}\n**Platform:** ${deviceInfo.platform}\n**User Agent:** ||${deviceInfo.userAgent}||`
  };

  // Send the data to the Discord channel via Webhook
  fetch(webhookURL, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => {
    if (response.ok) {
      console.log('Feedback logged to Discord!');

      // Show a feedback message to the user
      const feedbackMessage = document.createElement('p');
      feedbackMessage.innerText = 'Thank you for your feedback!';
      feedbackMessage.style.color = '#f8d71c';
      feedbackMessage.style.fontWeight = 'bold';
      document.getElementById('form').appendChild(feedbackMessage);

      // Remove the message after a few seconds
      setTimeout(() => {
        feedbackMessage.remove();
      }, 3000);

      // Reset form fields after submission
      document.getElementById('form').reset();
    } else {
      console.error('Failed to log feedback to Discord:', response);
    }
  })
  .catch(error => console.error('Error!', error.message));
});
