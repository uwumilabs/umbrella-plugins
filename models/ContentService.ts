import type {Category,DetailedItem} from './item';
import type {ExtractorAudio, ExtractorVideo, RawAudio,RawVideo} from './media';

export interface ContentService {
  /**
   * 
   * @param query search query
   * @param page  page number (optional)
   * @returns a promise that resolves to a `Category` object containing search results
   */
  search(query: string, page?: number): Promise<Category>;
  /**
   * 
   * @param category category name
   * @param page page number (optional)
   * @returns a promise that resolves to a `Category` object containing items in the specified category
   */
  getCategory?(category: string, page?: number): Promise<Category>;
  /**
   * @returns a promise that resolves to an array of `Category` objects representing home categories
   */
  getHomeCategories(): Promise<Category[]>;
  /**
   * 
   * @param id item ID (e.g., id from search results or category items)
   * @returns a promise that resolves to a `DetailedItem` object containing detailed information about the item
   */
  getItemDetails(id: string): Promise<DetailedItem>;
  /**
   * 
   * @param id item ID (e.g., id from item details)
   * @returns a promise that resolves to an array of media objects (RawAudio, RawVideo, ExtractorAudio, ExtractorVideo) associated with the item
   */
  getItemMedia(id: string): Promise<(RawAudio | RawVideo | ExtractorAudio | ExtractorVideo)[]>;
}

export default ContentService;
