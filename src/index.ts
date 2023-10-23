import { scrapeVelogPosts } from './scraper/scrapeVelogPosts';

const main = async () => {
  const userId = 'sssssssssy';

  await scrapeVelogPosts(userId);
};
main();

export { scrapeVelogPosts };
