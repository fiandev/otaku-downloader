const axios = require("axios");
const _proggers = require("cli-progress"),
  _path = require("path"),
  _colors = require("colors"),
  _fs = require("fs");
const { File, verify } = require("megajs");

const calcSize = (a, b) => {
  if (0 == a) return "0 B";
  var c = 1024,
    d = b || 2,
    e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    f = Math.floor(Math.log(a) / Math.log(c));
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
};

class megaDownloader {
  static async download(url, dest) {
    let response = await axios.get(url);
    let megaURL = response.request.res.responseUrl;
    
    megaURL = url.search("mega") > -1 ? url : megaURL;
    
    let key = new URL(megaURL).hash;
    
    /* verify file key */
    try {
      await verify(key);
    } catch (e) {
      return false;
    }

    let res = File.fromURL(megaURL);
    await res.loadAttributes();

    let filename = res.name;
    let size = res.size;
    let stream = res.download();
    return new Promise((resolve, reject) => {
      if (!_fs.existsSync(dest)) _fs.mkdirSync(dest, { recursive: true });
      const file = _fs.createWriteStream(_path.join(dest, filename));
      stream.pipe(file);
      console.log(
        "☕  " + _colors.yellow("Start Downloading File : " + filename),
      );
      let currentSize = 0;
      const loadbar = new _proggers.Bar(
        {
          format:
            "🕒 Downloading " +
            _colors.green("{bar}") +
            " {percentage}% | {current}/{size} | ETA: {eta}s | Speed: {speed}",
          barsize: 25,
        },
        _proggers.Presets.shades_classic,
      );
      loadbar.start(size, 0, {
        size: calcSize(size, 3),
        current: calcSize(currentSize, 3),
        speed: 0,
      });
      stream.on("data", (buffer) => {
        currentSize += buffer.length;
        loadbar.increment(buffer.length, {
          speed: calcSize(buffer.length),
          current: calcSize(currentSize, 3),
        });
      });
      stream.on("end", (_) => {
        loadbar.stop();
        file.close();
        console.log(
          "✅  " + _colors.green("Success Download File : " + filename),
        );
        resolve();
      });
      stream.on("error", (_) => {
        loadbar.stop();
        console.log(
          "❌  " + _colors.green("Error Download File : " + filename),
        );
        reject();
      });
    });
  }
}

module.exports = megaDownloader;
