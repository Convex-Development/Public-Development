var infoArr = {
	people: [],
	friends: [],
	results: [],
	previousSender: ``,
	convoCount: 0,
	messageLoad: 30
};

function err(data) {
	return false;
}

var useridentitynumb = '';
var userID = '';
var convoidvar = '';
var convoimg = '';
var isTyping = false;
var waitTime = 3;
var intervalSet = false;
var messageSelected = false;
var messageChoosen = ``;
var previousConvoHeight = 0;
var officialConvo = ``;

/* file uploading */
let promptFile = document.getElementById('prompt-file');
promptFile.addEventListener('change', function() {
	if (!promptFile.files || !promptFile.files[0]) return alert('d');
	let file = promptFile.files[0];
	// let fileExtension = file.name.toString().split('.').pop();
	let formData = new FormData();
	formData.append('upload', file);
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/prompt-file', true);
	xhr.setRequestHeader('Content-Type', 'multipart/form-data');
	xhr.onload = () => {
		alert(xhr.responseText);
	};
	xhr.onerror = () => {
		alert('oof');
	};
	//not working, idk how to access formData
	xhr.send(formData);
	// if (!/image.*/.test(file.type)) return;
});

/* functions */

function openConvo(username, userid, convoid, imgsrc) {
	useridentitynumb = userid;
	convoidvar = convoid;
	convoimg = imgsrc;
	infoArr.previousSender = ``;

	socket.emit('join-room', {
		token: getCookie('session'),
		userid: userid,
		roomid: convoidvar
	});

	$('#content-header').html(`
    <a id="header-title-container" href='/profile/${userid}'>
      <div id="header-user-picture"><img src='${imgsrc}'></div>
      <h2 id="username">${username}</h2>
    </a>
    <div id="divider"></div>
  `);
}

$(document).keypress(function() {
	var keycode = event.keyCode ? event.keyCode : event.which;
	let text = $('#message-container').html();
	waitTime = 3;

	if (
		event.target.id != 'search-bar' &&
		event.target.id != 'search-container'
	) {
		if (isTyping == false) {
			isTyping = true;

			socket.emit('isTyping', {
				typing: isTyping,
				token: getCookie('session'),
				userid: useridentitynumb,
				roomid: convoidvar
			});
		}

		setTimeoutForTyping();
		$('#message-container').focus();
		if (keycode == '13') {
			if (event.shiftKey) {
			} else if ($('#message-container').html() != '' && text.length <= 1050) {
				socket.emit('sendMessage', {
					token: getCookie('session'),
					convoid: convoidvar,
					userid: useridentitynumb,
					message: checkMessage(text),
					roomid: convoidvar
				});

				document.execCommand('insertHTML', false, '<br><br>');
				document.getElementById('message-container').innerHTML = '';
				$('#message-container').empty();
				return false;
			} else if ($('#message-container').html() == '') {
				document.execCommand('insertHTML', false, '<br><br>');
				document.getElementById('message-container').innerHTML = '';
				return false;
			}
		}
	}
});

