// Server

const express = require('express'),
	app = express(), 
	cookieParser = require("cookie-parser"),

	// Dependencies
	{ URLSearchParams } = require('url'),
	fetch = require('node-fetch'),

	// General
	env = process.env,
	path = require('path'),
	fs = require('fs'),
  db = require('./db'),
	mailer = require('./mailer'),
	safety = require('./safety');

const catchPromise = require('@adcharity/catch-promise').init()

app.engine('html', require('ejs').renderFile)
   .set('views', path.join(__dirname, '/public'))
   .set('view engine', 'html');

app	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(express.static(path.join(__dirname, 'public')))
	.use(cookieParser());

app.use((req, res, next) => {
	if (req.headers['x-forwarded-proto'] === 'http')
		res.redirect(`https://${req.headers.host}${req.url}`);
	else next();
	
});

db.chatExists('example')
// db.userHasChat('viojld1asjpga79fy31c50eimc0h3uvkn69vp1rewsi', 'sample');

//socket io
const socket = require('socket.io'),
	io = socket(app.listen(3000));

async function passUserToEjs(req, res, page){
	if (get_cookies(req)['session']) {
		let token = get_cookies(req)['session'];
		let user = await db.getUserBy('token', token);
		console.log('USER', user);
		if (!user) res.render(page, db.newUserObject());
		res.render(page, user);
	}
	else res.render(page, db.newUserObject());
	// else res.redirect('/');
}


// recieve objects, combine them
app.get('/', async (req, res) => {
	// if (get_cookies(req)['session']) {
	// 	let token = get_cookies(req)['session'];
	// 	let user = await db.getUserBy('token', token).catch(console.log);
	// 	if (user){
	// 		let newToken = randID();
	// 		res.cookie("session", newToken, {
	// 			httpOnly: true, 
	// 			overwrite: true
	// 		});
	// 		db.swapUserToken(token, newToken);
	// 		user.token = newToken;
	// 		res.render('pages/home', user);
	// 	}
	// 	else res.render('pages/index', { theme: 'light' });
	// }
	// else res.render('pages/index', { theme: 'light' });
	res.render('pages/index', { theme: 'light' });
});

app.get('/home', (req, res) => { 
   passUserToEjs(req, res, 'pages/home'); 
  });

app.get('/profile', (req, res) => { passUserToEjs(req, res, 'pages/profile'); }); 

app.get('/community', (req, res) => { passUserToEjs(req, res, 'pages/community'); }); 

app.get('/login', (req, res) => { passUserToEjs(req, res, 'pages/login'); });

app.get('/music', (req, res) => { passUserToEjs(req, res, 'pages/music'); });

app.get('/content', (req, res) => { passUserToEjs(req, res, 'pages/content'); });

app.get('/settings', (req, res) => { passUserToEjs(req, res, 'pages/settings'); });

app.get('/chat', (req, res) => { passUserToEjs(req, res, 'pages/chat'); });

app.get('/about', (req, res) => { passUserToEjs(req, res, 'pages/about'); });
app.get('/admin', (req, res) => { passUserToEjs(req, res, 'pages/admin'); });
app.get('/email/*', async (req, res) => {
	try{
		let parts = safety.decrypt(req.path.split('/').slice(2).join('/')).split('⇝');

		let success = await db.setNewUser(...parts).catch(console.log);

		if (success){
			res.render('pages/email', {
				message: "You're account has been created!",
			});
		}
		else res.render('pages/email', { message: "User already exists :(" });
	}
	catch(err){ res.render('pages/email', { message: "Invalid link :(" }); }

});

// change callback
app.get('/tutorial', async (req, res) => {
	if (get_cookies(req)['session']) {
		let token = get_cookies(req)['session'];
		let parts = await db.getUserParts(token, ['username', 'settings']).catch(error => console.log(error));
		if (parts){
			parts.mode = parts.settings.mode;
			res.render('tutorial', parts);
		}
		else res.redirect('/');
	}
	else res.redirect('/');
});

app.get('/policy', (req, res) => {
	let dt = get_cookies(req)['dt']; //dark theme
	res.render('pages/policy', { darkTheme: getDarkTheme() });
});

app.get('/pricing', (req, res) => {
	let dt = get_cookies(req)['dt'] || getDarkTheme(); //dark theme
	res.render('pages/pricing', { darkTheme: dt });
});

