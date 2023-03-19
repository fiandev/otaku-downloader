const _https = require("https"),
  _fs = require("fs"),
  _path = require("path"),
  _proggers = require("cli-progress"),
  _colors = require("colors");

const clacSize = (a, b) => {
  if (0 == a) return "0 Bytes";
  var c = 1024,
    d = b || 2,
    e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    f = Math.floor(Math.log(a) / Math.log(c));
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
};

const download = async (url, dest = "./") => {
  const req = await _https.get(url);
  console.log("🎁  " + _colors.yellow("Start Download From URL : " + url));
  console.log("⏳  " + _colors.yellow("Waiting Server Response..."));
  return new Promise((resolve, reject) => {
    req.on("response", (res) => {
      if (!res.headers["content-disposition"]) {
        console.log(
          "🔁  " + _colors.blue("Server Download Error, Try To Get New Link...")
        );
        download(u);
      } else {
        console.log("✅  " + _colors.green("Server Response"));
        const size = parseInt(res.headers["content-length"], 10);
        const filename = decodeURIComponent(
          res.headers["content-disposition"].match(
            /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/
          )[1]
        );
        let currentSize = 0;
        console.log(
          "☕  " + _colors.yellow("Start Downloading File : " + filename)
        );
        if (!_fs.existsSync(dest)) _fs.mkdirSync(dest, { recursive: true });
        const file = _fs.createWriteStream(_path.join(dest, filename));
        res.pipe(file);
        const loadbar = new _proggers.Bar(
          {
            format:
              "Downloading " +
              _colors.green("{bar}") +
              " {percentage}% | {current}/{size} | ETA: {eta}s | Speed: {speed}",
            barsize: 25,
          },
          _proggers.Presets.shades_classic
        );
        loadbar.start(size, 0, {
          size: clacSize(size, 3),
          current: clacSize(currentSize, 3),
          speed: 0,
        });
        res.on("data", (c) => {
          currentSize += c.length;
          loadbar.increment(c.length, {
            speed: clacSize(c.length),
            current: clacSize(currentSize, 3),
          });
        });
        res.on("end", (_) => {
          loadbar.stop();
          file.close();
          console.log(
            "✅  " + _colors.green("Success Download File : " + filename)
          );
          resolve();
        });
        res.on("error", (_) => {
          loadbar.stop();
          console.log(
            "❎  " + _colors.green("Error Download File : " + filename)
          );
          reject();
        });
      }
    });
  });
};
module.exports = download;