socket.on('refresh-messages', function(data) {
	let convo = ``;
	infoArr.previousSender = ``;
	let idList = [];
	for (message of data.messages) {
		for (person of data.people) {
			if (person.userid == message[1].from) {
				let messageid = Math.round(
					10000000000000 + Math.random() * 10000000000000
				);
				if (infoArr.previousSender != person.username) {
					infoArr.previousSender = person.username;
					if (message[1].from == data.userid) {
						convo =
							convo +
							`
              <div id="${message[0]}" class="client-message">
                <div class="message-info">
                  <div class="content">${message[1].message}</div>
                </div>
              </div>
            `;
						idList.push([message[0], true]);
					} else {
						convo =
							convo +
							`
              <div id="${message[0]}" class="message">
                <div class="user-photo">
                  <img src="${convoimg}">
                </div>
                <div class="message-info">
                  <div class="content">${message[1].message}</div>
                </div>
              </div>
            `;
					}
				} else {
					if (message[1].from == data.userid) {
						convo += `
              <div id="${message[0]}" class="client-message">
                <div class="client-lone-message-info">
                  <div class="content">${message[1].message}</div>
                </div>
              </div>
            `;
						idList.push([message[0], true]);
					} else {
						convo += `
              <div id="${message[0]}" class="message">
                <div class="lone-message-info">
                  <div class="content">${message[1].message}</div>
                </div>
              </div>
            `;
					}
				}
			}
		}
	}

	socket.emit('retrieve-convos', {
		token: getCookie('session')
	});

	$('#convo-area').empty();
	$('#convo-area').append(convo);
	$('#convo-area').scrollTop($('#convo-area').prop('scrollHeight'));
	$('#user-typing').html(`  `);

	waitTime = 0;

	for (id of idList) {
		if (id[1]) {
			document.getElementById(id[0]).addEventListener('mouseenter', function() {
				if (!$('#' + event.target.id).find('img').length) {
					if (!messageClicked && !messageSelected) {
						$('#' + event.target.id).prepend(`
              <img id="${
								event.target.id
							}img" src="https://media.discordapp.net/attachments/683796094739546117/686010517680291903/unknown.png" class="message-extra-options"/>
            `);

						document
							.getElementById(event.target.id + 'img')
							.addEventListener('click', function() {
								if (!messageSelected) {
									$('main').append(`
                  <div class="messages-extra-options-area">
                    <div id="delete" class="option">Delete</div>
                  </div>
                `);

									$('.messages-extra-options-area').css(
										'top',
										$('#' + this.id).offset().top - '20'
									);
									$('.messages-extra-options-area').css(
										'left',
										$('#' + this.id).offset().left - '100'
									);
									$('.messages-extra-options-area').css('min-height', 'unset');

									messageSelected = true;
									messageChoosen = '' + this.id;
									messageChoosen = messageChoosen.replace('img', '');

									document
										.getElementById('delete')
										.addEventListener('click', function() {
											socket.emit('deleteMessage', {
												message: messageChoosen,
												userid: useridentitynumb,
												token: getCookie('session'),
												convoid: convoidvar
											});
										});
								}
							});
					}
				}
			});

			document.getElementById(id[0]).addEventListener('mouseleave', function() {
				if (!messageSelected) $('#' + event.target.id + ' img').remove();
			});
		} else {
			document.getElementById(id[0]).addEventListener('mouseenter', function() {
				if (!$('#' + event.target.id).find('img').length) {
				}
			});

			document.getElementById(id[0]).addEventListener('mouseleave', function() {
				if (!messageSelected)
					$('#' + event.target.id).css('background', 'transparent');
			});
		}
	}
	// setProfilePics('chats-area', document.getElementById('chats-area').childElementCount)
});

// fetch more people to chat

$('#add-chat').click(add_chat);

function add_chat() {
	socket.emit('fetch-friends', {
		token: getCookie('session')
	});

	$('#options-area').empty();

	$('#options-area').append(`
    <div id="header-container">
      <div id="back-button">&#8249;</div>
      <div id="search-box">
        <div id="search-container" contenteditable="true" data-text="Find someone.."></div>
      </div>
    </div>
    <div id="divider"></div>
    <div id="search-results-box-container">  
      <div id="search-results-box">
        
      </div>
    </div>
  `);

	document.getElementById('back-button').addEventListener('click', function() {
		socket.emit('retrieve-convos', {
			token: getCookie('session')
		});
	});
}

function chat(userid) {
	socket.emit('create-new-conversation', {
		userid: '' + userid,
		token: getCookie('session')
	});
}

