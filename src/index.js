const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');

const app = express();
const port = process.env.PORT || 8080;

// middlewares
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
	console.log(`app running on port ${port}`);
});
