// @ts-nocheck
// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead
//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts

import { Cheerio, CheerioAPI } from "cheerio";

const cheerio = require("cheerio");

var buffer = require("buffer").Buffer;
class GogoanimePlugin {
  baseUrl = "https://gogoanimez.to";
  // ajaxUrl = 'https://ajax.gogocdn.net';
  sourceType = "Video";
  async search(query, page) {
    try {
      const pageNum = page || 1;

      const url = `${this.baseUrl}/page/${pageNum}/?s=${query}`;
      const response = await fetch(url)
        .then((response) => response)
        .then((data) => data.text());
      if (!response) {
        return {};
      }

      // @ts-expect-error
      const $ = Cheerio.load(response);

      var items = [];
      $(".bs").each(function () {
        var item = {};
        item["id"] = $(this).find("a").attr("href").split("/")[
          $(this).find("a").attr("href").split("/").length - 2
        ];
        // throw new Error(`${item["id"]}`);
        item["name"] = $(this).find("div.tt").text().split("<")[0].trim();
        item["description"] = $(this).find(".typez").text().trim();
        item["imageUrl"] = $(this).find("img").attr("src");
        item["url"] = $(this).find("a").attr("href").startsWith("/")
          ? `${this.baseUrl}${$(this).find("a").attr("href")}`
          : $(this).find("a").attr("href");
        item["type"] = "Video";
        items.push(item);
      });
      return {
        name: "Gogoanime",
        description: `Search results for ${query}`,
        url: decodeURIComponent(`${this.baseUrl}/page/${pageNum}/?s=${query}`),
        isPaginated: true,
        nextPageNumber: page + 1,
        previousPageNumber: page > 1 ? page - 1 : undefined,
        items: items,
      };
    } catch (err) {
      throw err;
    }
  }
  async getCategory(category, page) {
    return {};
  }
  async getHomeCategories() {
    const baseUrl = this.baseUrl;
    const response = await fetch(`${baseUrl}`)
      .then((response) => response)
      .then((data) => data.text());

    // @ts-expect-error
    const $: CheerioAPI = Cheerio.load(response);

    var categories = [];

    var index = 0;

    $(".bixbox")
      .filter(function () {
        return $(this).find("div.listupd") !== undefined;
      })
      .map(function () {
        var category = {};
        category["name"] = $(this)
          .find("div.releases")
          .children()
          .first()
          .text()
          .trim();
        category["url"] = baseUrl;
        category["isPaginated"] = false;
        category["items"] = (($) => {
          var items = [];
          $(this)
            .find("article.bs a")
            .each(function () {
              var item = {};
              item["id"] = $(this)
                .attr("href")
                .split("/")
                [$(this).attr("href").split("/").length - 2].split(
                  /episode-([0-9]+)/
                )[0];
              item["name"] = $(this)
                .find("div.tt > h2")
                .text()
                .split("Episode")[0]
                .trim();
              item["description"] = $(this).find("div.bt > span").text().trim();
              item["imageUrl"] = $(this).find("img").attr("src");
              item["url"] = $(this).attr("href").startsWith("/")
                ? `${baseUrl}${$(this).find("a").attr("href")}`
                : $(this).find("a").attr("href");
              item["type"] = "Video";
              items.push(item);
            });
          return items;
        })($);
        categories.push(category);
      });

    $(".series-gen ul.nav-tabs li").each(function () {
      var category = {};
      category["name"] = $(this).find("a").text().trim();
      category["url"] = baseUrl;
      category["isPaginated"] = false;
      category["items"] = (($) => {
        var items = [];
        $(`.series-gen div.listupd > div:nth-child(${$(this).index() + 1})`)
          .find("article.bs a")
          .each(function () {
            var item = {};
            item["id"] = $(this)
              .attr("href")
              .split("/")
              [$(this).attr("href").split("/").length - 2].split(
                /episode-([0-9]+)/
              )[0];
            item["name"] = $(this)
              .find("div.tt > h2")
              .text()
              .split("Episode")[0]
              .trim();
            item["description"] = $(this).find("div.bt > span").text().trim();
            item["imageUrl"] = $(this).find("img").attr("src");
            item["url"] = $(this).attr("href").startsWith("/")
              ? `${baseUrl}${$(this).find("a").attr("href")}`
              : $(this).find("a").attr("href");
            item["type"] = "Video";
            items.push(item);
          });
        return items;
      })($);
      categories.push(category);
    });

    $("div.section:nth-child(1) ul.ts-wpop-nav-tabs li").each(function () {
      var category = {};
      category["name"] = $(this).find("span").text().trim();
      category["url"] = baseUrl;
      category["isPaginated"] = false;
      category["items"] = (($) => {
        var items = [];
        $(
          `div.section:nth-child(1) div.serieslist:nth-child(${
            $(this).index() + 1
          })`
        )
          .find("ul li")
          .each(function () {
            var item = {};
            item["id"] = $(this).find("h4 > a").attr("href").split("/")[
              $(this).find("h4 > a").attr("href").split("/").length - 2
            ];
            item["name"] = $(this).find("h4 > a").text().trim();
            item["description"] = $(this).find("div.ctr").text().trim();
            item["imageUrl"] = $(this).find("img").attr("src");
            item["url"] = $(this).find("h4 > a").attr("href").startsWith("/")
              ? `${baseUrl}${$(this).find("h4 > a").attr("href")}`
              : $(this).find("h4 > a").attr("href");
            item["type"] = "Video";
            items.push(item);
          });
        return items;
      })($);
      categories.push(category);
    });

    return categories;
  }
  async getItemDetails(id) {
    const baseUrl = this.baseUrl;
    const url = `${this.baseUrl}/anime/${id}/`;
    const response = await fetch(url)
      .then((response) => response)
      .then((data) => data.text());
    if (!response) {
      return {};
    }

    // @ts-expect-error
    const $ = Cheerio.load(response);

    const name = $("h1.entry-title").text().trim();
    const description = $(".spe span")
      .filter(function () {
        return $(this).find("b").text().includes("Type:");
      })
      .first()
      .text()
      .replace("Type:", "")
      .trim();
    const imageUrl = $(".thumb img").attr("src");
    const language = "Unknown";
    var synopsis = "";
    $(".entry-content p").each(function () {
      synopsis += $(this).text().trim() + "\n\n";
    });
    var genres = [];
    $(".genxed a").each(function () {
      genres.push({
        id: $(this).attr("href").split("/")[2],
        name: $(this).text().trim(),
        url: $(this).attr("href").startsWith("/")
          ? baseUrl + $(this).attr("href")
          : $(this).attr("href"),
      });
    });
    const releaseDate = $(".spe span")
      .filter(function () {
        return $(this).text().includes("Released:");
      })
      .first()
      .text()
      .replace("Released:", "")
      .trim();
    const creators = $(".spe span")
      .filter(function () {
        return $(this).text().includes("Producers:");
      })
      .first()
      .find("a")
      .map(function () {
        return $(this).text().trim();
      })
      .toArray();
    const status = $(".spe span")
      .filter(function () {
        return $(this).text().includes("Status:");
      })
      .first()
      .text()
      .replace("Status:", "")
      .trim();

    var episodes = [];

    $(".eplister ul li a").each(function () {
      episodes.push({
        id: $(this).attr("href").split("/")[
          $(this).attr("href").split("/").length - 2
        ],
        name: $(this).find(".epl-title").text().trim(),
        url: $(this).attr("href").startsWith("/")
          ? baseUrl + $(this).attr("href")
          : $(this).attr("href"),
        language: language,
        number: Number($(this).find(".epl-num").text().trim()),
      });
    });

    return {
      id: id,
      name: name,
      description: description,
      imageUrl: imageUrl,
      url: url,
      type: this.sourceType,
      language: language,
      synopsis: synopsis,
      genres: genres,
      media: episodes,
      releaseDate: releaseDate,
      creators: creators,
      status: status,
    };
  }
  async getItemMedia(id) {
    const episodePageResponse = await fetch(`${this.baseUrl}/${id}/`)
      .then((response) => response)
      .then((data) => data.text());
    if (!episodePageResponse) {
      return [];
    }
    var sources = [];
    const rawSourcesRegex = /<option[\s\S]*?value="(.+?)"[\s\S]*?>([\s\S]*?)</g;
    const rawSourcesList = [...episodePageResponse.matchAll(rawSourcesRegex)];
    for (const rawSource of rawSourcesList) {
      const rawSourceResponse = await fetch(rawSource[1])
        .then((response) => response)
        .then((data) => data.text());
      const sourceRegex = /<iframe[\s\S]*?src="(.*?)"/;
      const source = rawSourceResponse.match(sourceRegex)[1];
      sources.push({
        type: "ExtractorVideo",
        url: source,
        name: rawSource[2].trim(),
      });
    }
    return sources;
  }
}

module.exports = {
  search: async (query: string, page?: number) =>
    new GogoanimePlugin().search(query, page),
  getCategory: async (category: string, page?: number) =>
    new GogoanimePlugin().getCategory(category, page),
  getHomeCategories: async () => new GogoanimePlugin().getHomeCategories(),
  getItemDetails: async (id: string) =>
    new GogoanimePlugin().getItemDetails(id),
  getItemMedia: async (id: string) => new GogoanimePlugin().getItemMedia(id),
};
