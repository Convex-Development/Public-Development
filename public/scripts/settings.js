//on enter
var username = "";
var infoArray = [];
var userPhoto = 'https://storage.googleapis.com/chattr-userbase.appspot.com/4bc7a4fe24f19f6d521796f2d9993958.png?GoogleAccessId=firebase-adminsdk-u1x3y%40chattr-userbase.iam.gserviceaccount.com&Expires=16447017600&Signature=pjx3MSoUuiwCCVqwqInZcTOzPtcjtZggRv%2FZ7W7s%2BUUYBoL3V2KsTgpyj7bwGBm6zHcyuNYVeB3WAD7QlvMKGi2Rthx2bh9P41n%2FdMfBUaXc8SBpgKqVK0nEf%2BjYkAUPq1ZUP%2F48AELAcSYfLAXcx5JH4C0LAIsQsT%2Fe98PNQn1HEDepE3y2pgPKaRMSXstkEjdvSa1livAbgGnSADj0vnwEAJjXQhHzt5q2cWX9MVEa40RlKdQQVdm4hzsMkMLi%2B5AiklEJYQ5cprqh%2FKBZZO9lmEUlgmo2%2F%2BF0VvT6WhLqa3MqRoE01ZbqUj0x5uPw4KuOpUEbldlImLykUjS5nw%3D%3D'
var pages = [
  account = false,
  billing_payments = false,
  security_login = false,
  privacy = false,
  blocking = false,
  notifications = false,
  theme = false
]

var userInfo = userinfo;
setTimeout(renderAccount(), 1000);

//page information

var pageInfo; //socket emit

//functions

function renderPage(pageTitle, pageData) {
  $('#right-area').empty();
  $('#right-area').append(`
    <div id="content-header">
      <div id="divider"></div>
      <h2 id="content-title"></h2>
      <div id="divider"></div>
    </div>
    <div id="content-container"> </div>
  `);

  $('#content-title').html(pageTitle);

  if(pageData[0] == false) {
    $('#content-container').append(`
      <div id="empty-area">
        <div id="empty-message">Nothing is here yet..</div>
      </div>
    `);

  } else {
    //Page setup
    $('html,body').scrollTop(0)
    switch(pageTitle) {
      case "Account": 
        renderAccount();
        break;
      case "Billing and Payments" :
        renderBillingPayments();
        break;
      case "Security and Login" :
        renderSecurityLogin();
        break;
      case "Privacy" :
        renderPrivacy();
        break;
      case "Blocking" :
        renderBlockedUsers();
        break;
      case "Notifications" :
        renderNotifications();
        break;
      case "Theme" :
        renderTheme();
        break;
    }
    
  }
}

//click functions

$('#account').click(function(){
  if (!pages[0]) {
    closePages(account);
    renderPage('Account', [true, "Failed to load.."]);
    pages[0] = true
  }
});

$('#billing-payments').click(function(){
  if (!pages[1]) {
    closePages(account);
    renderPage('Billing and Payments', [true, "Coming soon.."]);
    pages[1] = true;
  }
});

$('#security-login').click(function(){
  if (!pages[2]) {
    closePages(account);
    renderPage('Security and Login', [true, "Coming soon.."]);
    pages[2] = true;
  }
});

$('#privacy').click(function(){
  if (!pages[3]) {
    closePages(account);
    renderPage('Privacy', [true, "Coming soon.."]);
    pages[3] = true;
  }
});

$('#blocking').click(function(){
  if (!pages[4]) {
    closePages(account);
    renderPage('Blocking', [true, "Coming soon.."]);
    pages[4] = true;
  }
});

$('#notifications').click(function(){
  if (!pages[5]) {
    closePages(account);
    renderPage('Notifications', [true, "Coming soon.."]);
    pages[5] = true;
  }
});

$('#theme').click(function(){
  if (!pages[6]) {
    closePages(account);
    renderPage('Theme', [true, "Coming soon.."]);
    pages[6] = true;
  }
});

