const puppeteer = require('puppeteer');

// (async () => {
// 	// const browser = await puppeteer.launch();
// 	const browser = await puppeteer.launch({
// 		headless: false,
// 		defaultViewport: null,
// 	});
// 	const page = await browser.newPage();

// 	await page.goto('http://localhost:5500/dist/dummy.html');
//   await page.type('#keys input', 'test');
// 	await page.waitForTimeout(5000);
// 	await browser.close();
// })();


describe('Puppeteer Test', () => {
  // let browser: puppeteer.Browser;
  // let page: puppeteer.Page;

  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
    page = await browser.newPage();
  });

  test('type test', async () => {
    await page.goto('http://localhost:5500/dist/dummy.html');
    await page.type('#keys input', 'test');
    const text = await page.$eval('#keys input', el => el.value);
    expect(text).toBe('test');
  });

  afterAll(async () => {
    await browser.close();
  });
});