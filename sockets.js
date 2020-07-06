const db = require('./db'),
			safety = require('./safety');

const socket = require('socket.io'),
	io = socket(app.listen(3000));

var listeners = {};

module.exports = () => {
//socketio
io.sockets.on('connection', socket => {
	socket.on('fetch-account-info', async info => {
		let session = info.session;
		socket.emit('user-info', await db.getUserParts(session, ['username', 'email'])).catch(error => console.log(error));
	});

	// search for users
	socket.on('search-request', async info => {
		let users = await db.getUsersBy('username', info.val, true);
		let names = [];
		for (let u of users) names.push(u.username);
		socket.emit('search-results', {
			results: names
		});
	});

	socket.on('change-settings-data', async info => {
		let token = info.session;
		let section = info.section;

		let success = true;
		
		if (section == 'tfa') success = await db.changeUserData(token, ['settings.tfa', [info.checked]]);
		else if (section == 'en') success = await db.changeUserData(token, ['settings.externalNotifications', [info.checked]]);
		else if (section == 'nn') success = await db.changeUserData(token, ['settings.newsletter', [info.checked]]);
		else if (section == 'posts') success = await db.changeUserData(token, ['settings.posts', [info.checked]]);
		else if (section == 'chats') success = await db.changeUserData(token, ['settings.chats', [info.checked]]);
		else if (section == 'posts') success = await db.changeUserData(token, ['settings.posts', [info.checked]]);
		else if (section == 'update_notifications') success = await db.changeUserData(token, ['settings.updates', [info.checked]]);
		else if (section == 'bio') success = await db.changeUserData(token, ['profile.bio', [info.bio]]);
		else if (section == 'change-password') success = await db.changeUserData(token, ['password', [info.new_password]]);
		else if (section == 'post-options') success = await db.changeUserData(token, ['settings.postsPrivacy', [info.content]]);
		else if (section == 'messaging-options') success = await db.changeUserData(token, ['settings.messagingPrivacy', [info.content]]);
		else if (section == 'follow') success = await follow(token, info.token);
		else if (section == 'friend') success = await addfriend(token, info.token, 'add_friend')
		else if (section == 'accept-friend-request') success = await addfriend(token, info.token, 'accept_request');
		else if (section == 'reject-friend-request') success = await addfriend(token, info.token, 'reject_request');
		else if (section == 'remove-friend') success = await addfriend(token, info.token, 'unfriend');

		socket.emit('change-settings-data-' + section, success);
	});

	socket.on('notifications_checked', async info => {
		let notifications = db.getUserPart(info.token, 'notifications');
		db.replaceUserArray(info.token, 'notifications', []);
		socket.emit('notifications_checked_successfully');
	});

	socket.on('add-notification-listener', async info => {
		let notifs = db.getUserPart(info.token, 'notifications');

		if (info.token in listeners){
			listeners[info.token]();
		}

		if (notifs.length == 0) return;
		let date = parseInt(notifs[notifs.length-1].split('|')[0]);
		// less than 10 seconds
		if (Date.now() - date < 10000){
			socket.emit('new_notification', notifs[notifs.length - 1]);
		}

	});

	// socket.on('fetch-people', async info => {
	// 	let snapshot = await reference.once('value').catch(console.log);
	// 	if (info.filter == 'all') {
	// 		let emitHTML = ``,
	// 			i = 0,
	// 			toArray = Object.entries(snapshot.val());

	// 		for (user of toArray) {
	// 			i++;
	// 			emitHTML += `
	// 				<div id="${user[1].userid}" class="user" onclick="seeInfo(${
	// 				user[1].userid
	// 			})" onmouseenter="userHover(${
	// 				user[1].userid
	// 			})" onmouseout="userUnhover(${user[1].userid})">
	// 					<p class="username">${user[1].username}</p>
	// 				</div>
	// 			`;

	// 			if (i >= Object.entries(snapshot.val()).length) {
	// 				socket.emit('people', {
	// 					people: emitHTML
	// 				});
	// 			}
	// 		}
	// 	} else if (info.filter == 'administrators') {
	// 		let emitHTML = ``,
	// 			i = 0,
	// 			admins = 0,
	// 			toArray = Object.entries(snapshot.val());

	// 		for (user of toArray) {
	// 			for (rank of user[1].rank) {
	// 				if (rank == 'administrator') {
	// 					admins++;
	// 				}
	// 			}
	// 		}

	// 		for (user of toArray) {
	// 			for (rank of user[1].rank) {
	// 				if (rank == 'administrator') {
	// 					i++;
	// 					console.log(rank);
	// 					emitHTML += `
	// 						<div id="${user[1].userid}" class="user" onclick="seeInfo(${
	// 						user[1].userid
	// 					})" onmouseenter="userHover(${
	// 						user[1].userid
	// 					})" onmouseout="userUnhover(${user[1].userid})">
	// 							<p class="username">${user[1].username}</p>
	// 						</div>
	// 					`;

	// 					if (i >= admins) {
	// 						console.log(emitHTML);
	// 						socket.emit('people', {
	// 							people: emitHTML
	// 						});
	// 					}
	// 				}
	// 			}
	// 		}
	// 	} else if (info.filter == 'disabled-accounts') {
	// 		let emitHTML = ``,
	// 			i = 0,
	// 			disabled = 0,
	// 			toArray = Object.entries(snapshot.val());

	// 		for (user of toArray) {
	// 			for (rank of user[1].rank) {
	// 				if (rank == 'disabled') {
	// 					disabled++;
	// 				}
	// 			}
	// 		}

	// 		for (user of toArray) {
	// 			for (rank of user[1].rank) {
	// 				if (rank == 'disabled') {
	// 					i++;
	// 					console.log(rank);
	// 					emitHTML += `
	// 						<div id="${user[1].userid}" class="user" onclick="seeInfo(${
	// 						user[1].userid
	// 					})" onmouseenter="userHover(${
	// 						user[1].userid
	// 					})" onmouseout="userUnhover(${user[1].userid})">
	// 							<p class="username">${user[1].username}</p>
	// 						</div>
	// 					`;

	// 					if (i >= disabled) {
	// 						console.log(emitHTML);
	// 						socket.emit('people', {
	// 							people: emitHTML
	// 						});
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// });

	socket.on('fetchUserInfo', async info => {
		socket.emit('catch-user-info', await db.getUserParts(info.userid, ['username', 'token', 'settings.bio', 'email'])).catch(console.log);
	});

	socket.on('disable-account', async info => {
		let disabled = db.getUserById(info.userid);
		let me = db.getUserBy('token', info.token);
		if (!me || !disabled) return;

		let disranks = disabled.profile.ranks;
		let meranks = me.profile.ranks;
		let admins = ['administrator', 'manager', 'content_creator', 'email_support_team'];
		for (let i of admins) if (disranks.includes(i)) return;
		
		let canDisable = false;
		for (let i of admins) if (meranks.includes(i)) canDisable = true;

		if (canDisable) db.replaceUserArray(info.userid, 'profile.ranks', ['disabled-' + info.type + '-' + info.reason], true);

		socket.emit('account-disabled');
	});

	socket.on('fetch-audit-log', info => {
		socket.emit('catch-audit-log');
	});

	socket.on('enable-account', async info => {
		let enabled = db.getUserById(info.userid);
		let me = db.getUserBy('token', info.token);
		if (!me || !disabled) return;

		let enranks = enabled.profile.ranks;
		let meranks = me.profile.ranks;
		let admins = ['administrator', 'manager', 'content_creator', 'email_support_team'];
		for (let i of admins) if (enranks.includes(i)) return;
		
		let canEnable = false;
		for (let i of admins) if (meranks.includes(i)) canDisable = true;

		if (canEnable) db.replaceUserArray(info.userid, 'profile.ranks', ['user'], true);
		
		socket.emit('account-disabled');
	});

	socket.on('sendMessage', async info => {
		let messageId = db.sendChat(info.token, info.convoid, info.message);

		if (messageId) {
			let name = db.getUserPart(info.token, 'username');
			io.sockets.in(info.roomid).emit('catch-message', {
				message: message,
				username: name,
				convoid: info.convoid,
				messageId: messageId,
			});
		}
	});

	// socket.on('join-room', async info => {
	// 	socket.join(info.roomid);
	// 	console.log('Joined room ' + info.roomid);

	// 	let infoa = await fetchSmartMessages(
	// 		'' + info.token,
	// 		'' + info.userid,
	// 		info.roomid,
	// 		30
	// 	).catch(console.log);
	// 	console.log('userid: ', infoa.userid);
	// 	socket.emit('refresh-messages', {
	// 		messages: infoa.convo,
	// 		people: infoa.people,
	// 		userid: infoa.userid
	// 	});
	// });

	socket.on('fetch-friends', async info => {
		let users = db.getUserPart(info.token, 'profile.friends');
		socket.emit('catch-friends', {
			friends: users
		});
	});

	// ///////////////////////////// CHANGE, damn that's ugly
	// socket.on('create-new-conversation', info => {
	// 	console.log(1);
	// 	reference
	// 	.orderByChild('token')
	// 	.equalTo(info.token)
	// 	.once('child_added', snapshot => {
	// 		console.log(1);
	// 		reference
	// 		.orderByChild('userid')
	// 		.equalTo(info.userid)
	// 		.once('child_added', friend_snapshot => {
	// 			console.log(1);
	// 			let convoid =
	// 					'' +
	// 					Math.round(10000000000000 + Math.random() * 10000000000000),
	// 				userRef = reference.child(snapshot.key),
	// 				friendRef = reference.child(friend_snapshot.key),
	// 				convos,
	// 				convo_started = false;

	// 			if (snapshot.val().convos) {
	// 				convos = Object.entries(snapshot.val().convos);
	// 			}
	// 			new Promise((res, rej) => {
	// 				let b = new Promise((resolve, reject) => {
	// 					let i = 0;
	// 					for (convo of convos) {
	// 						i++;
	// 						console.log('i : ' + i);
	// 						let convoid = convo[1].convoid;
	// 						chatreference
	// 							.orderByChild('convoid')
	// 							.equalTo(convoid)
	// 							.once('child_added', convoid_snapshot => {
	// 								switch (convoid_snapshot.val().participents[0]) {
	// 									case snapshot.val().userid:
	// 										if (convoid_snapshot.val().participents.length == 2) {
	// 											if (
	// 												convoid_snapshot.val().participents[0] ==
	// 												friend_snapshot.val().userid
	// 											) {
	// 												console.log('found' + convoid);
	// 												resolve([true, convoid, 'true']);
	// 											} else if (
	// 												convoid_snapshot.val().participents[1] ==
	// 												friend_snapshot.val().userid
	// 											) {
	// 												console.log('found' + convoid);
	// 												resolve([true, convoid, 'true']);
	// 											}
	// 										}
	// 										break;
	// 									case friend_snapshot.val().userid:
	// 										if (convoid_snapshot.val().participents.length == 2) {
	// 											if (
	// 												convoid_snapshot.val().participents[0] ==
	// 												snapshot.val().userid
	// 											) {
	// 												console.log('found');
	// 												resolve([true, convoid, 'true']);
	// 											} else if (
	// 												convoid_snapshot.val().participents[1] ==
	// 												snapshot.val().userid
	// 											) {
	// 												console.log('found');
	// 												resolve([true, convoid, 'true']);
	// 											}
	// 										}
	// 										break;
	// 								}
	// 							});
	// 					}

	// 					let id = setTimeout(() => {
	// 						clearTimeout(id);
	// 						reject('Timed out in ' + 1000 + 'ms.');
	// 					}, 1000);
	// 				}).then(async success => {
	// 					res(true);
	// 					console.log('\nSUCCESS // : // : ' + success);

	// 					console.log(success[2]);
	// 					if (success[0] == true) {
	// 						convo_started = true;
	// 					}
	// 					socket.join(success[1]);
	// 					socket.emit('joined-room', {
	// 						roomid: success[1],
	// 						userid: friend_snapshot.val().userid,
	// 						username: friend_snapshot.val().username
	// 					});

	// 					console.log(success[1], ': joined this :p');
	// 					let infoa = await fetchSmartMessages(
	// 						info.token,
	// 						info.userid,
	// 						success[1],
	// 						30
	// 					);
	// 					socket.emit('refresh-messages', {
	// 						messages: infoa.convo,
	// 						people: infoa.people,
	// 						userid: infoa.userid
	// 					});

	// 					let callback = await getUserInfo(info.token, 'chats');
	// 					socket.emit('convos', callback.friends);
	// 				});

	// 				b.catch(err => {
	// 					res(false);
	// 				});
	// 			}).then(async res => {
	// 				if (res) {
	// 					console.log('res was called' + res);
	// 				} else {
	// 					console.log('not convostart');
	// 					chatreference.push({
	// 						convoid: convoid,

	// 						participents: [
	// 							snapshot.val().userid,
	// 							friend_snapshot.val().userid
	// 						]
	// 					});

	// 					friendRef.child('convos').push({
	// 						convoid: convoid
	// 					});

	// 					userRef.child('convos').push({
	// 						convoid: convoid
	// 					});

	// 					let infoa = await fetchSmartMessages(
	// 						info.token,
	// 						info.userid,
	// 						convoid,
	// 						30
	// 					);
	// 					socket.emit('refresh-messages', {
	// 						messages: infoa.convo,
	// 						people: infoa.people,
	// 						userid: infoa.userid
	// 					});

	// 					let callback = await getUserInfo(info.token, 'chats');
	// 					socket.emit('convos', callback.friends);
	// 				}
	// 			});
	// 		});
	// 	});
	// });

	socket.on('retrieve-convos', async info => {
		socket.emit('convos', {
			convos: await db.getAllChats(info.token)
		});
	});

	// socket.on('isTyping', async info => {
	// 	if (info.typing == true) {
	// 		let val = (await reference
	// 			.orderByChild('token')
	// 			.equalTo(info.token)
	// 			.once('child_added')).val();
	// 		console.log(val.username + ' is typing..');

	// 		io.sockets.in(info.roomid).emit('userIsTyping', {
	// 			userid: val.userid,
	// 			username: val.username,
	// 			typing: true
	// 		});
	// 	} else if (info.typing == false) {
	// 		reference
	// 			.orderByChild('token')
	// 			.equalTo(info.token)
	// 			.once('child_added', snapshot => {
	// 				console.log(snapshot.val().username + ' has stopped typing..');

	// 				io.sockets.in(info.roomid).emit('userIsTyping', {
	// 					userid: snapshot.val().userid,
	// 					username: snapshot.val().username,
	// 					typing: false
	// 				});
	// 			});
	// 	}
	// });

	socket.on('deleteMessage', async info => {
		if (await db.deleteMessage(info.token, info.convoid, info.messageid)){
			socket.emit('delete-message', {
				convoid: info.convoid,
				messageid: info.messageid,
			});
		}
	});

	// socket.on('fetch-more-messages', async info => {
	// 	let infoa = await fetchSmartMessages(
	// 		info.token,
	// 		info.userid,
	// 		info.convoid,
	// 		info.amount
	// 	);
	// 	socket.emit('add-messages', {
	// 		messages: infoa.convo,
	// 		people: infoa.people,
	// 		userid: infoa.userid
	// 	});
	// });

	// socket.on('get-profile-photo', async info => {
	// 	if (info.type == 'user') {
	// 		let firstid = info.user.replace(/img-/, '');
	// 		let userid = firstid.replace(/user-/, '');
	// 		userid = userid.replace(/result-/, '');

	// 		let val = (await reference
	// 			.orderByChild('userid')
	// 			.equalTo(userid)
	// 			.once('child_added')).val();

	// 		if (val.profile_pic) {
	// 			socket.emit('catch-profile-pic', {
	// 				profile_pic:
	// 					val.profile_pic ||
	// 					'https://media.discordapp.net/attachments/651993623021355018/690969100519735326/unknown.png',
	// 				userElementID: info.user,
	// 				assignedTo: 'search-results'
	// 			});
	// 		}
	// 	} else if (info.type == 'client') {
	// 		let val = (await reference
	// 			.orderByChild('token')
	// 			.equalTo(info.token)
	// 			.once('child_added')).val();
	// 		if (val.profile_pic) {
	// 			socket.emit('catch-clients-profile-pic', {
	// 				profile_pic:
	// 					val.profile_pic ||
	// 					'https://media.discordapp.net/attachments/651993623021355018/690969100519735326/unknown.png',
	// 				userElementID: val.userid
	// 			});
	// 		}
	// 	}
	// });

	// socket.on('fetch-community', info => {
	// 	fetchCommunity(info.token, info.limit, info.filter, data => {
	// 		console.log(data);
	// 		socket.emit('catch-community', {
	// 			users: data
	// 		});
	// 	});
	// });

	// socket.on('fetchaccounts', async info => {
	// 	let data = Object.entries(
	// 		(await reference.limitToLast(parseInt(info.amount)).once('value')).val()
	// 	);

	// 	socket.emit('catch-account-names', {
	// 		accounts: data,
	// 		type: 'search-request'
	// 	});
	// });

	// socket.on('stage-accounts-for-deletion', async info => {
	// 	let userSnapshot = await reference
	// 		.orderByChild(info.token)
	// 		.once('child_added');
	// 	let snapshot = await reference
	// 		.limitToLast(parseInt(info.amount))
	// 		.once('value');

	// 	let data = Object.entries(snapshot.val()),
	// 		uniqueKey = Math.round(10000000000 + Math.random() * 100000000000);

	// 	securityRef.child('keys').push({
	// 		key: '' + uniqueKey,
	// 		user: userSnapshot.val().userid,
	// 		approved: false,
	// 		request: 'account-deletion',
	// 		amount: parseInt(info.amount)
	// 	});

	// 	socket.join(uniqueKey);

	// 	io.sockets.in(uniqueKey).emit('catch-account-names', {
	// 		accounts: data,
	// 		uniqueKey: uniqueKey,
	// 		type: 'deletion'
	// 	});
	// });

	// socket.on('approve', async info => {
	// 	console.log(info.key);
	// 	let userSnapshot = await reference
	// 		.orderByChild(info.token)
	// 		.once('child_added');

	// 	if (userSnapshot.val().userid == '64488765548') {
	// 		let snapshot = await securityRef
	// 			.child('keys')
	// 			.orderByChild('key')
	// 			.equalTo('' + info.key)
	// 			.once('child_added');
	// 		securityRef
	// 			.child('keys')
	// 			.child(snapshot.key)
	// 			.update({ approved: true });
	// 		let key = snapshot.val().key;
	// 		socket.join(key);
	// 		io.sockets.in(key).emit('key-approved', {
	// 			countdown: 10
	// 		});
	// 	} else {
	// 		socket.emit('access-denied');
	// 	}
	// });

	// socket.on('remove-accounts', async info => {
	// 	for (user of info.users) {
	// 		let userid = user[0];

	// 		let snapshot = await reference
	// 			.orderByChild('userid')
	// 			.equalTo('' + userid)
	// 			.once('child_added');
	// 		let val = snapshot.val();

	// 		if (val.following) {
	// 			console.log('SNAP1');
	// 			let userFollowing = Object.entries(val.following);

	// 			for (userFollowID of userFollowing) {
	// 				let followinguserID = userFollowID[1].userid;
	// 				console.log('SNAP2');

	// 				// following snapshot
	// 				let fs = await reference
	// 					.orderByChild('userid')
	// 					.equalTo('' + followinguserID)
	// 					.once('child_added');

	// 				// following nested snapshot
	// 				let fns = await reference
	// 					.child(fs.key + '/followers')
	// 					.orderByChild('userid')
	// 					.equalTo('' + userid)
	// 					.once('child_added');

	// 				console.log(fns.val() + 'SNAP4');
	// 				fns.ref.remove();
	// 			}
	// 		}

	// 		if (val.friends) {
	// 			let userFriends = Object.entries(snapshot.val().friends);

	// 			for (userFriendID of userFriends) {
	// 				let userFrienduserID = userFriendID[1].userid;

	// 				// following snapshot
	// 				let fs = await reference
	// 					.orderByChild('userid')
	// 					.equalTo('' + userFrienduserID)
	// 					.once('child_added');
	// 				// following nested snapshot
	// 				let fns = await reference
	// 					.child(fs.key + '/friends/')
	// 					.orderByChild('userid')
	// 					.equalTo('' + userid)
	// 					.once('child_added');

	// 				console.log(fns.val() + 'SNAP');
	// 				fns.ref.remove();
	// 			}
	// 		}

	// 		if (val.followers) {
	// 			let userFriends = Object.entries(snapshot.val().followers);

	// 			for (userFriendID of userFriends) {
	// 				let userFrienduserID = userFriendID[1].userid;
	// 				let fs = await reference
	// 					.orderByChild('userid')
	// 					.equalTo('' + userFrienduserID)
	// 					.once('child_added');
	// 				let fns = reference
	// 					.child(fs.key + '/following/')
	// 					.orderByChild('userid')
	// 					.equalTo('' + userid)
	// 					.once('child_added');

	// 				console.log(fns.val() + 'SNAP');
	// 				fns.ref.remove();
	// 			}
	// 		}

	// 		snapshot.ref.remove();
	// 	}
	// 	socket.emit('accounts-successfully-removed');
	// });
		// 		case 'social':
	// 			if (info.information.twitter) {
	// 				if (
	// 					info.information.twitter.match(
	// 						/http(?:s)?:\/\/(?:www\.)twitter\.com\/([a-zA-Z0-9_]+)/
	// 					)
	// 				) {
	// 					userRef
	// 						.child('settings/social')
	// 						.update({ twitter: info.information.twitter });
	// 				} else socket.emit('social-update-error', { site: 'twitter' });
	// 			} else if (info.information.twitter == '') {
	// 				userRef
	// 					.child('settings/social')
	// 					.update({ twitter: info.information.twitter });
	// 			}

	// 			if (info.information.youtube) {
	// 				if (
	// 					info.information.youtube.match(
	// 						/http(?:s)?:\/\/(?:www\.)youtube\.com\/([a-zA-Z0-9_]+)/
	// 					)
	// 				) {
	// 					userRef
	// 						.child('settings/social')
	// 						.update({ youtube: info.information.youtube });
	// 				} else socket.emit('social-update-error', { site: 'youtube' });
	// 			} else if (info.information.youtube == '') {
	// 				userRef
	// 					.child('settings/social')
	// 					.update({ youtube: info.information.youtube });
	// 			}

	// 			if (info.information.facebook) {
	// 				if (
	// 					info.information.facebook.match(
	// 						/http(?:s)?:\/\/(?:www\.)facebook\.com\/([a-zA-Z0-9_]+)/
	// 					)
	// 				) {
	// 					userRef
	// 						.child('settings/social')
	// 						.update({ facebook: info.information.facebook });
	// 				} else socket.emit('social-update-error', { site: 'facebook' });
	// 			} else if (info.information.facebook == '') {
	// 				userRef
	// 					.child('settings/social')
	// 					.update({ facebook: info.information.facebook });
	// 			}

	// 			if (info.information.insta) {
	// 				if (
	// 					info.information.insta.match(
	// 						/http(?:s)?:\/\/(?:www\.)instagram\.com\/([a-zA-Z0-9_]+)/
	// 					)
	// 				) {
	// 					userRef
	// 						.child('settings/social')
	// 						.update({ insta: info.information.insta });
	// 				} else socket.emit('social-update-error', { site: 'instagram' });
	// 			} else if (info.information.insta == '') {
	// 				userRef
	// 					.child('settings/social')
	// 					.update({ insta: info.information.insta });
	// 			}

	// 		case 'change-name':
	// 			if (info.password == val.password) {
	// 				if (val.followers) {
	// 					let followers = Object.values(val.followers);

	// 					for (follower of followers) {
	// 						let followerRef = follower;

	// 						let follower_snapshot = await reference
	// 							.orderByChild('userid')
	// 							.equalTo(followerRef.userid)
	// 							.once('child_added').catch(console.log);

	// 						let followerUserRef = reference.child(follower_snapshot.key);

	// 						let userInFollowerSnapshot = await followerUserRef
	// 							.child('following')
	// 							.orderByChild('userid')
	// 							.equalTo(val.userid)
	// 							.once('child_added').catch(console.log);

	// 						followerUserRef
	// 							.child('following' + '/' + userInFollowerSnapshot.key)
	// 							.update({ username: info.name });
	// 					}
	// 				}

	// 				if (val.following) {
	// 					let following = Object.values(val.following);

	// 					for (user of following) {
	// 						let followingRef = user;

	// 						let following_snapshot = await reference
	// 							.orderByChild('userid')
	// 							.equalTo(followingRef.userid)
	// 							.once('child_added').catch(console.log);

	// 						let followerUserRef = reference.child(following_snapshot.key);

	// 						let userInFollowingSnapshot = await followerUserRef
	// 							.child('followers')
	// 							.orderByChild('userid')
	// 							.equalTo(val.userid)
	// 							.once('child_added').catch(console.log);

	// 						followerUserRef
	// 							.child('followers' + '/' + userInFollowingSnapshot.key)
	// 							.update({ username: info.name });
	// 					}
	// 				}

	// 				if (val.friends) {
	// 					let friends = Object.values(val.friends);

	// 					for (friend of friends) {
	// 						let friendRef = friend;
	// 						let friend_snapshot = await reference
	// 							.orderByChild('userid')
	// 							.equalTo(friendRef.userid)
	// 							.once('child_added').catch(console.log);

	// 						let friendUserRef = reference.child(friend_snapshot.key);

	// 						let userInFriendsSnapshot = await friendUserRef
	// 							.child('friends')
	// 							.orderByChild('userid')
	// 							.equalTo(val.userid)
	// 							.once('child_added').catch(console.log);

	// 						friendUserRef
	// 							.child('friends' + '/' + userInFriendsSnapshot.key)
	// 							.update({ username: info.name });
	// 					}
	// 				}

	// 				userRef.update({ username: info.name });
	// 				socket.emit('input-success', {
	// 					type: 'name'
	// 				});
	// 			} else {
	// 				socket.emit('input-error', {
	// 					type: 'name',
	// 					error: 'password'
	// 				});
	// 			}
	// 			break;
});
}

