const router = require('express').Router();
const { getSongs } = require('../controllers/songs-scrapper.js');

router.post('/get-songs', getSongs); 

module.exports = router;
