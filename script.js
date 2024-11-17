// Adjust sunlight and electricity rate
function adjustValue(id, increment) {
    const input = document.getElementById(id);
    let currentValue = parseFloat(input.value);
    currentValue += increment;
    input.value = Math.max(currentValue, 0); // Ensure value is not negative
}

// Detect location and autofill sunlight and coordinates
document.getElementById('detect-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                let avgSunlight = 5; // Default sunlight value

                // Assuming a basic average based on regions
                if (latitude >= 8 && latitude <= 12) avgSunlight = 6; // Southern India
                else if (latitude >= 20 && latitude <= 28) avgSunlight = 4.5; // Northern India
                else avgSunlight = 5.5; // Central India

                // Autofill coordinates and sunlight
                document.getElementById('latitude').value = latitude;
                document.getElementById('longitude').value = longitude;
                document.getElementById('sunlight').value = avgSunlight;
                alert(`Location detected: Lat ${latitude}, Long ${longitude}. Avg Sunlight set to ${avgSunlight} hrs/day.`);
            },
            () => {
                alert("Unable to detect location. Please set sunlight manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Calculate solar panel requirements
function calculateSolar() {
    const monthlyBill = parseFloat(document.getElementById('monthly-bill').value);
    const userType = document.getElementById('user-type').value;
    const sunlight = parseFloat(document.getElementById('sunlight').value);
    const rate = parseFloat(document.getElementById('rate').value);

    if (isNaN(monthlyBill) || monthlyBill <= 0) {
        alert("Please enter a valid monthly bill.");
        return;
    }

    // Calculations
    const monthlyConsumption = monthlyBill / rate; // kWh
    const dailyConsumption = monthlyConsumption / 30; // kWh/day
    const requiredCapacity = dailyConsumption / sunlight; // kW
    const numberOfPanels = Math.ceil((requiredCapacity * 1000) / 300); // Assume 300W panels
    const systemCost = requiredCapacity * 60000; // Estimated cost per kW = ₹60,000
    const roofAreaRequired = numberOfPanels * 1.7; // Assume 1.7 m² per panel
    const treesSaved = requiredCapacity * 0.03; // Estimate 0.03 trees per kW per year
    const co2Saved = requiredCapacity * 1.2; // Estimate 1.2 tons of CO2 saved per kW per year
    const subsidyCentral = systemCost * 0.30; // Central subsidy (30% of system cost)
    const subsidyState = systemCost * 0.20; // State subsidy (20% of system cost)

    // Savings Calculations
    const savingsPerDay = dailyConsumption * rate; // ₹ per day
    const savingsPerMonth = savingsPerDay * 30; // ₹ per month
    const totalSavings25Years = savingsPerMonth * 12 * 25; // Total savings in 25 years
    const roi = ((totalSavings25Years - systemCost) / systemCost) * 100; // ROI after 25 years

    // Tree and CO2 savings in 25 years
    const treesSavedIn25Years = treesSaved * 25; // Trees saved in 25 years
    const co2SavedIn25Years = co2Saved * 25; // CO2 saved in 25 years

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Results</h2>
        <p class="result-item">Monthly Energy Consumption: ${monthlyConsumption.toFixed(2)} kWh</p>
        <p class="result-item">Daily Energy Requirement: ${dailyConsumption.toFixed(2)} kWh</p>
        <p class="result-item">Required Solar Capacity: ${requiredCapacity.toFixed(2)} kW</p>
        <p class="result-item">Number of Panels (300W each): ${numberOfPanels}</p>
        <p class="result-item">System Cost: ₹${systemCost.toFixed(2)}</p>
        <p class="result-item">Roof Area Required: ${roofAreaRequired.toFixed(2)} m²</p>
        <p class="result-item">Trees Saved (in 25 years): ${treesSavedIn25Years.toFixed(2)}</p>
        <p class="result-item">CO2 Saved (in 25 years): ${co2SavedIn25Years.toFixed(2)} tons</p>
        <p class="result-item">Savings per Day: ₹${savingsPerDay.toFixed(2)}</p>
        <p class="result-item">Savings per Month: ₹${savingsPerMonth.toFixed(2)}</p>
        <p class="result-item">Total Savings in 25 Years: ₹${totalSavings25Years.toFixed(2)}</p>
        <p class="result-item">Return on Investment (ROI) after 25 years: ${roi.toFixed(2)}%</p>
        <p class="result-item">Central Subsidy: ₹${subsidyCentral.toFixed(2)}</p>
        <p class="result-item">State Subsidy: ₹${subsidyState.toFixed(2)}</p>
    `;
}
