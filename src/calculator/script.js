function calculateEmissions() {
    const milesDriven = parseFloat(document.getElementById('milesDriven').value);
    const electricityUsed = parseFloat(document.getElementById('electricityUsed').value);
    const resultBox = document.getElementById('resultBox');

    if (isNaN(milesDriven) || isNaN(electricityUsed)) {
        alert('Please enter valid numbers for both fields.');
        return;
    }

    const co2FromDriving = milesDriven * 0.404; // CO2 per mile for gasoline car (in kg)
    const co2FromElectricity = electricityUsed * 0.5; // CO2 per kWh (in kg)

    const totalCO2 = co2FromDriving + co2FromElectricity;

    resultBox.innerHTML = `<h2>Your Estimated Carbon Emissions:</h2><p>${totalCO2.toFixed(2)} kg CO<sub>2</sub> per month</p>`;
    resultBox.style.display = 'block';
}
