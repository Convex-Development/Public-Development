"use strict"
const admin = require('firebase-admin');
const fbfs = require('firebase/firestore');
const FireSQL = require('firesql').FireSQL;
const Safety = require('./safety');
const env = process.env;

const json = {
	type: "service_account",
	project_id: "chattr-userbase",
	private_key_id: env.private_key_id,
	private_key: env.private_key,
	client_email: env.client_email,
	client_id: env.client_id,
	auth_uri: env.auth_uri,
	token_uri: env.token_uri,
	auth_provider_x509_cert_url: env.auth_provider_cert_url,
	client_x509_cert_url: env.client_cert_url,
};

admin.initializeApp({
  credential: admin.credential.cert(json),
  databaseURL: 'https://chattr-userbase.firebaseio.com'
});

var db = admin.firestore();
var users = db.collection('users');
var chats = db.collection('chats');

const dbSQL = new FireSQL(db);
const userSQL = new FireSQL(users);


/**
 * Necessary DB Functions
 * 
 * Accessing the different parts of the db
 * 	- users (Profile pics, usernames, passwords, bio,)
 * 	- dms / chats
 * 	- posts?
 * 	- I saw game dev stuff on the dynalist? so I'll put that here too
 * 
 * get references to parts of the db (to set and add things without getting the values)
 * 
 * Setting values in the db
 * 
 * Adding new things to the db
 */

/////////// USERS ///////////
function newUserObject(){
	return {
		chats: [],
		email: "",
		id: "",
		notifications: [],
		password: "",
		profile: {
			bio: "I love chattr!",
			followers: [],
			friends: [],
			following: [],
			picture: "",
			ranks: [],
			requests: [],
			social: []
		},
		settings: {
			externalNotifications: true,
			messagingPrivacy: "",
			mode: 'light',
			newsletter: false,
			postsPrivacy: "",
			tfa: false,
			updates: true			
		},
		token: "",
		username: ""
	};
}

// for all of these functions you must still call doc.data()
async function getUserById(id, ref){
	if (ref) return users.doc(id);
	return (await users.doc(id).get().catch(console.log)).data();
}

// returns the doc, not the data
async function getUserBy(part, value, ref){
	if (ref) return users.where(part, '==', value);
	let snapshot = await users.where(part, '==', value).get().catch(console.log);
	if (snapshot.empty) return null;
	return snapshot.docs[0].data();
}

async function getUsersBy(part, value, substring){
	let query;
	if (substring){
		let query = users.where(part, '>=', value).where(part, '<=', value + 'z');
	}
	else query = users.where(part, '==', value);
	let snapshot = await query.get();
	if (snapshot.empty) return null;
	return snapshot.docs;
}

async function getUserPart(token, value, part){
	if (!part){ part = value; value = token; token = "token"; }
	let res = await users.where(token, '==', value).select(part).get();
	if (res.empty) return null;
	let p = res.docs[0].data();
	return eval('p.' + part);
}

async function getUserPartById(id, part){
	let res = await users.where(admin.FieldPath.documentId(), '==', value).select(part).get();
	if (res.empty) return null;
	let p = res.docs[0].data();
	return eval('p.' + part);
}

async function getUserParts(token, value, parts){
	// options: (token value, parts) or (sortby, value of sortby, parts)
	if (!parts){ parts = value; value = token; token = "token"; }

	let res = await users.where(token, '==', value).select(...parts).get();
	if (res.empty) return null;
	return res.docs[0].data();
}

async function getUserPartsById(id, parts){
	if (!parts){ parts = value; value = token; token = "token"; }

	let res = await users.where(admin.FieldPath.documentId(), '==', id).select(...parts).get();
	if (res.empty) return null;
	return res.docs[0].data();
}

// I'm trying out the function below this one
async function setUserToken(username, token){
	let doc = await getUserBy('username', username);
	console.log(username, doc);
	await users.doc(doc.id).update({token: token});
	return true;
}

async function swapUserToken(oldToken, newToken){
	let docs = [];
	(await users.where('token', '==', oldToken).get()).forEach(d => docs.push);
	if(docs.length == 0) return false;
	docs[0].set({
		token: newToken
	}, {merge: true});

	return true
}

async function setNewUser(username, password, email){
	let user = await getUserBy('email', email).catch(console.log);
	if (user) return false;
	let id = Safety.makeId();
	let newuser = newUserObject();
	newuser.username = username;
	newuser.password = password;
	newuser.email = email;
	newuser.id = id;
	await users.doc(id).set(newuser).catch(console.log);
	return true;
}

async function getAllChats(token){
	let chats = await getUserPart(token, "chats").catch(console.log);
	let result = await chats.where(admin.FieldPath.documentId(), 'in', chats).select('name', 'members');
	for (let i in result){
		for (let m = 0; m < result[i].members.length; m++){
			result[i].members[m] = await getUserPartById(result[i].members[m], 'username');
		}
	}

	return result;
}

