import * as fs from "fs";

export function updateEnvValue(key: string, value: string) {
  const filePath = ".env";

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    // If the file does not exist, create it with the specified key and value
    fs.writeFileSync(filePath, `${key}=${value}`);
    return;
  }

  // Read the file contents into memory
  const fileContents = fs.readFileSync(filePath, { encoding: "utf8" });

  // Split the file into lines and map them to key-value pairs
  const keyValuePairs = fileContents
    .split("\n")
    .map((line) => line.split("="))
    .map(([key, value]) => ({ key, value }));

  // Check if the key already exists in the file
  let keyExists = false;
  keyValuePairs.forEach((pair) => {
    if (pair.key === key) {
      keyExists = true;
    }
  });

  // If the key does not exist, add it to the array of key-value pairs
  if (!keyExists) {
    keyValuePairs.push({ key, value });
  }

  // Update the value for the specified key
  keyValuePairs.forEach((pair) => {
    if (pair.key === key) {
      pair.value = value;
    }
  });

  // Write the key-value pairs back to the file
  fs.writeFileSync(
    filePath,
    keyValuePairs.map((pair) => `${pair.key}=${pair.value}`).join("\n")
  );
}
