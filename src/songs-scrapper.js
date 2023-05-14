const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const colors = require('colors');

class SongsScrapper {
	constructor () {
		this.songs = [];
		this.prefix = 'https://music.youtube.com/search?q=';
		this.elSelector = '.title-column > :first-child > a';
	}

	async getSongs (searchQuery) {
		const options = new chrome.Options();
		options.
			//addArguments('--headless=new').
			addArguments('--no-sandbox').
			addArguments('--start-maximized');

		const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

		try {
			await driver.get(this.prefix + searchQuery);

			const filterButton = await driver.wait(until.elementLocated(By.css('#chips:nth-child(2) > :nth-child(2) > div > a')));
			const actions = await driver.actions({ async: true });
			await actions.move({ origin: filterButton }).click().perform();

			await driver.actions().scroll(0, 0, 0, 1000 * 10000).perform();

			const links = await driver.findElements(By.css(this.elSelector));

			for (let link of links) {
				const songName = await link.getAttribute('innerText');
				const path = await link.getAttribute('href');
				const songLink = 'https://youtubepp.com/' + path;

				this.songs.push({
					name: songName,
					link: songLink,
				});
			}

			return this.songs
		} catch (error) {
			console.log(error);
		}
	}

	async downloadVideos () {
		const options = new chrome.Options();
		options.
			addArguments('--headless=new').
			addArguments('--no-sandbox').
			addArguments('--start-maximized');

		try {
			for (let i = 0; i < this.links.length; i++) {
				const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
				const originalTab = await driver.getWindowHandle();

				await driver.get(this.links[i]);

				const button = await driver.wait(until.elementLocated(By.css('td:nth-child(3) > button')));
				const actions = await driver.actions({ async: true });
				await actions.move({ origin: button }).click().perform();

				const tabs = await driver.getAllWindowHandles();

				if (tabs.length > 0) {
					await driver.switchTo().window(originalTab);
					await actions.move({ origin: button }).click().perform();
				}

				const downloadButton = await driver.wait(until.elementLocated(By.css('#process-result > div > a')));
				const link = await downloadButton.getAttribute('href');

				await driver.get(link);

				setTimeout(async () => {
					await driver.close();
					console.log(`${this.videoNames[i]} successfully downloaded!`.green);
				}, 10000)
			}
		} catch (error) {
			console.log(error);
		}
	}

	
}

module.exports = SongsScrapper;
