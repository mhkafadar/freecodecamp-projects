const mongoose = require('mongoose');
const shortId = require('shortid');

const userSchema = new mongoose.Schema({
	username: String,
	userId: { 'type': String, 'default': shortId.generate },
	exercises: [{
		desc: String,
		duration: Number,
		date: Date		
	}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;