// formats as an object: {name: members, name: members, ...}
async function getChatData(token, value){
	let chats = [];
	if (value) chats = await getUserPart(token, value, 'chats').catch(console.log);
	else chats = await getUserPart(token, "chats").catch(console.log);
	chatData = {};

	for (let i of chats){
		members = [];
		for (let m of i.members) members.push(await getUserPart(m, 'username').catch(console.log));
		if (i.name) chatData[i.name] = members.join(", ");
		else chatData[members.join(", ")] = "";
	}

	return chatData;
}

function addToUserArray(token, array, addition, useId){
	let doc;
	if (!useId) doc = getUserBy('token', token, true);
	else doc = getUserById(token);
	update = {};
	update[array] = admin.firestore.FieldValue.arrayUnion(addition);
	doc.update(update);
}

function removeFromUserArray(token, array, remove, useId){
	let doc;
	if (!useId) doc = getUserBy('token', token, true);
	else doc = getUserById(token);
	update = {};
	update[array] = admin.firestore.FieldValue.arrayRemove(remove);
	doc.update(update);
}

function replaceUserArray(token, array, newArray, useId){
	let doc;
	if (!useId) doc = getUserBy('token', token, true);
	else doc = getUserById(token);
	update = {};
	update[array] = newArray;
	doc.set(update, {merge: true});
}

async function changeUserData(token, parts, values, useId){
	let obj = {};
	for (let i = 0; i < parts.length; i++){
		obj[parts[i]] = values[i];
	}

	if (useId) return await users.doc(token).update(obj);
	
	let id = await getUserPart(token, 'id');
	return await users.doc(id).update(obj);
}

async function searchUsers(str){
	let users = await dbSQL.query(`
		SELECT username
		FROM users
		WHERE username LIKE '${str}%'
	`);
	console.log('users', users);

}

/////////// CHATS ///////////
async function chatExists(chatId){
	let data = await chats.where(admin.firestore.FieldPath.documentId(), '==', chatId).select().get();
	return data.docs.length > 0;
}

async function userHasChat(token, chatId){
	let messages = await getUserPart(token, 'chats');
	return messages.indexOf(chatId) >= 0;
}

async function makeNewChat(){
	let ref = await chats.add({members: [], name: ""});
	return ref.id;
}

async function addChatMember(chatId, member){
	await chats.doc(chatId).update({
		members: firebase.firestore.FieldValue.arrayUnion(member)
	});
	return true;
}

async function removeChatMember(chatId, member){
	await chats.doc(chatId).update({
		members: firebase.firestore.FieldValue.arrayRemove(member)
	});
	return true;
}

async function sendChat(token, chatId, message){
	if (await userHasChat(token, chatId)){
		let id = await getUserPart(token, 'id');
		let ref = chats.doc(chatId).collection('messages').add({
			message: message,
			id: id,
			time: Date.now(),
			reactions: []
		});
		return ref.id;
	}
	return false;
}

async function addReactionToMessage(token, chatId, messageId, reaction){
	if (await userHasChat(token, chatId)){
		await chats.doc(chatId).collection('messages').doc(messageId).update({
			reactions: admin.firestore.FieldValue.arrayUnion(reaction)
		});
		return true;
	}
	return false;
}

async function editMessage(token, chatId, messageId, edit){
	if (await userHasChat(token, chatId)){
		await chats.doc(chatId).collection('messages').doc(messageId).update({
			message: edit
		});
		return true;
	}
	return false;
}

async function deleteMessage(token, chatId, messageId){
	if (await userHasChat(token, chatId)){
		await chats.doc(chatId).collection('messages').doc(messageId).delete();
		return true;
	}
	return false;
}

async function getChats(token, chatId, start, num){
	if (!start) start = 0;
	if (!num) num = 10;
	if (await userHasChat(token, chatId)){
		let snapshot = await chats.doc(chatId).collection('messages').orderBy('time', 'desc').startAt(start).limit(num).get();
		messages = [];
		snapshot.docs.forEach(d => { messages.push(d.data()); });
		return messages;
	}
	return false;
}

module.exports = {
	admin, 
	db,
	getUserById,
	getUserBy,
	getUserPart,
	getUserPartById,
	getChatData,
	getAllChats,
	getUserParts,
	getUserPartsById,
	getUsersBy,
	setNewUser,
	setUserToken,
	swapUserToken,
	addToUserArray,
	replaceUserArray,
	removeFromUserArray,
	changeUserData,
	searchUsers,

	chatExists,
	userHasChat,
	makeNewChat,
	addChatMember,
	removeChatMember,
	sendChat,
	addReactionToMessage,
	editMessage,
	deleteMessage,
	getChats
};