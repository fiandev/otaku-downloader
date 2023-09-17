const fs = require("fs");
const path = require("path");

const args = require("args-parser")(process.argv);

const { parseCase, info } = require("./functions.js");
const env = require("./env.js");

let FormatChangeHost = parseCase(["baseURL", "base", "host"], "lower");
let taskCompleted = false;

for (let key in args) {
  /* change host on .env file */
  if (FormatChangeHost.includes(key.toLowerCase())) {
    let pathfile = path.join(__dirname, "../.env");
    let contentFile = fs.readFileSync(pathfile, "utf8");
    let environment = env();
    let argsValue = typeof args[key] !== "boolean" ? args[key] : env("baseURL");

    environment.baseURL = argsValue;

    let content = "";
    for (let x in environment) {
      if (contentFile.search(`${x}=`) > -1)
        content += `${x}=${environment[x]}\n`;
    }

    fs.writeFileSync(pathfile, content);

    info(`success change baseURL on environment to ${argsValue}`);
    taskCompleted = true;
  }
}

taskCompleted ? process.exit() : false;