socket.on('catch-friends', function(info) {
	for (friend of info.friends) {
		$('#search-results-box').append(`
      <div id="result-${friend[1]}" class="convo" onclick="chat('${
			friend[1]
		}')">
        <div id="user-photo"><img></div>
        <div id="convo-info">
          <h2 id="username">${friend[0]}</h2>
        </div>
      </div>
    `);
	}

	document
		.getElementById('search-container')
		.addEventListener('keyup', function() {
			search(info.friends);
		});

	setProfilePics(
		'search-results-box',
		document.getElementById('search-results-box').childElementCount
	);
});

socket.on('convos', function(info) {
	$('#options-area').empty();

	$('#options-area').append(`
    <div id="header-container">
      <h2 id="title">Conversations</h2>
      <div id="add-chat">+</div>
    </div>
    <div id="divider"></div>
    <div id="chats-area-container">
      <div id="chats-area">
        ${info.convos}
      </div>
    </div>
  `);

	document.getElementById('add-chat').addEventListener('click', add_chat);
	// setProfilePics('chats-area', document.getElementById('chats-area').childElementCount)
});

socket.on('joined-room', function(data) {
	$('#content-title').html(data.username);
	convoidvar = data.roomid;
	useridentitynumb = data.userid;
});

let secrets = {
	'/tableflip': '(╯°□°）╯︵ ┻━┻',
	'/unflip': '┬─┬ ノ( ゜-゜ノ)',
	'/shrug': '¯_(ツ)_/¯'
};

function checkMessage(msg) {
	//designed for more secrets :P
	for (let i = 0; i < Object.keys(secrets).length; i++) {
		let key = Object.keys(secrets)[i];

		let replacement = secrets[key];

		let target = new RegExp(key, 'gi');

		msg = msg.replace(target, replacement);
	}
	return msg;
}

function search(arr, target) {
	$('#search-results-box').empty();

	for (i of arr) {
		let text = $('#search-container').html(),
			searchVal = i[0];

		if (searchVal.toLowerCase().match(text.toLowerCase())) {
			$('#search-results-box').append(` 
        <div id="result-${i[1]}" class="convo" onclick="chat('${i[1]}')">
          <div id="user-photo"><img></img></div>
          <div id="convo-info">
            <h2 id="username">${i[0]}</h2>
          </div>
        </div>
      `);
		}
	}
	setProfilePics(
		'search-results-box',
		document.getElementById('search-results-box').childElementCount
	);
}

socket.on('userIsTyping', function(infoa) {
	if (infoa.typing == true && infoa.userid == useridentitynumb) {
		$('#user-typing').html(`${infoa.username} is typing..`);
	} else if (infoa.typing == false) {
		$('#user-typing').html(`  `);
	}
});

function setTimeoutForTyping() {
	if (isTyping == true && intervalSet == false) {
		intervalSet = true;
		let timer = setInterval(function() {
			if (waitTime <= 0) {
				isTyping = false;
				waitTime = 0;
				socket.emit('isTyping', {
					typing: isTyping,
					token: getCookie('session'),
					userid: useridentitynumb,
					roomid: convoidvar
				});
				clearInterval(timer);
				intervalSet = false;
			}
			waitTime = waitTime - 1;
		}, 1000);
	}
}

