// Feedback form submission
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
  
    // Get values from the form fields
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    // URL of the Discord Webhook (replace with your Webhook URL)
    const webhookURL = 'https://discord.com/api/webhooks/1292486311491670067/_DvEUrHCzgEEtfROcGZy_pIEe9akufMe7wnWVLLGSLBw38kzeSCbqpsZaK2CLMktr9Hn';
  
    // Prepare the payload for the Discord Webhook
    const payload = {
      content: `**New Feedback Received**\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`
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
  