$(document).click(function() {
  if(event.target.id != "post-options" && event.target.id != "messaging-options") {
    if($('.options-list')){
      $('.options-list').remove();
    }
  }
})

//page rendering

function renderAccount() {
  let username
  
  $('#empty-area').css('height', '7em');
  socket.emit('fetch-account-info', {
    session : getCookie('session')
  });

  $('#content-container').empty();
  
  $('#content-container').append(`
    <div class="info-container">
      <h2>Username: </h2>
      <p id="username">${userInfo.name}</p>
      <img id="change-username" src="https://media.discordapp.net/attachments/651993623021355018/673546096714186787/unknown.png">
    </div>

    <div class="info-container">
      <h2>Password: </h2>
      <p>########</p>
      <img id="change-password" src="https://media.discordapp.net/attachments/651993623021355018/673546096714186787/unknown.png">
    </div>

    <div class="info-container">
      <h2>Email: </h2>
      <p id="email">${userInfo.email}</p>
      <img id="change-email" src="https://media.discordapp.net/attachments/651993623021355018/673546096714186787/unknown.png">
    </div>
  `);

  $('#right-area').append(`
    <div id="content-header">
      <div id="divider"></div>
      <h2 id="content-title" >Social Media</h2>
      <div id="divider" ></div>
    </div>
    <div id="content-container">
      <h2 id="social-title">TWITTER</h2>
      <div class="social-input-container">
        <div id="twitter-account" class="social-input" contenteditable="true" data-text="Your twitter account">${userInfo.twitter}</div>
      </div>
      <p class="error" id="twitter-error"></p>
      <h2 id="social-title">INSTAGRAM</h2>
      <div class="social-input-container">
        <div id="insta-account" class="social-input" contenteditable="true" data-text="Your insta account">${userInfo.insta}</div>
      </div>
      <p class="error" id="instagram-error"></p>
      <h2 id="social-title">FACEBOOK</h2>
      <div class="social-input-container">
        <div id="facebook-account" class="social-input" contenteditable="true" data-text="Your facebook account">${userInfo.facebook}</div>
      </div>
      <p class="error" id="facebook-error"></p>
      <h2 id="social-title">YOUTUBE</h2>
      <div class="social-input-container">
        <div id="youtube-account" class="social-input" contenteditable="true" data-text="Your youtube channel">${userInfo.youtube}</div>
      </div>
      <p class="error" id="youtube-error"></p>
      <div id="save-container">
        <div id="save-socials" class="save-button">Save</div>
      </div>
    </div>

    <div id="content-header">
      <div id="divider"></div>
      <h2 id="content-title">Customize Profile</h2>
      <div id="divider"></div>
    </div>
    <div id="content-container">
      <h2 id="sub-title">Profile Picture</h2>
      <div id="profile-picture">
        <img id="profile_picture_img" src="${userInfo.profile_picture}"></img>
      </div>
      <h2 id="sub-title">Your description</h2>
      <div id="user-description-container">
        <div id="user-description" contenteditable="true" data-text="Hint: I love Convex!">${userInfo.bio}</div>
      </div>
      <div id="save-container">
        <div id="save-bio" class="save-button">Save</div>
      </div>
    </div>
	<input type="file" id="upload-file" style="height: 0; width: 0; overflow: hidden;opacity: 0; visibility: 0; position: fixed; left: -200vw;"/>
  `);

  let form = document.getElementById('upload-file');

	document.getElementById('profile-picture').onclick = () => {
		form.click()
	}

	form.addEventListener("change", () => {
    
		let file = form.files[0];

		if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
      $('<p>Please upload an image.</p>').insertAfter("profile_picture");
    } else {
      let formData = new FormData();

      formData.append("file", file);
      formData.append("token", getCookie('session'))
      
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/upload");

      xhr.onload = () => {
        if(xhr.status === 200) { 
          let response = JSON.parse(xhr.responseText);
          if(response.hasOwnProperty('error')){
            console.log(response.error)
          }
          else {
            socket.emit('get-profile-photo', {
              type: 'client',
              token: getCookie('session')
            });
            // response.success
          }
        }
        
      };
      xhr.send(formData);
    }
    
  }, true)
  
  document.getElementById("save-bio").addEventListener('click', function(){
    socket.emit('change-settings-data', {
      section: 'bio',
      bio: $('#user-description').html(),
      session: getCookie('session')
    });
    userInfo.bio = $('#user-description').html();
  });

  document.getElementById("save-socials").addEventListener('click', function(){
    let save = false;
    let twitter = stripHtml($('#twitter-account').html());
    let insta = stripHtml($('#insta-account').html());
    let facebook = stripHtml($('#facebook-account').html());
    let youtube = stripHtml($('#youtube-account').html());

    console.log("clicked");
    if(save == false) {
      if (twitter) {
        if (!twitter.search(/twitter/)) {
          console.log("Twitter error")
        }
      }
    }
    socket.emit('change-settings-data', {
      section: 'social',
      information: {
        twitter: twitter,
        insta: insta,
        facebook: facebook,
        youtube: youtube
      },
      session: getCookie('session')
    });
    userInfo.twitter = twitter;
    userInfo.insta = insta;
    userInfo.facebook = facebook;
    userInfo.youtube = youtube;
  });

  document.getElementById("change-username").addEventListener("click", function(){
    $('main').append(`
    <div id="setting-change-area-container">
      <div id="setting-change-area">
        <h2>Change Username</h2>
        <div id="divider"></div>
        <h2 id="descriptive-title">NEW USERNAME</h2>
        <div class="user-input-container">
          <div class="user-input" id="new-name" contenteditable="true" data-text="New username"></div>
        </div>
        <h2 id="descriptive-title">CONFIRM PASSWORD</h2>
        <div class="user-input-container">
          <div class="user-input" id="password" contenteditable="true" data-text="Account password"></div>
        </div>
        <p id="error-message"></p>
        <div id="save-button">Change</div>
      </div>
    </div>
    `)

    document.getElementById("setting-change-area-container").addEventListener("click", function(){
      if(event.target.id == "setting-change-area-container") {
        $(this).remove();
      }
    });

    document.getElementById('save-button').addEventListener('click', function(){
      socket.emit('change-settings-data', {
        section : 'change-name',
        name : stripHtml($('#new-name').html()),
        password : $('#password').html(),
        session : getCookie('session')
      });
      
      userInfo.name = $('#new-name').html()
    });

  });
  
  document.getElementById("change-password").addEventListener("click", function(){
    $('main').append(`
    <div id="setting-change-area-container">
      <div id="setting-change-area">
        <h2>Change Password</h2>
        <div id="divider"></div>
        <h2 id="descriptive-title">NEW PASSWORD</h2>
        <div class="user-input-container">
          <div class="user-input" id="new-password" contenteditable="true" data-text="New password"></div>
        </div>
        <h2 id="descriptive-title">CONFIRM PASSWORD</h2>
        <div class="user-input-container">
          <div class="user-input" id="password" contenteditable="true" data-text="Account password"></div>
        </div>
        <p id="error-message"></p>
        <div id="save-button">Change</div>
      </div>
    </div>
    `)

    document.getElementById("setting-change-area-container").addEventListener("click", function(){
      if(event.target.id == "setting-change-area-container") {
        $(this).remove();
      }
    })

    document.getElementById('save-button').addEventListener('click', function(){
      socket.emit('change-settings-data', {
        section : 'change-password',
        new_password : $('#new-password').html(),
        current_password : $('#password').html(),
        session : getCookie('session')
      });
    })
  });

  document.getElementById("change-email").addEventListener("click", function(){
    $('main').append(`
    <div id="setting-change-area-container">
      <div id="setting-change-area">
        <h2>Change Email</h2>
        <div id="divider"></div>
        <h2 id="descriptive-title">NEW EMAIL</h2>
        <div class="user-input-container">
          <div class="user-input" id="new-email" contenteditable="true" data-text="New email"></div>
        </div>
        <h2 id="descriptive-title">CONFIRM PASSWORD</h2>
        <div class="user-input-container">
          <div class="user-input" id="password" contenteditable="true" data-text="Account password"></div>
        </div>
        <p id="error-message"></p>
        <div id="save-button">Change</div>
      </div>
    </div>
    `)

    document.getElementById("setting-change-area-container").addEventListener("click", function(){
      if(event.target.id == "setting-change-area-container") {
        $(this).remove();
      }
    })

    document.getElementById('save-button').addEventListener('click', function(){
      socket.emit('change-settings-data', {
        section : 'change-email',
        email : $('#new-email').html(),
        password : $('#password').html(),
        session : getCookie('session')
      });
      userInfo.email = $('#new-email').html()
    })
  });
}