socket.on('catch-message', function(info) {
	let idList = [];

	if (infoArr.previousSender == info.username) {
		if (info.userid == preloaduserid) {
			let messageid = Math.round(
				10000000000000 + Math.random() * 10000000000000
			);
			$(`
        <div id=${info.messageKey} class="client-message">
          <div class="message-info">
            <div class="content">${info.message}</div>
          </div>
        </div>
      `).appendTo('#convo-area');
			idList.push([info.messageKey, true]);
		} else {
			$('#convo-area').append(`
        <div class="message">
          <div class="lone-message-info">
            <div class="content">${info.message}</div>
          </div>
        </div>
      `);
		}
	} else {
		infoArr.previousSender = info.username;
		if (info.userid == preloaduserid) {
			$(`
        <div id=${info.messageKey} class="client-message">
          <div class="message-info">
            <div class="content">${info.message}</div>
          </div>
        </div>
      `).appendTo('#convo-area');
			idList.push([info.messageKey, true]);
		} else {
			$('#convo-area').append(`
        <div class="message">
          <div class="user-photo"><img src="${convoimg}"></div>
          <div class="message-info">
            <h2 class="username">${info.username}</h2>
            <div class="content">${info.message}</div>
          </div>
        </div>
      `);
		}
	}

	$('#convo-area').scrollTop($('#convo-area').prop('scrollHeight'));
	socket.emit('retrieve-convos', {
		token: getCookie('session')
	});

	for (id of idList) {
		if (id[1]) {
			document.getElementById(id[0]).addEventListener('mouseenter', function() {
				if (!$('#' + event.target.id).find('img').length) {
					if (!messageClicked && !messageSelected) {
						$('#' + event.target.id).prepend(`
              <img id="${
								event.target.id
							}img" src="https://media.discordapp.net/attachments/683796094739546117/686010517680291903/unknown.png" class="message-extra-options"/>
            `);

						document
							.getElementById(event.target.id + 'img')
							.addEventListener('click', function() {
								if (!messageSelected) {
									$('main').append(`
                  <div class="messages-extra-options-area">
                    <div id="delete" class="option">Delete</div>
                  </div>
                `);

									$('.messages-extra-options-area').css(
										'top',
										$('#' + this.id).offset().top - '20'
									);
									$('.messages-extra-options-area').css(
										'left',
										$('#' + this.id).offset().left - '100'
									);
									$('.messages-extra-options-area').css('min-height', 'unset');

									messageSelected = true;
									messageChoosen = '' + this.id;
									messageChoosen = messageChoosen.replace('img', '');

									document
										.getElementById('delete')
										.addEventListener('click', function() {
											socket.emit('deleteMessage', {
												message: messageChoosen,
												userid: useridentitynumb,
												token: getCookie('session'),
												convoid: convoidvar
											});
										});
								}
							});
					}
				}
			});

			document.getElementById(id[0]).addEventListener('mouseleave', function() {
				if (!messageSelected) $('#' + event.target.id + ' img').remove();
			});
		} else {
			document.getElementById(id[0]).addEventListener('mouseenter', function() {
				if (!$('#' + event.target.id).find('img').length) {
				}
			});

			document.getElementById(id[0]).addEventListener('mouseleave', function() {
				if (!messageSelected)
					$('#' + event.target.id).css('background', 'transparent');
			});
		}
	}
});

socket.on('messageDeleted', function(info) {
	document.getElementById(info.deletedMessage).remove();
});

$('#convo-area').scroll(function() {
	officialConvo != $('#convo-area').html()
		? $('#convo-area').scrollTop() <= 30
			? $('#convo-area').append(`
      <div class="loading_bar">
        <p>LOAD MORE MESSAGES..</p>
      </div>
      `)
			: $('.loading_bar')
				? $('.loading_bar').remove()
				: console.log('')
		: $('.loading_bar')
			? $('.loading_bar').remove()
			: console.log('');

	$('#convo-area').scrollTop() == 0
		? ((infoArr.messageLoad += 30),
		  socket.emit('fetch-more-messages', {
				amount: infoArr.messageLoad,
				userid: useridentitynumb,
				token: getCookie('session'),
				convoid: convoidvar
		  }))
		: console.log('');
});

