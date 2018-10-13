'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const upload = multer();

const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
})

app.post('/api/fileanalyse', upload.single('upfile'),function(req, res) {
	let size = req.file.size;
	let name = req.file.originalname;
	res.status(200).json({
		filename: name,
		size: size
	});
});

app.use(function (req, res, next) {
  res.send('404: Page not found!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.send('500: Internal Server Error. ');
});

app.listen(process.env.PORT || 3000, function() {
	console.log('app has started');
})