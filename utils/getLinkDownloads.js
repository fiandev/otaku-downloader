const axios = require("axios");
const cheerio = require("cheerio");

const { baseURL } = require("../constants/env.js");

const getLinkDownloads = async (url) => {
  let result = {};
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    $("#venkonten .download ul li").each(function () {
      let quality = $(this).find("strong").text().toString().split(" ")[
        $(this).find("strong").text().toString().split(" ").length - 1
      ];
      result[quality] = {};
      $(this)
        .find("a")
        .each(function () {
          let vendor = $(this).text();
          let link = $(this).attr("href");
          result[quality][vendor] = link;
        });
    });

    /* return */
  } catch (e) {
    return false;
  }
  //console.log(result);
  return result;
};

module.exports = getLinkDownloads;
