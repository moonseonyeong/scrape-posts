import { Page } from 'puppeteer';
import { PostSchemaType } from 'src/types';
import { launchBrowser } from './browser';

export const getPostLinks = async (page: Page) =>
  await page.evaluate(() => {
    const linkSelector =
      '#root > div > div > div:nth-child(4) > div:nth-child(3) > div > div >  a:nth-child(1)';

    const links = Array.from(document.querySelectorAll(linkSelector)).map(
      (el: HTMLAnchorElement) => el.href
    );

    return links;
  });

export const getLikeCnt = async (page: Page) => {
  const likeCnt = await page.evaluate(() => {
    const targetDiv = document.querySelector('[data-testid]');
    const spanElement = targetDiv.querySelector('span');
    const spanValue = spanElement.textContent;

    return spanValue;
  });

  return likeCnt;
};

export const getTitle = async (page: Page) => {
  await page.waitForSelector('div.head-wrapper');

  const title = await page.evaluate(() => {
    const title = document.getElementsByTagName('h1')[0]?.textContent;

    return title;
  });

  return title;
};

export const getContent = async (page: Page) => {
  await page.waitForSelector('div.atom-one');
  const content = await page.evaluate(() => {
    const contentClassName = `atom-one`;

    const content = document.getElementsByClassName(contentClassName)[0]?.innerHTML;

    return content;
  });

  return content;
};

export const getCreatedAt = async (page: Page) => {
  await page.waitForSelector('div.information');

  const createdAtText = await page.evaluate(() => {
    const createdAtElement = document.getElementsByClassName(`information`)[0];
    const createdAt = createdAtElement?.lastChild?.textContent;

    return createdAt;
  });

  if (createdAtText.includes('일 전')) {
    const daysAgo = Number(createdAtText.split('일 전')[0]);
    const previousDate = calculatePreviousDate(daysAgo);
    const formattedDate = formatDate(previousDate);

    return formattedDate;
  }

  return createdAtText;
};

const calculatePreviousDate = (daysAgo: number) => {
  const today = new Date();
  const previousDate = new Date(today);
  previousDate.setDate(today.getDate() - daysAgo);

  return previousDate;
};

const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

export const getPost = async (page: Page): Promise<PostSchemaType> => {
  return {
    title: await getTitle(page),
    content: await getContent(page),
    createdAt: await getCreatedAt(page),
    like: await getLikeCnt(page),
  };
};

export const scrapePosts = async (postLinksChunk: string[]) => {
  const posts = [];
  const browser = await launchBrowser(true);

  for (let i = 0; i < postLinksChunk.length; i++) {
    const link = postLinksChunk[i];
    const postPage = await browser.newPage();

    try {
      await postPage.goto(link);
      const data = await getPost(postPage);
      posts.push(data);

      await postPage.close();
    } catch (err) {
      console.log(`Fail_chunk : `, {
        link,
        reason: err.message,
      });

      await postPage.close();
    }
  }

  await browser.close();

  return posts;
};
