// @ts-nocheck
// Include ts-nocheck here if using modules that arent builtin to node
// Also delete any imports from this file. Use require() instead
//This is an example plugin. Do not use in production.
// Functions' return types are placeholders
// Actual types are in models/ folder
// Refer to models/ContentService.ts
class GogoanimePluginOld {
  baseUrl = "https://gogoanimes.fi";
  // baseUrl = "https://gogoanime.ink";
  //   ajaxUrl = "https://ajax.gogocdn.net";
  sourceType = "Video";
  async search(query, page) {
    try {
      var baseUrl = this.baseUrl;
      const url = `${baseUrl}/search?keyword=${query}&page=${page || 1}`;
      const response = await fetch(url)
        .then((response) => response)
        .then((data) => data.text());
      if (!response) {
        return {};
      }
      // const ulRegex = /<ul.*class="items".*>([\s\S]*?)<\/ul>/;
      // const listUl = response.match(ulRegex)[1];
      // const listItemsRegex = /<li>([\s\S]*?)<\/li>/g;
      // const listItems = [...listUl.matchAll(listItemsRegex)].map(
      //   (item) => item[1]
      // );
      // const items = [];
      // const idRegex = /<a[\s\S]*?href="\/category\/(.*?)"[\s\S]*?title=".*?">/;
      // const nameRegex =
      //   /<a[\s\S]*?href="\/category\/.*?"[\s\S]*?title="(.*?)">/;
      // const descriptionRegex = /:(.*?)<\/p>/;
      // const imageUrlRegex = /<img[\s\S]*?src="(.*?)"/;
      // for (const item of listItems) {
      //   const id = item.match(idRegex)[1];
      //   const name = item.match(nameRegex)[1];
      //   const description = item.match(descriptionRegex)[1].trim();
      //   var imageUrl = item.match(imageUrlRegex)[1];
      //   if (imageUrl.startsWith("/")) {
      //     imageUrl = `${this.baseUrl}/${imageUrl}`;
      //   }
      //   items.push({
      //     id,
      //     name,
      //     description,
      //     imageUrl,
      //     url: url,
      //     type: this.sourceType,
      //   });
      // }
      const items = [];
      // @ts-expect-error
      const $ = Cheerio.load(response);
      $(".items li").each(function () {
        var item = {};
        item["id"] = $(this).find("a").attr("href").split("/")[2];
        // throw new Error(`${item["id"]}`);
        item["name"] = $(this).find(".name a").text().trim();
        item["description"] = $(`this`).find(".released").text().trim();
        item["imageUrl"] = $(this).find("img").attr("src").startsWith("/")
          ? `${baseUrl}${$(this).find("img").attr("src")}`
          : $(this).find("img").attr("src");
        item["url"] = $(this).find("a").attr("href").startsWith("/")
          ? `${baseUrl}${$(this).find("a").attr("href")}`
          : $(this).find("a").attr("href");
        item["type"] = "Video";
        items.push(item);
      });
      return {
        name: "Gogoanime (Old)",
        description: `Search results for ${query}`,
        url: decodeURIComponent(
          `${this.baseUrl}/search.html?keyword=${query}&page=${page}`
        ),
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
    return [];
  }
  async getItemDetails(id) {
    const url = `${this.baseUrl}/category/${id}`;
    // throw new Error(url);
    const response = await fetch(url)
      .then((response) => response)
      .then((data) => data.text());
    if (!response) {
      return {};
    }
    const nameRegex = /<h1>([\s\S]*?)<\/h1>/;
    const name = response.match(nameRegex)[1].trim();
    const descriptionRegex = /Type:[\s\S]*?title="(.*)"/;
    const description = response.match(descriptionRegex)[1].trim();
    const imageUrlRegex = /anime_info_body_bg">[\s\S]*?<img[\s\S]*?src="(.*?)"/;
    var imageUrl = response.match(imageUrlRegex)[1];
    if (imageUrl.startsWith("/")) {
      imageUrl = `${this.baseUrl}/${imageUrl}`;
    }
    const language = name.includes("(Dub)") ? "English" : "Sub";
    const synopsisRegex = /Synopsis: ([\s\S]*?)<\/div>/;
    var synopsis = response.match(synopsisRegex)[1].trim();
    const openingTagRegex = /<.*?>/g;
    synopsis = synopsis.replace(openingTagRegex, "");
    const closingTagRegex = /<\/.*?>/g;
    synopsis = synopsis.replace(closingTagRegex, "");
    const genres = [];
    const genresElementRegex = /Genre:.*<\/span>[\s\S]*?<\/p>/;
    const genresElement = response.match(genresElementRegex)[0];
    const genresRegex = /<a[\s\S]*?href='(.*?)'[\s\S]*?title='(.*?)'/g;
    const genresList = [...genresElement.matchAll(genresRegex)];
    for (const genre of genresList) {
      if (genre[1].startsWith("/")) {
        genre[1] = `${this.baseUrl}/${genre[1]}`;
      }
      if (genre[1] === "javascript:void(0);") {
        continue;
      }
      genres.push({
        id: genre[1].split("/").pop(),
        name: genre[2],
        url: genre[1].startsWith("/") ? this.baseUrl + genre[1] : genre[1],
      });
    }
    const releaseDateRegex = /Released:[\s\S]*?<\/span>(.*?)<\/p>/;
    const releaseDate = response.match(releaseDateRegex)[1].trim();
    const statusRegex = /Status:[\s\S]*?title=".*">(.*?)</;
    const status = response.match(statusRegex)[1].trim();
    const ohterNamesRegex = /Other name:[\s\S]*?>([\s\S]*?)</;
    const otherNames = response.match(ohterNamesRegex)[1].trim().split(",");
    const episodes = [];
    const episodesRegex =
      /<li>[\s\S]*?<a[\s\S]*?href="\/(.*?)"[\s\S]*?span>([\s\S]*?)<\/div[\s\S]*?cate">([\s\S]*?)</g;
    const episodesList = [...response.matchAll(episodesRegex)];
    for (const episode of episodesList) {
      episodes.push({
        id: episode[1].trim(),
        name: episode[2]
          .replace(openingTagRegex, "")
          .replace(closingTagRegex, "")
          .trim(),
        url: this.baseUrl + "/" + episode[1],
        language: episode[3].trim().toLowerCase() === "dub" ? "English" : "Sub",
        number: parseInt(
          episode[2] === "Movie" ? "0" : episode[2].trim().split(" ")[1]
        ),
      });
    }
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
      status: status,
      otherNames: otherNames,
    };
  }
  async getItemMedia(id) {
    const episodePageResponse = await fetch(`${this.baseUrl}/${id}`)
      .then((response) => response)
      .then((data) => data.text());
    if (!episodePageResponse) {
      return [];
    }
    const ulRegex = /<li[\s\S]*?class="anime">([\s\S]*?)<\/ul>/;
    const ul = episodePageResponse.match(ulRegex)[1];
    const embedInfoRegex =
      /<a[\s\S]*?data-video="(.*?)"[\s\S]*?\/i>([\s\S]*?)</g;
    const embedInfoList = [...ul.matchAll(embedInfoRegex)];
    const sources = [];
    for (const item of embedInfoList) {
      sources.push({
        type: "ExtractorVideo",
        url: item[1].startsWith("//") ? `https:${item[1]}` : item[1],
        name: item[2].trim(),
      });
    }
    return sources;
  }
}

module.exports = {
  search: async (query: string, page?: number) =>
    new GogoanimePluginOld().search(query, page),
  getCategory: async (category: string, page?: number) =>
    new GogoanimePluginOld().getCategory(category, page),
  getHomeCategories: async () => new GogoanimePluginOld().getHomeCategories(),
  getItemDetails: async (id: string) =>
    new GogoanimePluginOld().getItemDetails(id),
  getItemMedia: async (id: string) =>
    new GogoanimePluginOld().getItemDetails(id),
};
