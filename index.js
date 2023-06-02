const { input, select, verifyAnimeURL } = require("./utils/functions.js");
const Downloader = require("./lib/Downloader.js");
const env = require("./utils/env.js");

const main = async () => {
  const animeURL = await input("insert page anime url");
  const method = await select({
    message: "select method for download",
    items: ["zippy", "mega"]
  });
  
  if (!verifyAnimeURL(animeURL)) return main();
  if (!Downloader[method](animeURL)) return main();
};

main();