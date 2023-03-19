const { Select } = require("enquirer");

const select = async ({ items = [], message = "", name = "" }) => {
  let question = new Select({
    name: name,
    message: message,
    choices: items,
  });

  return await question.run();
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

module.exports = {
  getQuality,
  sluggable,
};