socket.on('input-success', function(data){
  switch(data.type) {
    case 'name' :
      console.log("recieved")
      $('p#username').html($('#new-name').html());
    case 'email' :
      $('p#email').html($('#new-email').html());
  }
  $("#setting-change-area-container").remove()
  
});

socket.on('input-error', function(data){
  console.log('error recieved')
  switch(data.type) {
    case 'name' : 
    console.log($('#password').html())
      $('#error-message').html("Invalid password, please try again.")
      break;
  }
});

function renderBillingPayments() {
  $('#content-container').empty();

  $('#content-container').append(`
    <h2 id="sub-title">Recent Purchases</h2>
    <div id="empty-area">
      <div id="empty-message">No Recent Purchases</div>
    </div>
  `);
}

function renderSecurityLogin() {
  if(userInfo.tfa == 'true') {
    userInfo.tfa = 'checked'
  } else if(!userInfo.tfa) {
    userInfo.tfa = '';
  }

  $('#content-container').empty();

  $('#content-container').append(`
    <div class="checkbox-container">
      <h2 id="sub-title">Two Factor Authentication</h2>
      
      <input id="TFA" type="checkbox" ${userInfo.tfa}>
    </div>
    <p id="description">Enable this to recieve a confirmation email when someone attempts to sign into your account.</p>
    </div>
  `);
  
  let check = false;

  if($("#TFA").is(':checked')){
    check = true;
  } else {
    check = false;
  }
  
  document.getElementById('TFA').addEventListener('click', function(){
    socket.emit('change-settings-data', {
      section : 'tfa',
      checked : document.getElementById("TFA").checked,
      session : getCookie('session')
    });

    if(document.getElementById('TFA').checked) {
      userInfo.tfa = "checked"
    } else if (!document.getElementById('TFA').checked) {
      userInfo.tfa = document.getElementById("TFA").checked
    }
  });
}

