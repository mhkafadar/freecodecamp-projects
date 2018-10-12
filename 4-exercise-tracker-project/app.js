const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortId = require('shortid');

const routes = require('./routes.js')

const app = express();

mongoose.connect('mongodb://localhost:27017/exercise3');

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use(routes);


app.use(function(req, res, next) {
	return next({status: 404, message: 'not found'});
});

app.use(function(err, req, res, next) {
	let errCode;
	let errMessage;
	if(err.errors) {
	errCode = 400
	const keys = Object.keys(err.errors)
	errMessage = err.errors[keys[0]].message
	} else {
		errCode = err.status || 500
		errMessage = err.message || 'Internal Server Error'
	}
	res.status(errCode).type('txt').send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, function() {
	console.log('application has started');
})