app.post('/login', async (req, res) => {
	data = req.body;
	if(!data) return res.redirect('/login#Invalid-details');

	if (data.type == 'signup'){
		if(!data.username || !data.email || !data.password) return res.redirect('/login#Invalid-registration-details');

		if (await db.getUserBy('email', data.email).catch(console.log) || await db.getUserBy('username', data.username).catch(console.log)){
			return res.redirect('/login#User-exists');
		}

		let link = 'https://Public-Development.convex.repl.co/email/'
		link += safety.encrypt(data.username + '⇝' + data.password + '⇝' + data.email);
		
		try { await mailer.verification(data.email, link); }
		catch(e) { return res.redirect({error: '/login#Email-error'}); }

		return res.redirect('/login#Email-sent');
	}

	else if (data.type == 'login'){
		let password = await db.getUserPart('username', data.username, 'password').catch(console.log);
		if (!password) {
			password = await db.getUserPart('email', data.username, 'password').catch(console.log);
		}
		
		if (data.password == password) {
			let token = randID();
			await db.setUserToken(data.username, token).catch(console.log);
			res.cookie("session", token, {
				httpOnly: true, 
				overwrite: true
			});
			res.redirect('/home');	
		}
		else{
			res.redirect('/login#Invalid-login-details');
		}
	}
});

//other functions
function get_cookies(req) {
	return req.cookies;
}

//for token id
function randID() {
	let total = ''
	let count = 4
	for(let i = 0; i < count; i++) {
		total += Math.random().toString(36).substr(2)
	}
	return total
}

function search(val, arr) {
	let usernames = []

	for (i of arr) {
		if (i[1].username.toLowerCase().match(val.toLowerCase())) {
			usernames.push([i[1].username, i[1].userid])
		}
	}

	return usernames
}

/* Following Functionality */
const multer = require('multer'),
	crypto = require('crypto'),
	{ Storage } = require('@google-cloud/storage');

let upload = multer({
	storage: multer.diskStorage({
		destination: './public/uploads/',
		filename: (req, file, cb) => {
			crypto.pseudoRandomBytes(16, (err, raw) => {
				if (err) return cb(err);

				cb(null, raw.toString('hex') + path.extname(file.originalname));
			});
		}
	})
});

const uploadFile = file => {
	bucket.upload(file, {
		gzip: true,
		metadata: {
			cacheControl: 'public, max-age=31536000'
		}
	});
};

app.post('/captcha', (req, res) => {
	if (!req.body) {
		res.send({
			error: 'No Captcha Token sent.'
		});
		return;
	}
	let token = req.body.token;
	let params = new URLSearchParams();
	params.append('secret', '6Lc0lOgUAAAAAGwwMvfQIlP7J4lrymgxy6vU0LYw');
	params.append('response', token);
	fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		body: params
	})
		.then(res => res.json())
		.then(json => {
			console.log('Gtoken went through.');
			if (json.hasOwnProperty('error')) {
				res.send({
					error: 'Not Verified.'
				});
				return;
			}
			res.send({
				success: 'Captcha complete!'
			});
		});
});

app.post('/upload', upload.single('file'), async (req, res) => {
	let file = req.file;
	if (!file) res.send({ error: 'No file attached.' });
	else {
		uploadFile(`./public/uploads/${req.file.filename}`);

		bucket
			.file(req.file.filename)
			.getSignedUrl({
				action: 'read',
				expires: '03-09-2491'
			})
			.then(async urls => {
				console.log(urls[0]);
				res.send({
					success: urls[0]
				});

				let snapshot = await reference
					.orderByChild('token')
					.equalTo('' + get_cookies(req)['session'])
					.once('child_added');
				reference.child(snapshot.key).update({ profile_pic: urls[0] });

				console.log('token: ', get_cookies(req)['session']);
				return urls[0];

				//url -> save this
			});
		// .then((url) => {
		// 	fs.unlinkSync(`./public/uploads/${req.file.filename}`)
		// })
	}
});

function notificationToHTML(type, username, userid, date, time) {
	switch (type) {
		case 'follower':
			return `
        <a id="notification" href="/profile/${userid}">
        
          <div id="user-picture"></div>
          <div id="user-info-container">
            <p>${username} has followed you!</p>
            <p id="date">${date} at ${time}</p>
          </div>
        </a>
      `;
			break;
		case 'friend_request':
			return `
        <a class="notification" id="/profile/${userid}">
        
        <div id="user-picture"></div>
        <div id="user-info-container">
          <p>${username} sent a friend request!</p>
          <div id="options-container">
            <p id="date">${date} at ${time}</p>
            <div class="option-buttons-container">
              <div class="option-button" id="reject-button" onclick="reject_friend('${userid}')">Decline</div>
              <div class="option-button" id="accept-button" onclick="add_friend('${userid}')">Accept</div>
            </div>
          </div>
        </div>
      </a>
      `;
			break;
		case 'friend_request_accepted':
			return `
        <a id="notification" href="/profile/${userid}">
        
          <div id="user-picture"></div>
          <div id="user-info-container">
            <p>${username} accepted your friend request!</p>
            <p id="date">${date} at ${time}</p>
          </div>
        </a>
      `;
			break;
	}
}

function getDarkTheme(dt) {
	return dt == 'true' ? 'dark' : '';
}
// fetchCommunity('6l9p9p87ccs5751y3z5puhedtufpps5gwcq95a7j1go', 5, "friends");