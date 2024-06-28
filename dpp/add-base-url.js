//ddev-generated
const fs = require('fs');

// Path to your Playwright config file
const configFilePath = process.argv[2];

// Read the configuration file
fs.readFile(configFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Parse the file content
  const fileLines = data.split('\n');

  // Find the line where the "use" object starts
  const useStartIndex = fileLines.findIndex(line => line.trim().startsWith('use: {'));

  if (useStartIndex === -1) {
    console.error('Could not find the "use" object in the configuration file.');
    return;
  }

  // Define the new value to add
  const newValue = 'baseURL: process.env.PLAYWRIGHT_BASE_URL,';

  // Find the end of the "use" object
  let useEndIndex = useStartIndex;
  let braceCount = 0;
  for (let i = useStartIndex; i < fileLines.length; i++) {
    if (fileLines[i].includes('{')) braceCount++;
    if (fileLines[i].includes('}')) braceCount--;
    if (braceCount === 0) {
      useEndIndex = i;
      break;
    }
  }

  // Insert the new value before the closing brace of the "use" object
  fileLines.splice(useEndIndex, 0, `    ${newValue}`);

  // Join the lines back together
  const updatedData = fileLines.join('\n');

  // Write the updated configuration back to the file
  fs.writeFile(configFilePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file: ${err}`);
      return;
    }
    console.log('Configuration file updated successfully.');
  });
});
