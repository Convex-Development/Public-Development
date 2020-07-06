		let token = randID();
		reference.push({
			username: data.username,
			password: data.password,
			profile_pic:
				'https://media.discordapp.net/attachments/651993623021355018/690969100519735326/unknown.png',
			userid: `${Math.round(10000000000 + Math.random() * 100000000000)}`,
			notifications: {
				none: 'none'
			},
			email: data.email,
			token: token,
			rank: ['user'],
			verified: false,
			settings: {
				TFA: false,
				external_notifications: false,
				newsletter_notifications: false,
				posts: false,
				chats: false,
				updates: false,
				posts_privacy: 'Friends Only',
				messaging_privacy: 'Friends Only',
				bio: 'I love Chattr!',
				social: {
					insta: '',
					facebook: '',
					twitter: '',
					youtube: ''
				}
			}
		})



async function getProfilePic(userid) {
	let snapshot = await reference
		.orderByChild('userid')
		.equalTo('' + userid)
		.once('child_added');

	return 1;
}


async function sendSmartMessage(token, convoid, message) {
	let senderId;

	let snapshot = await reference
		.orderByChild('token')
		.equalTo(token)
		.once('child_added');
	console.log('first promise success');
	console.log(1);
	console.log('friend id : ' + friendid);
	let userRef = reference.child(snapshot.key);

	let convosnapshot = await userRef
		.child('friends')
		.orderByChild('userid')
		.equalTo(friendid)
		.once('child_added');

	let friendIDsnap = await reference
		.orderByChild('userid')
		.equalTo(convosnapshot.val().userid)
		.once('child_added');

	let convoidsnapshot = await reference
		.child(friendIDsnap.key)
		.child('convos')
		.orderByChild('convoid')
		.equalTo(convoid)
		.once('child_added');

	reference.child(friendIDsnap.key + '/convos/' + convoidsnapshot.key).remove();
	reference
		.child(friendIDsnap.key + '/convos/')
		.push({ convoid: convoid, unread: true });

	senderId = snapshot.val().userid;

	convoidsnapshot = await userRef
		.child('convos')
		.orderByChild('convoid')
		.equalTo(convoid)
		.once('child_added');
	userRef.child('convos/' + convoidsnapshot.key).remove();
	userRef.child('convos').push({ convoid: convoid });

	snapshot = await chatreference
		.orderByChild('convoid')
		.equalTo(convoid)
		.once('child_added');
	let pushedMssg = chatreference.child(snapshot.key + '/messages').push({
		from: senderId,
		message: message
	});

	console.log('successfully sent mssg - ', pushedMssg.key);
	console.log('CHAT SENT');
	return [true, pushedMssg.key];
}

async function fetchSmartMessages(token, friendid, convoid, amount) {
	console.log('called');
	console.log('attempting first promise');
	let successMessage;

	let snapshot = await reference
		.orderByChild('token')
		.equalTo(token)
		.once('child_added');
	let userRef = reference.child(snapshot.key);
	//userRef.child('convos/' + (await userRef.child('convos').orderByChild("convoid").equalTo(convoid).once("child_added").key)).update({unread : false});
	let convosnapshot = await userRef
		.child('friends')
		.orderByChild('userid')
		.equalTo(friendid)
		.once('child_added');
	successMessage = { convoid: convoid, userid: snapshot.val().userid };

	snapshot = await chatreference
		.orderByChild('convoid')
		.equalTo(successMessage.convoid)
		.once('child_added');

	let val = snapshot.val();

	if (val.messages) {
		let convoToArray = Object.entries(val.messages);

		if (convoToArray.length < amount) {
			console.log(amount);
			amount = convoToArray.lengthl;
			console.log('AMOUNT: ', amount);
		}

		let newConvo = convoToArray.slice(
				convoToArray.length - amount,
				convoToArray.length
			),
			participentsToArray = Object.entries(val.participents);
		let usernames = [];

		let successMessageA = null;

		for (user of participentsToArray) {
			let sval = await reference
				.orderByChild('userid')
				.equalTo(user[1])
				.once('child_added')
				.val();

			usernames.push({
				username: sval.username,
				userid: sval.userid
			});
		}

		if (usernames.length == participentsToArray.length) {
			return {
				people: successMessageA,
				convo: newConvo,
				userid: successMessage.userid
			};
		} else return { people: '', convo: '', userid: '' };
	}
}

async function fetchFriends(token) {
	var snapshot = await reference
		.orderByChild('token')
		.equalTo(token)
		.once('child_added');
	if (snapshot.val().friends) {
		let friendRef = Object.values(snapshot.val().friends);
		let arr = [];

		for (friend of friendRef) {
			if (friend.type != 'pending' && friend.type != 'pending-friend-request') {
				arr.push([friend.username, friend.userid]);
			}
		}
		return arr;
	}
	return '';
}