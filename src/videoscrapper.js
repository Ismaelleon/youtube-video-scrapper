class VideoScrapper {
	constructor () {
		this.videoNames = [];
		this.links = [];
		this.prefix = 'https://youtube.com/results?search_query=';
		this.elSelector = '#title-wrapper > h3 > a';
	}

	async init (rl, Builder, By, until, chrome) {
		this.searchQuery = await rl.question('Insert a search query: ');
		console.log('Searching videos...')

		this.searchVideos(Builder, By, until, chrome);
	}

	async searchVideos (Builder, By, until, chrome) {
		const options = new chrome.Options();//.addArguments('--headless=new');
		const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

		try {

			await driver.get(this.prefix + this.searchQuery);
			await driver.wait(until.elementsLocated(By.css(this.elSelector)), 5000);

			await driver.actions().scroll(0, 0, 0, 1000 * 10000).perform();

			const links = await driver.findElements(By.css(this.elSelector));

			for (let link of links) {
				const videoName = await link.getAttribute('innerText');
				link = await link.getAttribute('href');
				link = link.split('&')[0].replace('youtube', 'youtubepp');

				console.log(`Found: ${videoName}`);
				
				this.videoNames.push(videoName);
				this.links.push(link);
			}

			console.log('\nDownloading Videos...');
			this.downloadVideos(Builder, By, until, chrome);
		} catch (error) {
			console.log(error);
		}
	}

	async downloadVideos (Builder, By, until, chrome) {
		const options = new chrome.Options().addArguments('--headless=new');
		try {
			for (let i = 0; i < this.links.length; i++) {
				const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

				await driver.get(this.links[i]);

				const button = await driver.wait(until.elementLocated(By.css('td:nth-child(3) > button')));
				const actions = await driver.actions({ async: true });
				await actions.move({ origin: button }).click().perform();

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

module.exports = VideoScrapper;
