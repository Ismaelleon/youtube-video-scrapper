class VideoScrapper {
	constructor () {
		this.links = [];
		this.prefix = 'https://youtube.com/results?search_query=';
		this.elSelector = '#title-wrapper > h3 > a';
	}

	async init (rl, Builder, By, until, chrome) {
		this.searchQuery = await rl.question('Insert a search query: ');
		this.searchVideos(Builder, By, until, chrome);
	}

	async searchVideos (Builder, By, until, chrome) {
		const options = new chrome.Options().headless().windowSize({ width: 640, height: 480 });
		const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

		try {

			await driver.get(this.prefix + this.searchQuery);
			const links = await driver.wait(until.elementsLocated(By.css(this.elSelector)), 5000);

			for (let link of links) {
				link = await link.getAttribute('href');
				link = link.split('&')[0].replace('youtube', 'youtubepp');
				console.log(link)
				this.links.push(link);
			}
		} catch (error) {
			console.log(error);
		} finally {
			await driver.quit();
		}
	}

	
}

module.exports = VideoScrapper;
