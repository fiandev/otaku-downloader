const prompts = require("prompts");
const colors = require("colors");

const env = require("./env.js");

const select = async ({ items = [], message = "", name = "select" }) => {
  let choices = items.map((v) => { 
    return { 
      name: v, 
      value: v
    };
  });
  
  let response = await prompts({
    type: "select",
    name: name,
    message: message,
    choices: choices,
  });

  return response[name];
};

const getQuality = async () => {
  return await select({
    items: ["360p", "480p", "720p", "1080p"],
    message: "choose qualitiy video",
    name: "quality",
  });
};

const sluggable = (str = " ") => {
  return str.toLowerCase().replace(/((\s|\W|\"|\'|\`)+)/g, "-");
};

const input = async (label, name = "input") => {
  let answer = await prompts({
    type: "text",
    name: name,
    message: label,
  });
  return answer[name];
};

const getEpisode = async (episodes) => {
  let start = await select({
    items: episodes,
    message: "select start episode for download",
  });

  let end = episodes[episodes.length - 1];
  if (episodes.slice(episodes.indexOf(start) + 1).length > 0) {
    end = await select({
      items: episodes.slice(episodes.indexOf(start) + 1),
      message: "select end episode for download",
    });
  }

  /* parsing to number */
  start = Number(start.replace("episode ", ""));
  end = Number(end.replace("episode ", ""));
  if (start < episodes[0]) {
    console.log(`❌ ${colors.red("invalid start episode !")}`);
    return await getEpisode(episodes);
  }

  if (end < start) {
    console.log(`❌ ${colors.red("invalid end episode !")}`);
    return await getEpisode(episodes);
  }

  return [start, end];
};

const verifyAnimeURL = (url) => {
  const reject = () => {
    console.log("invalid anime page url");
    return false;
  };
  let baseURL = new URL(env("baseURL", url));
  try {
    let { hostname, pathname } = new URL(url);
    if (baseURL.hostname !== hostname) return reject();
  } catch (e) {
    return reject();
  }
  
  return true;
};

const info = (text) => {
  console.log(`

${ colors.yellow("[!]") } information
${ text }

  `);
};

module.exports = {
  getQuality,
  sluggable,
  select,
  input,
  getEpisode,
  verifyAnimeURL,
  info,
};
