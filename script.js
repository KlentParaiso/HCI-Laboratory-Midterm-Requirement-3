// Global Variables
let insideTemp = 70; // Initial inside temperature in °F
let outsideTemp = 75; // Initial outside temperature in °F
let systemMode = 'off'; // 'cool', 'heat', 'off'
let fanMode = 'auto'; // 'auto', 'on'
let desiredTemp = 72; // Default desired temperature
let tempUnit = 'F'; // 'F' or 'C'
let selectedZone = 'living room'; // Default zone
let simulationInterval;
let tempChart;

// Function to convert temperature to Celsius
function toCelsius(fahrenheit) {
    return ((fahrenheit - 32) * (5 / 9)).toFixed(1);
}

// Function to convert temperature to Fahrenheit
function toFahrenheit(celsius) {
    return ((celsius * 9 / 5) + 32).toFixed(1);
}

// Function to set selected zone
function setZone(zone) {
    selectedZone = zone;
    alert(`Zone set to ${zone.charAt(0).toUpperCase() + zone.slice(1)}`);
}

// Initialize the simulation
window.onload = function() {
    initializeTime();
    initializeChart();
    simulationInterval = setInterval(simulationStep, 1000);
    // Update outside temperature every 5 minutes
    setInterval(updateOutsideTemp, 300000);
    // Display initial temperature values
    displayTemperature();
    displayOutsideTemperature();
};

// Initialize Time and Day
function initializeTime() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString();
    document.getElementById('current-day').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
}

// Simulation Step - runs every second
function simulationStep() {
    // Update inside temperature based on system state and selected zone
    // For simplicity, using one temperature variable. You can extend this to maintain separate temps for each zone.
    if (systemMode === 'cool') {
        if (insideTemp > desiredTemp) {
            insideTemp -= 0.2; // 1°F per 5 seconds
        }
    } else if (systemMode === 'heat') {
        if (insideTemp < desiredTemp) {
            insideTemp += 0.2; // 1°F per 5 seconds
        }
    } else {
        // System is off, temperature tends to outside temp
        if (insideTemp < outsideTemp) {
            insideTemp += 0.1; // 1°F per 10 seconds
        } else if (insideTemp > outsideTemp) {
            insideTemp -= 0.1; // 1°F per 10 seconds
        }
    }

    // Update system status
    updateSystemStatus();

    // Update temperature display
    displayTemperature();

    // Update chart
    updateChart();
}

// Update System Status Display
function updateSystemStatus() {
    let status = 'Off';
    if (systemMode === 'cool') {
        status = 'Cooling';
    } else if (systemMode === 'heat') {
        status = 'Heating';
    }

    document.getElementById('system-status').textContent = status;
    document.getElementById('fan-status').textContent = `Fan: ${fanMode === 'auto' ? (systemMode !== 'off' ? 'On (Auto)' : 'Off') : 'On'}`;
}

// Display Inside Temperature with Units and Zone
function displayTemperature() {
    let displayTemp = insideTemp;
    if (tempUnit === 'C') {
        displayTemp = toCelsius(insideTemp);
        document.getElementById('inside-temp').textContent = `${displayTemp} °C`;
    } else {
        displayTemp = insideTemp.toFixed(1);
        document.getElementById('inside-temp').textContent = `${displayTemp} °F`;
    }
    // Show the selected zone
    document.getElementById('system-status').textContent += ` | Zone: ${selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}`;
}

// Display Outside Temperature
function displayOutsideTemperature() {
    let displayOutsideTemp = outsideTemp;
    if (tempUnit === 'C') {
        displayOutsideTemp = toCelsius(outsideTemp);
        document.getElementById('outside-temp').textContent = `${displayOutsideTemp} °C`;
    } else {
        displayOutsideTemp = outsideTemp.toFixed(1);
        document.getElementById('outside-temp').textContent = `${displayOutsideTemp} °F`;
    }
}

// Set System Mode
function setMode(mode) {
    systemMode = mode;
    updateSystemStatus(); // Update the system status immediately
}

// Set Fan Mode
function setFan(mode) {
    fanMode = mode;
    updateSystemStatus(); // Update the fan status immediately
}

// Set Desired Temperature
function setDesiredTemp() {
    const tempInput = document.getElementById('desired-temp').value;
    if (tempInput !== '') {
        desiredTemp = parseFloat(tempInput);
        document.getElementById('desired-temp').value = '';
    }
}

// Set Temperature Unit
function setUnit(unit) {
    tempUnit = unit;
    convertTemperatureUnit(); // Convert the current data in the graph
    displayTemperature(); // Update inside temperature display
    displayOutsideTemperature(); // Update outside temperature display
    updateChart(); // Update chart with converted data
}

// Convert the temperature unit in the chart
function convertTemperatureUnit() {
    if (tempChart) {
        if (tempUnit === 'C') {
            tempChart.data.datasets[0].data = tempChart.data.datasets[0].data.map(toCelsius);
            tempChart.data.datasets[1].data = tempChart.data.datasets[1].data.map(toCelsius);
        } else {
            tempChart.data.datasets[0].data = tempChart.data.datasets[0].data.map(toFahrenheit);
            tempChart.data.datasets[1].data = tempChart.data.datasets[1].data.map(toFahrenheit);
        }
    }
}

// Update Outside Temperature (Simulated Logic)
function updateOutsideTemp() {
    // Simple simulation: fluctuate outside temp by ±5°F
    let change = Math.floor(Math.random() * 11) - 5;
    outsideTemp += change;
    // Ensure temperature stays within realistic bounds
    if (outsideTemp < 30) outsideTemp = 30;
    if (outsideTemp > 100) outsideTemp = 100;
    // Update display
    displayOutsideTemperature();
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Time labels
            datasets: [
                {
                    label: 'Inside Temperature',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false,
                },
                {
                    label: 'Outside Temperature',
                    data: [],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    fill: false,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0, // Minimum value of the y-axis
                    max: 50, // Maximum value of the y-axis
                    title: {
                        display: true,
                        text: 'Temperature'
                    }
                }
            }
        }
    });
}


// Update Chart
function updateChart() {
    if (tempChart) {
        let displayInsideTemp = insideTemp;
        let displayOutsideTemp = outsideTemp;

        if (tempUnit === 'C') {
            displayInsideTemp = toCelsius(insideTemp);
            displayOutsideTemp = toCelsius(outsideTemp);
        } else {
            displayInsideTemp = insideTemp;
            displayOutsideTemp = outsideTemp;
        }

        tempChart.data.labels.push(new Date().toLocaleTimeString());
        tempChart.data.datasets[0].data.push(displayInsideTemp);
        tempChart.data.datasets[1].data.push(displayOutsideTemp);
        // Keep last 50 data points
        if (tempChart.data.labels.length > 50) {
            tempChart.data.labels.shift();
            tempChart.data.datasets[0].data.shift();
            tempChart.data.datasets[1].data.shift();
        }
        tempChart.update('quiet');
    }
}
