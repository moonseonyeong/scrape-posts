import puppeteer, { Page } from 'puppeteer';

export const launchBrowser = async (headless: boolean) => {
  const browser = await puppeteer.launch({
    headless: headless,
    protocolTimeout: 60000,
  });

  return browser;
};

export const goToPage = async (headless: boolean, url: string) => {
  const browser = await launchBrowser(headless);

  const page = await browser.newPage();
  page.setViewport({ width: 1400, height: 1000 });
  await page.goto(url, { waitUntil: 'networkidle2' });

  return { page, browser };
};

export const scrollToBottom = async (page: Page) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      let totalHeight = 0;
      const distance = 1000;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};
