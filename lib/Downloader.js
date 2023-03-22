const path = require("path");
const colors = require("colors");
const _async = require("async");

const { sluggable, getQuality, select } = require("../utils/functions.js");
const download = require("../utils/downloader.js");
const getInfoAnime = require("../utils/getInfoAnime.js");
const getLinkDownloads = require("../utils/getLinkDownloads.js");
const zippyDownloader = require("../utils/zippyDownloader.js");

class Downloader {
  static async getEpisode(episodes) {
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
      return this.getEpisode(episodes);
    }

    if (end < start) {
      console.log(`❌ ${colors.red("invalid end episode !")}`);
      return this.getEpisode(episodes);
    }

    return [start, end];
  }

  static async downloadAllEpisode(url) {
    try {
      let result = await getInfoAnime(url);
      let dest = path.join(process.cwd(), sluggable(result.title));
      let quality = await getQuality();
      let episodeList = result.episode_list.map((v, i) => `episode ${i + 1}`);
      let [start, end] = await this.getEpisode(episodeList);

      for (let episode of result.episode_list.slice(start - 1, end)) {
        let episodesQuality = await getLinkDownloads(episode.link);
        try {
          let zippy =
            episodesQuality[quality].zippy ||
            episodesQuality[quality].zippyshare;
          let link = await zippyDownloader.GetLink(zippy);
          await (async () => {
            await download(link, dest);
            await console.log(episode.title);
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
}

module.exports = Downloader;
