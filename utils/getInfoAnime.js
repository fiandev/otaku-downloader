const axios = require("axios");
const cheerio = require("cheerio");

const { baseURL } = require("../constants/env.js");

const getInfoAnime = async (url) => {
  let result = {};
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const detailElement = $(".venser").find(".fotoanime");
    const epsElement = $("#_epslist").html();
    let episode_list = [];
    result.thumb = detailElement.find("img").attr("src");
    result.anime_id = url;
    let genre_name, genre_id, genre_link;
    let genreList = [];

    result.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc")
      .find("p")
      .text();

    detailElement.find(".infozin").filter(function () {
      result.title = $(this)
        .find("p")
        .children()
        .eq(0)
        .text()
        .replace("Judul: ", "");
      result.japanase = $(this)
        .find("p")
        .children()
        .eq(1)
        .text()
        .replace("Japanese: ", "");
      result.score = parseFloat(
        $(this).find("p").children().eq(2).text().replace("Skor: ", "")
      );
      result.producer = $(this)
        .find("p")
        .children()
        .eq(3)
        .text()
        .replace("Produser:  ", "");
      result.type = $(this)
        .find("p")
        .children()
        .eq(4)
        .text()
        .replace("Tipe: ", "");
      result.status = $(this)
        .find("p")
        .children()
        .eq(5)
        .text()
        .replace("Status: ", "");
      result.total_episode = parseInt(
        $(this).find("p").children().eq(6).text().replace("Total Episode: ", "")
      );
      result.duration = $(this)
        .find("p")
        .children()
        .eq(7)
        .text()
        .replace("Durasi: ", "");
      result.release_date = $(this)
        .find("p")
        .children()
        .eq(8)
        .text()
        .replace("Tanggal Rilis: ", "");
      result.studio = $(this)
        .find("p")
        .children()
        .eq(9)
        .text()
        .replace("Studio: ", "");
      $(this)
        .find("p")
        .children()
        .eq(10)
        .find("span > a")
        .each(function () {
          let genre_name = $(this).text();
          genreList.push(genre_name);
          result.genre_list = genreList;
        });
    });

    $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
      (i, element) => {
        const dataList = {
          title: $(element).find("span > a").text(),
          id: $(element)
            .find("span > a")
            .attr("href")
            .replace(`${baseURL}`, ""),
          link: $(element).find("span > a").attr("href"),
          uploaded_on: $(element).find(".zeebr").text(),
        };
        episode_list.push(dataList);
      }
    );

    result.episode_list =
      episode_list.length === 0
        ? [
            {
              title: "Masih kosong gan",
              id: "Masih kosong gan",
              link: "Masih kosong gan",
              uploaded_on: "Masih kosong gan",
            },
          ]
        : episode_list.reverse(); // start from episode 1
  } catch (e) {
    /* return */
    return false;
  }
  //console.log(result);
  return result;
};

module.exports = getInfoAnime;
