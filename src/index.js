const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const readline = require('node:readline/promises');
const VideoScrapper = require('./videoscrapper');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const videoScrapper = new VideoScrapper();

videoScrapper.init(rl, Builder, By, until, chrome);
