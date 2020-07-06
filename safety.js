const crypto = require("crypto-js");
function encrypt(str){
	return crypto.AES.encrypt(str, process.env.AES_KEY).toString();
}
function decrypt(str){
	return crypto.AES.decrypt(str, process.env.AES_KEY).toString(crypto.enc.Utf8);
}
function makeId(){
	return `${Math.floor(Math.random()*1e16)}`;
}
module.exports = {
	encrypt,
	decrypt,
	crypto,
	makeId
};