import * as puppeteer from 'puppeteer';

describe('Puppeteer Test', () => {
	let browser: puppeteer.Browser;
	let page: puppeteer.Page;

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: false,
			defaultViewport: null,

			// This is necessary to make `--load-extension` work
			// ignoreDefaultArgs: ['--disable-extensions'],
			// args: [
			// 	// '--disable-extensions-except=/home/alex/node/chrome-extension-react-typescript-3/dist',
			// 	'--load-extension=/home/alex/node/chrome-extension-react-typescript-3/dist',
			// ],
		});
		page = await browser.newPage();
		await page.goto('http://localhost:5500/dist/dummy.html');
	});

	test('`#keys` has display: flex after pressing `/`', async () => {
		await page.waitForSelector('#keys');
		await page.keyboard.press('/');
		const display = await page.$eval('#keys', el => getComputedStyle(el).display);
		expect(display).toBe('flex');
	});

	afterAll(async () => {
		await browser.close();
	});
});
