const path = require("path");
const fs = require("fs");
const colors = require("colors");
const _async = require("async");

const {
  sluggable,
  getQuality,
  select,
  getEpisode,
} = require("../utils/functions.js");
const download = require("../utils/downloader.js");
const getInfoAnime = require("../utils/getInfoAnime.js");
const getLinkDownloads = require("../utils/getLinkDownloads.js");
const megaDownloader = require("../utils/megaDownloader.js");
const zippyDownloader = require("../utils/zippyDownloader.js");

class Downloader {
  static async zippy(url) {
    try {
      let result = await getInfoAnime(url);
      let dest = path.join(process.cwd(), sluggable(result.title));
      let quality = await getQuality();
      let episodeList = result.episode_list.map((v, i) => `episode ${i + 1}`);
      let [start, end] = await getEpisode(episodeList);

      for (let episode of result.episode_list.slice(start - 1, end)) {
        let episodesQuality = await getLinkDownloads(episode.link);
        try {
          let zippy =
            episodesQuality[quality].zippy ||
            episodesQuality[quality].zippyshare;
          let link = await zippyDownloader.GetLink(zippy);

          await (async () => {
            await download(link, dest);
          })();
        } catch (e) {
          console.log(episodesQuality[quality]);
        }
      }

      console.log(`✅ ${colors.green("done")}`);
    } catch (e) {
      console.log("💩 " + colors.red(e));
      return false;
    }
  }

  static async mega(url) {
    try {
      let result = await getInfoAnime(url);
      let dest = path.join(process.cwd(), sluggable(result.title));
      let quality = await getQuality();
      let episodeList = result.episode_list.map((v, i) => `episode ${i + 1}`);
      let [start, end] = await getEpisode(episodeList);
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      for (let episode of result.episode_list.slice(start - 1, end)) {
        let episodesQuality = await getLinkDownloads(episode.link);
        try {
          let mega =
            episodesQuality[quality].mega || episodesQuality[quality].meganz;
          await (async () => {
            await megaDownloader.download(mega, dest);
          })();
        } catch (e) {
          console.log(e);
        }
      }

      console.log(`✅ ${colors.green("done")}`);
    } catch (e) {
      console.log("💩 " + colors.red(e));
      return false;
    }
  }
}

module.exports = Downloader;
