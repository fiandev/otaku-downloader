const path = require("path");
const colors = require("colors");
const _async = require("async");

const { sluggable, getQuality } = require("../utils/functions.js");
const download = require("../utils/downloader.js");
const getInfoAnime = require("../utils/getInfoAnime.js");
const getLinkDownloads = require("../utils/getLinkDownloads.js");
const zippyDownloader = require("../utils/zippyDownloader.js");

class Downloader {
  static async downloadAllEpisode(url) {
    try {
      let result = await getInfoAnime(url);
      let dest = path.join(process.cwd(), sluggable(result.title));
      let quality = await getQuality();
      for (let episode of result.episode_list) {
        let listQuality = await getLinkDownloads(episode.link);
        let zippy = listQuality[quality]
          ? Object.keys(listQuality)[0]
          : listQuality[quality].Zippy;
        let link = await zippyDownloader.GetLink(zippy);
        await (async () => {
          await download(link, dest);
        })();
      }

      console.log(`✅ ${colors.green("done")}`);
    } catch (e) {
      console.log("💩 " + colors.red("invalid page anime url"));
      return false;
    }
  }
}

module.exports = Downloader;
