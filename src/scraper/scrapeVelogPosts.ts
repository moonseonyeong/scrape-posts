import { PostSchemaType } from 'src/types';
import { goToPage, launchBrowser, scrollToBottom } from '../utils/browser';
import { getPost, getPostLinks, scrapePosts } from '../utils/scraper';
import mysql from 'mysql2/promise';
import { dbConfig } from './db';

export const scrapeVelogPosts = async (userId: string) => {
  const url: string = `https://velog.io/@${userId}`;
  const { page } = await goToPage(true, url);

  await scrollToBottom(page);

  try {
    const postLinks = await getPostLinks(page);
    console.log({ postLinks });
    const posts: PostSchemaType[] = await scrapePosts(postLinks);

    const connection = await mysql.createConnection({
      ...dbConfig,
      ssl: {
        rejectUnauthorized: true,
      },
    });

    for (let post of posts) {
      const query = `INSERT INTO posts (title, subtitle, content, is_prev, category_id, date, \`like\`, series_id, view_cnt)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const parts = post.createdAt.split(' ');
      const year = parts[0].slice(0, 4);
      const month = parts[1].slice(0, -1);
      const day = parts[2].slice(0, -1);
      const mysqlDate = `${year}-${month}-${day}`;

      const values = [
        post.title,
        null,
        post.content,
        1, // is_prev value
        9, // category_id value
        mysqlDate,
        post.like,
        null, // series_id value
        0, // view_cnt value
      ];

      const [rows, fields] = await connection.execute(query, values);

      console.log(`Inserted post with title: ${post.title}`);
    }
  } catch (err) {
    console.log(`Error`, err);
  }
};
