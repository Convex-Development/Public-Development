const db = require('./db'),
			safety = require('./safety');

const socket = require('socket.io'),
	io = socket(app.listen(3000));

var listeners = {};

module.exports = () => {
//socketio
	io.sockets.on('connection', socket => {
	});
}
