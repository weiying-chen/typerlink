// const puppeteer = require('puppeteer');
import * as puppeteer from 'puppeteer';

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
	let browser: puppeteer.Browser;
	let page: puppeteer.Page;

	// let browser;
	// let page;

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: false,
			defaultViewport: null,
      
      // This is necessary to make `--load-extension` work 
      ignoreDefaultArgs: ['--disable-extensions'],
      args: [
        // '--disable-extensions-except=/home/alex/node/chrome-extension-react-typescript-3/dist',
        '--load-extension=/home/alex/node/chrome-extension-react-typescript-3/dist',
      ]
		});
		page = await browser.newPage();
	});

	test('type test', async () => {
		await page.goto('http://localhost:5500/dist/dummy.html');
		await page.type('#keys input', 'test');
    await page.waitForTimeout(2000)
		const text = await page.$eval('#keys input', (el) => el.value);
		expect(text).toBe('test');
	});

	afterAll(async () => {
		await browser.close();
	});
});