function renderPrivacy() {
  $('#content-container').empty();

  $('#content-container').append(`
    <div class="checkbox-container">
      <h2 id="sub-title">Posts</h2>
    </div>
    <p id="description">The options below will allow you to choose who can and cannot see what you post on your profile.</p>
    <div id="post-options" class="options">${userInfo.posts_privacy}</div>
    <div class="checkbox-container">
      <h2 id="sub-title">Messaging</h2>
    </div>
    <p id="description">The options below will allow you to control who can and cannot message you</p>
    <div id="messaging-options" class="options">${userInfo.messaging_privacy}</div>
  `);

  document.getElementById('post-options').addEventListener('click', function(){
    createList('post-options', ['Friends and Followers', 'Friends Only', 'Nobody']);
    
  });

  document.getElementById('messaging-options').addEventListener('click', function(){
    createList('messaging-options', ['Friends and Followers', 'Friends Only', 'Nobody']);
  });
}

function renderBlockedUsers() {
  $('#content-container').empty();

  $('#content-container').append(`
    <h2 id="sub-title">Blocked Users</h2>
    <div id="empty-area">
      <div id="empty-message">Nobodys been blocked just yet..</div>
    </div>
  `);
}

function renderNotifications() {

  if(userInfo.en == 'true') {
    userInfo.en = 'checked';
  } else if(!userInfo.en) {
    userInfo.en = '';
  }

  if(userInfo.nn == 'true') {
    userInfo.nn = 'checked';
  } else if(!userInfo.nn) {
    userInfo.nn = '';
  }

  if(userInfo.post_notifications == 'true') {
    userInfo.post_notifications = 'checked'
  } else if(!userInfo.post_notifications) {
    userInfo.post_notifications = '';
  }

  if(userInfo.chats == 'true') {
    userInfo.chats = 'checked'
  } else if(!userInfo.chats) {
    userInfo.chats = '';
  }

  if(userInfo.update_notifications == 'true') {
    userInfo.update_notifications = 'checked'
  } else if(!userInfo.update_notifications) {
    userInfo.update_notifications = '';
  }

  $('#content-container').empty();

  $('#content-container').append(`
    <div class="checkbox-container">
      <h2 id="sub-title">External Notifications</h2>
      <label class="switch">
          <input id="EN_notifications" type="checkbox" ${userInfo.en}>
          <span class="slider round"></span>
        </label>
    </div>
    <p id="description">Allow us to send you a notification every time a friend messages, follows, or sends a friend request to you.</p>
    <div class="checkbox-container">
      <h2 id="sub-title">Newsletter Notifications</h2>
      <label class="switch">
          <input id="NN_notifications" type="checkbox" ${userInfo.nn}>
          <span class="slider round"></span>
        </label>
    </div>
    <p id="description">Allow us to send you updates on how Chattr has changed or improved.</p>
  `);

  $('#right-area').append(`
    <div id="content-header">
      <div id="divider"></div>
      <h2 id="content-title">Other Notifications</h2>
      <div id="divider"></div>
    </div>
    <div id="content-container">
      <div class="checkbox-container">
        <h2 id="sub-title">Posts</h2>
        <label class="switch">
          <input id="post_notifications" type="checkbox" ${userInfo.post_notifications}>
          <span class="slider round"></span>
        </label>
      </div>
      <p id="description">Receive a notification every time your friends create a new post.</p>
      <div class="checkbox-container">
        <h2 id="sub-title">Chats</h2>
        <label class="switch">
          <input id="chat_notifications" type="checkbox" ${userInfo.chats}>
          <span class="slider round"></span>
        </label>
      </div>
      <p id="description">Receive a notification every time your friend sends you a message.</p>
      <div class="checkbox-container">
        <h2 id="sub-title">Updates</h2>
        <label class="switch">
          <input id="update_notifications" type="checkbox" ${userInfo.update_notifications}>
          <span class="slider round"></span>
        </label>
      </div>
      <p id="description">Receive a notification when a game that you have followed receives updates.</p>
    </div>
  `);

  document.getElementById('EN_notifications').addEventListener('click', function(){
    socket.emit('change-settings-data', {
      section : 'en',
      checked : document.getElementById("EN_notifications").checked,
      session : getCookie('session')
    });
    
    if(document.getElementById("EN_notifications").checked) {
      userInfo.en = 'checked'
    } else {
      userInfo.en = ''
    }
  });


  document.getElementById('NN_notifications').addEventListener('click', function(){
    socket.emit('change-settings-data', {
      section : 'nn',
      checked : document.getElementById("NN_notifications").checked,
      session : getCookie('session')
    });
    console.log(userInfo.nn)
    if(document.getElementById("NN_notifications").checked) {
      userInfo.nn = 'checked'
    } else if(!document.getElementById("NN_notifications").checked) {
      userInfo.nn = ''
    }
    console.log(userInfo)
  });

  document.getElementById('post_notifications').addEventListener('click', function(){
    socket.emit('change-settings-data', {
      section : 'posts',
      checked : document.getElementById("post_notifications").checked,
      session : getCookie('session')
    });

    if(document.getElementById("post_notifications").checked) {
      userInfo.post_notifications = 'checked'
    } else if(!document.getElementById("post_notifications").checked) {
      userInfo.post_notifications = ''

    }
    console.log(userInfo)
  });

  document.getElementById('chat_notifications').addEventListener('click', function(){
    socket.emit('change-settings-data', {
      section : 'chats',
      checked : document.getElementById("chat_notifications").checked,
      session : getCookie('session')
    });

    if(document.getElementById("chat_notifications").checked) {
      userInfo.chats = 'checked'
    } else if(!document.getElementById("chat_notifications").checked) {
      userInfo.chats = ''

    }
    console.log(userInfo)
  });

  document.getElementById('update_notifications').addEventListener('click', function(){
    socket.emit('change-settings-data', {
      section : 'update_notifications',
      checked : document.getElementById("update_notifications").checked,
      session : getCookie('session')
    });

    if(document.getElementById("update_notifications").checked) {
      userInfo.update_notifications = 'checked'
    } else if(!document.getElementById("update_notifications").checked) {
      userInfo.update_notifications = ''

    }
    console.log(userInfo)
  });
}