socket.on('add-messages', function(data) {
	let convo = ``;
	infoArr.previousSender = ``;
	let idList = [];
	for (message of data.messages) {
		for (person of data.people) {
			if (person.userid == message[1].from) {
				let messageid = Math.round(
					10000000000000 + Math.random() * 10000000000000
				);
				if (infoArr.previousSender != person.username) {
					infoArr.previousSender = person.username;
					if (message[1].from == data.userid) {
						convo =
							convo +
							`
              <div id="${message[0]}" class="client-message">
                <div class="message-info">
                  <div class="content">${message[1].message}</div>
                </div>
              </div>
            `;
						idList.push([message[0], true]);
					} else {
						convo =
							convo +
							`
              <div id="${message[0]}" class="message">
                <div class="user-photo"><img src="${convoimg}"></div>
                <div class="message-info">
                  <div class="content">${message[1].message}</div>
                </div>
              </div>
            `;
					}
				} else {
					if (message[1].from == data.userid) {
						convo += `
              <div id="${message[0]}" class="client-message">
                <div class="client-lone-message-info">
                  <div class="content">${message[1].message}</div>
                </div>
              </div>
            `;
						idList.push([message[0], true]);
					} else {
						convo += `
              <div id="${message[0]}" class="message">
                <div class="lone-message-info">
                  <div class="content">${message[1].message}</div>
                </div>
              </div>
            `;
					}
				}
			}
		}
	}

	socket.emit('retrieve-convos', {
		token: getCookie('session')
	});

	if (previousConvoHeight == 0) {
		var savePos = document.getElementById('convo-area').children[0].id;
		if (officialConvo != convo) {
			$('#convo-area').html(convo);
			officialConvo = convo;
			$('#convo-area').scrollTop(document.getElementById(savePos).offsetTop); //restore "scroll position"
		} else {
			$('.loading_bar') ? $('.loading_bar').remove() : console.log('');
		}

		console.log('CONVO POS: ', document.getElementById(savePos).offsetTop);
	}

	$('#user-typing').html(`  `);

	waitTime = 0;

	for (id of idList) {
		if (id[1]) {
			document.getElementById(id[0]).addEventListener('mouseenter', function() {
				if (!$('#' + event.target.id).find('img').length) {
					if (!messageClicked && !messageSelected) {
						$('#' + event.target.id).prepend(`
              <img id="${
								event.target.id
							}img" src="https://media.discordapp.net/attachments/683796094739546117/686010517680291903/unknown.png" class="message-extra-options"/>
            `);

						document
							.getElementById(event.target.id + 'img')
							.addEventListener('click', function() {
								if (!messageSelected) {
									$('main').append(`
                  <div class="messages-extra-options-area">
                    <div id="delete" class="option">Delete</div>
                  </div>
                `);

									$('.messages-extra-options-area').css(
										'top',
										$('#' + this.id).offset().top - '20'
									);
									$('.messages-extra-options-area').css(
										'left',
										$('#' + this.id).offset().left - '100'
									);
									$('.messages-extra-options-area').css('min-height', 'unset');

									messageSelected = true;
									messageChoosen = '' + this.id;
									messageChoosen = messageChoosen.replace('img', '');

									document
										.getElementById('delete')
										.addEventListener('click', function() {
											socket.emit('deleteMessage', {
												message: messageChoosen,
												userid: useridentitynumb,
												token: getCookie('session'),
												convoid: convoidvar
											});
										});
								}
							});
					}
				}
			});

			document.getElementById(id[0]).addEventListener('mouseleave', function() {
				if (!messageSelected) $('#' + event.target.id + ' img').remove();
			});
		} else {
			document.getElementById(id[0]).addEventListener('mouseenter', function() {
				if (!$('#' + event.target.id).find('img').length) {
				}
			});

			document.getElementById(id[0]).addEventListener('mouseleave', function() {
				if (!messageSelected)
					$('#' + event.target.id).css('background', 'transparent');
			});
		}

		if (document.getElementById(useridentitynumb).children[1].children[1]) {
			document.getElementById(
				useridentitynumb
			).children[1].children[1].innerHTML = data.messages.pop()[1].message;
		}
	}
});

// setProfilePics('chats-area', document.getElementById('chats-area').childElementCount)

// document
// 	.getElementById('chats-area')
// 	.children[
// 		document.getElementById('chats-area').childElementCount - 1
// 	].click();
