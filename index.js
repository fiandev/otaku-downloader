const { prompt } = require("enquirer");
const Downloader = require("./lib/Downloader.js");

const main = async () => {
  const response = await prompt({
    type: "input",
    name: "url",
    message: "insert page anime url",
  });

  if (!Downloader.downloadAllEpisode(response.url)) main();
};

main();
