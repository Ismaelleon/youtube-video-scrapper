const SongsScrapper = require('../songs-scrapper');
const songsScrapper = new SongsScrapper();

async function getSongs (req, res) {
	const { artist } = req.body;

	try {
		const songs = await songsScrapper.getSongs(artist);

		console.log(songs);

		res.json({ songs }).end();
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getSongs,
};
