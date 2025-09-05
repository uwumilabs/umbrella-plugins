const NineAnimePlugin = require("../plugins/9anime/9animePlugin");
// pnpm test test/9anime.test.ts
jest.setTimeout(120000);

test("returns a filled array of anime list", async () => {
  const data = await NineAnimePlugin.search("jujutsu kaisen");
  const searchResult = data as { name: string; items: any[] };
  expect(searchResult.name).toBe("9anime");
  expect(searchResult.items.length).toBeGreaterThan(0);
  const item = searchResult.items[0];
  expect(item.id).toBeDefined();
  expect(item.name).toBeDefined();
  expect(item.url).toBeDefined();
  expect(item.imageUrl).toBeDefined();
});

test('returns home categories', async () => {
  const categories = await NineAnimePlugin.getHomeCategories();
  expect(Array.isArray(categories)).toBe(true);
  expect(categories.length).toBeGreaterThan(0);
  const category = categories[0];
  expect(category.name).toBeDefined();
  expect(category.items).toBeDefined();
  expect(Array.isArray(category.items)).toBe(true);
});

test('returns item details', async () => {
  const searchResults = await NineAnimePlugin.search('dandadan');
  const firstItemId = searchResults.items[0].id;
  const details = await NineAnimePlugin.getItemDetails(firstItemId);
  expect(details).toBeDefined();
  expect(details.id).toBe(firstItemId);
  expect(details.name).toBeDefined();
  expect(details.synopsis).toBeDefined();
  expect(details.media).toBeDefined();
  expect(Array.isArray(details.media)).toBe(true);
});

test('returns item media', async () => {
  const searchResults = await NineAnimePlugin.search('dandadan');
  const firstItemId = searchResults.items[0].id;
  const details = await NineAnimePlugin.getItemDetails(firstItemId);
  const firstMediaId = details.media[0].id;
  const media = await NineAnimePlugin.getItemMedia(firstMediaId);
  expect(media).toBeDefined();
  expect(Array.isArray(media)).toBe(true);
  expect(media.length).toBeGreaterThan(0);
  const source = media[0];
  expect(source.url).toBeDefined();
  expect(source.name).toBeDefined();
});