async function follow(token, userid) {
	let user = await getUserBy('token', token);
	if (!user) return false;

	let friend = await db.getUserById(userid);
	if (!friend) return false;

	if (friend.profile.followers.indexOf(user.id) != -1) return;
	db.addToUserArray(friendId, 'profile.followers', user.id, true);
	db.addToUserArray(friendId, 'notifications', `follower ${user.id}`, true);
	return true
}

async function addfriend(token, friendId, type) {

	let user = await getUserBy('token', token);
	if (!user) return false;

	let friend = await db.getUserById(friendId);
	if (!friend) return false;

	if (type == 'add_friend'){
		if (user.profile.friends.indexOf(friendId) != -1) return;
		if (friend.profile.friends.indexOf(user.id) != -1) return;
		db.addToUserArray(friendId, 'profile.requests', user.id, true);
		db.addToUserArray(friendId, 'notifications', `friend_request ${user.id}`, true);
	}
	else if (type == 'accept_request'){
		if (user.profile.requests.indexOf(friendId) == -1) return;
		db.removeFromUserArray(token, 'profile.requests', user.id);
		db.addToUserArray(token, 'profile.friends', friendId);
		db.addToUserArray(friendId, 'profile.friends', user.id, true);
		db.addToUserArray(friendId, 'notifications', `accepted_friend_request ${user.id}`, true);
	}
	else if (type == 'unfriend'){
		db.removeFromUserArray(token, 'profile.friends', friendId);
		db.removeFromUserArray(friendId, 'profile.friends', user.id);
		db.addToUserArray(friendId, 'notifications', `unfriended ${user.id}`, true);
	}
	else if (type == 'reject_request'){
		if (user.profile.requests.indexOf(friendId) == -1) return;
		db.removeFromUserArray(token, 'profile.requests', user.id);
		db.addToUserArray(friendId, 'notifications', `rejected_friend_request ${user.id}`, true);
	}
	return true;
}
