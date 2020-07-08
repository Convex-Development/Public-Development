//Nav bar
const menu = document.getElementById('expand')
const sidebar = document.querySelector('aside')

let toggle = false;

menu.addEventListener('click', () => {
	sidebar.style.left = !toggle ? 0 : 'calc(-15em - 2px)'
	setTimeout(() => {
		toggle = toggle ? false : true	
	}, 100)
})

document.body.addEventListener('click', e => {
	let inside = sidebar.contains(e.target)
	if(!inside && toggle) menu.click()
})

//socketio
var socket;
socket = io();
var notificationsRecieved = false;

let searchLimit = 15;

var messageSelected;
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var i = 0;
var yyyy = today.getFullYear();
var messageClicked = false;

let profile_pics = []

if (dd < 10) {
  dd = '0' + dd;
} 

if (mm < 10) {
  mm = '0' + mm;
} 

var today = mm + '/' + dd + '/' + yyyy;

//variables

var searchTriggered = false;

//click functions

$('#home-button').click(function() {
  location.href = '/home'
});

$('#extra-options').click(function() {
  $('#extra-options-area').animate({top: "8.5vh"}, 250);
})

$('#notification-bell').click(function() {
  socket.emit("notifications_checked", {
    token : getCookie('session')
  })

  $('#notifications-area').scrollTop(0)
  $('#notifications-area').animate({top: "8.5vh"}, 250);
})

$('#settings').click(function(){
  location.href = "/settings"
});

$('#purchase').click(function(){
  location.href = "/pricing"
});

$('#Logout').click(function(){
  document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/'
  location.href="/"
})

$(document).click(function() {
  if(event.target.id != 'search-bar' && event.target.id != 'load-more') $('#search-results').animate({top: "-40em"}, 250), searchTriggered = false
    
  if(event.target.id != 'extra-options') $('#extra-options-area').animate({top: "-40em"}, 250);
  
  if(event.target.id != "notification-bell" && event.target.id != "reject-button" && event.target.id != "accept-button") $('#notifications-area').animate({top: "-40em"}, 250);

  if(event.target.className != "message-extra-options" && messageSelected) {
    $('.messages-extra-options-area').remove()
    $('.message-extra-options').remove()
    console.log(`document.getElementById(${messageChoosen}).id`)
    $('#' + messageChoosen).css('background', 'rgba(185, 185, 185, 0)')
    messageSelected = false
  }

});


//socketio functions

$('#search-bar').keyup(function(){
  if (!searchTriggered) 
  $('#search-results').animate({top: "3.5em"}, 250), 
  $('#search-results').css("left", $('#search-bar').offset().left)
  searchTriggered = true, 
  console.log(searchTriggered)
  
  if($('#search-bar').val().length < 25) {
    socket.emit('search-request', {
      val : `${$('#search-bar').val()}`
    })
  } else {
    $('#search-results').empty();
    $('#search-results').append(`
      <div id="empty-area">
        <div id="empty-message">..Uhh, please enter a valid username..</div>
      </div>
    `);
  }

})

socket.on('search-results', function(data){
  $('#search-results').empty();
  
  if(data.results.length > 0) {
    let count = 0
    let loadMoreAppended = false;

    for (index of data.results) {
      if(count < searchLimit) {
        count++;
        $('#search-results').append(`
          <div id="img-${index[1]}">
            <div id="user-picture">
              <img src=""></img>
            </div>
            <p id="username">${index[0]}</p>
            
          </div>
        `);
      } else {
        if(loadMoreAppended == false) {
          
          $('#search-results').append(`
            <div id="load-more">Find more people on our community page</div>
          `);
          loadMoreAppended = true;
        }
      }

      if (document.getElementById("load-more")) {
        document.getElementById("load-more").addEventListener("click", function() {
          location.href = '/community'
        })
      }
      if(document.getElementById('img-' + index[1])) {
        document.getElementById('img-' + index[1]).addEventListener("click", function() {
          let id = this.id.replace(/img-/, "");
          location.href = "/profile/" + id
         
        })
      }
      
    }
    
  } else {
    $('#search-results').append(`
      <div id="empty-area">
        <div id="empty-message">'${$('#search-bar').val()}' could not be found..</div>
      </div>
    `);
  }
 setProfilePics('search-results', document.getElementById('search-results').childElementCount)

})

socket.on("rejected-request", function(info) {
  let elem = document.getElementById('/profile/' + info.userid);
  elem.parentNode.removeChild(elem);
});

socket.on("accepted-request", function(info) {
  let elem = document.getElementById('/profile/' + info.userid);
  elem.parentNode.removeChild(elem);
});

socket.on("notifications_checked_successfully", function(info) {
  const pattern = /^\(\d+\)/;
  document.title = document.title.replace(pattern, "")
})

//functions

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

// extra //

function add_friend(id){
  if(event.target.id == "accept-button") {
    
    socket.emit('accept-friend-request', {
      url: '' + id,
      token : getCookie('session'),
      date : today,
      time : formatAMPM(new Date)
    })
  }
  
}

function reject_friend(id){
  if(event.target.id == "reject-button") {
    
    socket.emit('reject-friend-request', {
      url: '' + id,
      token : getCookie('session')
    })
  }
  
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

// notification handling //

socket.emit('add-notification-listener', {
  token : getCookie('session')
})

socket.on("new_notification", function(info) {
  const pattern = /^\(\d+\)/;
  
  if(pattern.test(document.title)) {
    info.newNotifications > 0 ? document.title = document.title.replace(pattern, "(" + info.newNotifications + ") ") : null
      
  } else {
     info.newNotifications > 0 ? document.title = "(" + info.newNotifications + ") " + document.title : null
  }
  
  $('#notification-flex-container').append(info.notifications);
  setProfilePics('notification-flex-container', document.getElementById('notification-flex-container').childElementCount)
})

function clearAndAppend() {
  $('#notification-flex-container').append(info.notifications);
  setProfilePics('notification-flex-container', document.getElementById('notification-flex-container').childElementCount)
}

// functions

function setProfilePics(targetElementParent, elementCount) {

  for(i = 0; i < elementCount; i++) {

    let targetElement = document.getElementById(targetElementParent).children[i].id,
        picture_found = false;

    for(picture of profile_pics) {
      if(picture[1] == `${targetElement}`) {

        document.getElementById(targetElement).children[0].children[0].src = picture[0];
        picture_found = true;

      }
    }
    
    if(picture_found == false) {
      console.log(targetElementParent)
      if(targetElementParent == 'profile-info-display') {
        socket.emit('get-profile-photo', {
          user: targetElement,
          type: 'user'
        });
      } else {
        socket.emit('get-profile-photo', {
          user: targetElement,
          type: 'user'
        });
      }
      

    }
  }
}

socket.on('catch-profile-pic', function(info) {
  
  profile_pics.push([info.profile_pic, info.userElementID])
  if(info.profile_pic == "" || info.profile_pic == null || info.profile_pic == undefined) {
    document.getElementById(info.userElementID).children[0].children[0].src = "https://media.discordapp.net/attachments/651993623021355018/690969100519735326/unknown.png";
  } else document.getElementById(info.userElementID).children[0].children[0].src = info.profile_pic
})

setProfilePics('notification-flex-container', document.getElementById('notification-flex-container').childElementCount)