// File:  csv2json.js
// Usage: node .\csv2json.js '.\Interaction Information.csv' interactions.json

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

/**
 * Converts a CSV file to JSON.
 * @param {string} inputCsvPath - Path to input CSV file.
 * @param {string} outputJsonPath - Path to output JSON file.
 */
function csv2json(inputCsvPath, outputJsonPath) {
  // Read the CSV file as a string
  const csvString = fs.readFileSync(inputCsvPath, 'utf8');
  // Parse the CSV to objects
  const parsed = Papa.parse(csvString, { header: true });

  // Write parsed objects to the JSON file
  fs.writeFileSync(outputJsonPath, JSON.stringify(parsed.data, null, 2), 'utf8');
  console.log(`Converted ${inputCsvPath} to ${outputJsonPath}`);
}

// OPTIONAL: Run as CLI
if (require.main === module) {
  const [,, inputCsvPath, outputJsonPath] = process.argv;
  if (!inputCsvPath || !outputJsonPath) {
    console.log('Usage: node csv2json.js <input.csv> <output.json>');
    process.exit(1);
  }
  csv2json(inputCsvPath, outputJsonPath);
}

// Export function for other modules if needed
module.exports = { csv2json };
