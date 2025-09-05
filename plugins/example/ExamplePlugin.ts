// @ts-nocheck
import type { Plugin } from "../../models/Plugin";
import ContentService from "../../models/ContentService";
import type Category from "../../models/item/Category";
import type DetailedItem from "../../models/item/DetailedItem";
import type RawAudio from "../../models/media/RawAudio";
import type RawVideo from "../../models/media/RawVideo";
import SourceType from "../../models/source/SourceType";
import manifest from "./ExamplePluginManifest.json";

class ExamplePlugin implements ContentService {
  sourceType: SourceType = SourceType.Video;
  author = manifest.author;
  name = manifest.name;
  version = manifest.version;
  description = manifest.description;
  homePageUrl = manifest.homePageUrl;
  iconUrl = manifest.iconUrl;
  pluginUrl = manifest.pluginUrl;
  manifestUrl = manifest.manifestUrl;

  async search(query: string, page?: number): Promise<Category> {
    return null;
  }

  async getCategory(category: string, page?: number): Promise<Category> {
    return null;
  }

  async getHomeCategories(): Promise<Category[]> {
    return [];
  }

  async getItemDetails(id: string): Promise<DetailedItem> {
    return null;
  }

  async getItemMedia(id: string): Promise<(RawAudio | RawVideo)[]> {
    return [];
  }
}

export default new ExamplePlugin();