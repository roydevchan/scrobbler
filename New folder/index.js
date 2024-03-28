const fs = require('fs');

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate an array of random numbers
function generateRandomNumbers(count, min, max) {
  const numbers = [];
  for (let i = 0; i < count; i++) {
    numbers.push(getRandomNumber(min, max));
  }
  return numbers;
}

// Function to write random numbers to the file
function writeRandomNumbersToFile() {
  const count = 10; // Number of random numbers to generate
  const min = 1; // Minimum value for random numbers
  const max = 100; // Maximum value for random numbers

  // Generate random numbers
  const randomNumbers = generateRandomNumbers(count, min, max);

  // Convert the array of numbers to a string
  const randomNumbersString = randomNumbers.join('\n');

  // Write the random numbers to the file
  fs.writeFile('1.txt', randomNumbersString, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to the file:', err);
      return;
    }
    console.log('Random numbers have been written to the file.');
  });
}

// Write random numbers to the file every 5 seconds
setInterval(writeRandomNumbersToFile, 15000);