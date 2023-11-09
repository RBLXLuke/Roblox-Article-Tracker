const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const apiUrl = 'https://translations.roblox.com';
const folderPath = 'C:\\Users\\lukec\\Downloads\\Translations\\translations'; // Change this to your folder path
const jsonFileName = 'translations.json';

const jsonFilePath = path.join(folderPath, jsonFileName);

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

// Function to make a request to the API and save the data
async function fetchDataAndSave() {
  try {
    // Make a GET request to the API endpoint
    const response = await axios.get(apiUrl);
    const newData = response.data;

    // Check if the data has changed
    if (hasDataChanged(newData)) {
      // Update the JSON file with the new data
      updateJsonFile(newData);
      console.log('Data updated and saved to', jsonFilePath);

      // Commit changes to Git
      gitCommit();
    } else {
      console.log('No changes detected.');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Function to check if the data has changed
function hasDataChanged(newData) {
  try {
    // Read the existing JSON file
    const existingData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    // Compare data (you may need to customize this based on the API response structure)
    return JSON.stringify(existingData) !== JSON.stringify(newData);
  } catch (error) {
    // Handle file reading or parsing errors
    console.error('Error reading existing data:', error.message);
    return false;
  }
}

// Function to update the JSON file with new data
function updateJsonFile(newData) {
  try {
    // Save the new data to the JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(newData, null, 2), 'utf-8');
  } catch (error) {
    // Handle file writing errors
    console.error('Error updating JSON file:', error.message);
  }
}

// Function to commit changes to Git
function gitCommit() {
  try {
    // Stage changes
    execSync(`git -C ${folderPath} add ${jsonFileName}`);
    // Commit changes
    execSync(`git -C ${folderPath} commit -m "Update translations"`);
    // Push changes to GitHub (replace origin and branch with your repository details)
    execSync(`git -C ${folderPath} push origin main`);
    console.log('Changes committed to GitHub.');
  } catch (error) {
    console.error('Error committing changes to GitHub:', error.message);
  }
}

// Interval for fetching and checking data (every 1 hour in this example)
const fetchInterval = 60 * 60 * 1000; // 1 hour in milliseconds
setInterval(fetchDataAndSave, fetchInterval);

// Initial fetch and save on script start
fetchDataAndSave();

