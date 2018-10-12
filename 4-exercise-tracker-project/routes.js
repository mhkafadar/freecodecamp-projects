const express = require('express');
const User = require('./models/user.js');

const router = express.Router();

// index
router.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

// new user post
router.post('/api/exercise/new-user', function(req, res, next) {
	let username = req.body.username;
	User.findOne({ username: username}, function(err, user) {
		if (err) {
			next(err);
			return;
		} if (user) {
			res.json({
				error: 'This username has already taken'
			});
		} else {
			var newUser = new User({
				username: username
			});
			newUser.save(function(err) {
				if(err) {
					next(err);
					return;
				} else {
					res.status(200).json({
						username: newUser.username,
						id: newUser.userId
					});
				}
			});
		}
	});
});

// new exercise post
router.post('/api/exercise/add', function(req, res, next) {
	let userId = req.body.userId;
	User.findOne({userId: userId}, function(err, user) {
		if(err) {
			next(err);
			return;
		}	
		if(!user) {
			res.json({
				error: 'User not found!'
			});
		} else {
			let newEx = {
				desc: req.body.desc,
				duration: req.body.duration,
				date: req.body.date
			}
			user.exercises.push(newEx) 
			user.save();
			res.status(200).json({
				username: user.username,
				description: newEx.desc,
				duration: newEx.duration,
				date: newEx.date
			});
		}
	});
});

// show exercises of user
router.get('/api/exercise/log', function(req, res, next) {
		let userId = req.query.userId;
		let from = new Date(req.query.from);
		let to = new Date(req.query.to);
		let limit = req.query.limit;
	User.findOne({ userId: userId}, function(err, user) {
		if (err) {
			next(err);
			return;
		} if (!user) {
			res.json({ error: 'user not found!'});
		} else {
			let results = user.exercises
			if(to && from) {
				results = results.filter(function(item) {
					return item.date >= from && item.date <= to
				});
			}
			if(!isNaN(limit)) {
				results = results.slice(0, limit);
			}
			res.json({
				exercises: results
			});
		}
	})
});

module.exports = router;