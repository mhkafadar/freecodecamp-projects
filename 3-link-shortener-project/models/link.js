const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/shortlink2");

autoIncrement.initialize(connection);

const linkSchema = new mongoose.Schema({
	forward: { type: String, unique: true, required: true },
	linkId: Number
});

linkSchema.plugin(autoIncrement.plugin, { model: 'Link', field: 'linkId', startAt: 1} );
const Link = connection.model('Link', linkSchema);
module.exports = Link