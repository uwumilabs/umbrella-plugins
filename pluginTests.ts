/* eslint-disable */
import * as GogoanimePlugin from './plugins/gogoanime/GogoanimePlugin';
// @ts-expect-error
import * as GogoanimePluginOld from './plugins/gogoanime-old/GoganimePluginOld';

import * as NineAnimePlugin from './plugins/9anime/9animePlugin';

const plugins = [GogoanimePlugin];

async function testPlugin(plugin: any) {
  try {
    await plugin.search('one', 1).then(async (res) => {
      if (res.name) {
        console.log(`✅ ${res.name} - ${res.description}`);
        if (res.items.length > 0) {
          console.log(`✅ ${res.items.length} items found.`);
          console.log(
            `Attempting to get details for first item with id ${res.items[0].id}...`,
          );
          try {
            await plugin.getItemDetails(res.items[0].id).then(async (item) => {
              console.log(`✅ ${item.name} - ${item.description}`);
              if (item.media.length > 0) {
                console.log(`✅ ${item.media.length} media found`);
                console.log('Attempting to get media for first item...');
                try {
                  await plugin.getItemMedia(item.media[0].id).then((media) => {
                    console.log(`✅ ${media.length} media found`);
                  });
                } catch (error) {
                  console.log(
                    `❌ Media failed for ${res.items[0].id}: ${error}`,
                  );
                }
              } else {
                console.log(`❌ No media found`);
              }
            });
          } catch (error) {
            console.log(
              `❌ Item details failed for ${res.items[0].id}: ${error}`,
            );
          }
        } else {
          console.log(`❌ No items found`);
        }
      } else {
        console.log(`❌ Search failed for ${plugin.constructor.name}`);
      }
    });
  } catch (error) {
    console.log(`❌ Search failed for ${plugin.constructor.name}: ${error}`);
  }

  try {
    await plugin.getHomeCategories().then(async (categories) => {
      console.log(`✅ ${categories.length} home categories found.`);
      console.log(`✅ ${categories[0].items.length} items found.`);
      console.log(
        `Attempting to get details for first category first item ${categories[0].items[0].name}...`,
      );
      try {
        await plugin
          .getItemDetails(categories[0].items[0].id)
          .then(async (item) => {
            console.log(`✅ ${item.name} - ${item.description} (${item.id})`);
            if (item.media.length > 0) {
              console.log(`✅ ${item.media.length} media found`);
              console.log(
                `Attempting to get media for first item (number ${item.media[0].number})...`,
              );
              try {
                await plugin.getItemMedia(item.media[0].id).then((media) => {
                  console.log(`✅ ${media.length} media found`);
                });
              } catch (error) {
                console.log(
                  `❌ Media failed for ${categories[0].items[0].id}: ${error}`,
                );
              }
            } else {
              console.log(`❌ No media found`);
            }
          });
      } catch (error) {
        console.log(
          `❌ Category details failed for ${categories[0].items[0].id}: ${error}`,
        );
      }
    });
  } catch (error) {
    console.log(
      `❌ Home categories failed for ${plugin.constructor.name}: ${error}`,
    );
  }
}

plugins.forEach((plugin) => {
  testPlugin(plugin);
});
