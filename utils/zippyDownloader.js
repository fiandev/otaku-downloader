#!/usr/bin/env node

const _proggers = require("cli-progress"),
  _colors = require("colors"),
  _fs = require("fs"),
  _$ = require("cheerio"),
  _url = require("url"),
  _https = require("https"),
  _axios = require("axios"),
  _async = require("async"),
  _math = require("mathjs"),
  _zsExtract = require("zs-extract"),
  _download = require("./downloader.js"),
  _version = require("../package.json").version,
  zippy = {};

zippy.GetLink = async (u) => {
  let response = await _axios.get(u);
  let $ = _$.load(response.data);
  let baseurl = new URL("https:" + $(`meta[property="og:url"]`).attr("content"))
    .origin;
  let extract = await _zsExtract.extract(u);
  let linkdl = extract.download;

  let origin = new URL(linkdl).origin;
  return linkdl.replace(origin, baseurl);
};

zippy.download = async (u, cb = () => {}) => {
  const url = await zippy.GetLink(u);
  await _download(url);
};

module.exports = zippy;