//important functions

function createList(clickElement, listOptions) {
  if($('.options-list')){
    $('.options-list').remove();
  }

  $('#right-area').append(`
    <div id="options-list" class="options-list"></div>
  `)

  $('.options-list').css('left', document.getElementById(clickElement).offsetLeft);

  $('.options-list').css('top', document.getElementById(clickElement).offsetTop + document.getElementById(clickElement).offsetHeight - 8 + 'px');

  for(i in listOptions) {
    $('.options-list').append(`
      <div class="sub-option">${listOptions[i]}</div>
    `)

    document.getElementById('options-list').children[i].addEventListener('click', function(){ 
      document.getElementById(clickElement).innerHTML = this.innerHTML;
      if(clickElement == "post-options") {
        socket.emit('change-settings-data', {
          content: this.innerHTML,
          section: 'post-options',
          session: getCookie('session')
        })
        userInfo.posts_privacy = this.innerHTML
      } else if (clickElement == "messaging-options") {
        socket.emit('change-settings-data', {
          content: this.innerHTML,
          section: 'messaging-options',
          session: getCookie('session')
        })
        userInfo.messaging_privacy = this.innerHTML
      }

      
    })
  }
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//click functions

$('#TFA').click(function() {
  console.log("checked = " + $(this).is(":checked"))
  // socket.emit('settings-request', {
  //   type : event.target.id,
  //   value : document.getElementById(event.target.id).checked
  // });
});

//..functions
function stripHtml(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function closePages(reserve) {
  for(index in pages) {
    pages[index] = false;
  }
}

socket.on('social-update-error', function(info) {
  switch(info.site) {
    case 'twitter' :
      $('#twitter-error').html('This is not a valid twitter account..');
      break;
    case 'youtube' :
      $('#youtube-error').html('This is not a valid youtube channel..');
      break;
    case 'instagram' :
      $('#instagram-error').html('This is not a valid instagram account..');
      break;
    case 'facebook' :
      $('#facebook-error').html('This is not a valid facebook account..');
      break;
  }
});

socket.on('catch-clients-profile-pic', function(info) {
  document.getElementById('profile_picture_img').src = info.profile_pic
  userInfo.profile_picture = info.profile_pic
})

function renderTheme() {
  if(userInfo.dt == 'true') {
    userInfo.dt = 'checked';
  } else if(!userInfo.dt) {
    userInfo.dt = '';
  }

  $('#content-container').empty();

  $('#content-container').append(`
    <div class="checkbox-container">
      <h2 id="sub-title">Dark Mode</h2>
      <label class="switch">
        <input id="DarkTheme" type="checkbox" ${userInfo.dt}>
        <span class="slider round"></span>
      </label>
    </div>
    <p id="description">Too bright? Turn this on to decrease brightness.</p>
  `);

  document.getElementById('DarkTheme').addEventListener('click', function() {
    if(document.getElementById("DarkTheme").checked) {
      $(document.body).attr('theme', 'dark')
      userInfo.dt = 'checked'
      document.cookie = 'dt=true;expires=expires=Thu, 01 Jan 2070 00:00:01 GMT'
    } else {
      $(document.body).attr('theme', '')
      userInfo.dt = ''
      document.cookie = 'dt=false;expires=expires=Thu, 01 Jan 2070 00:00:01 GMT'
    }
  })
}