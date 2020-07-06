let following = important_info.following;
let followers = important_info.followers;
let friends = important_info.friends;
let followersLength = important_info.followersLength;
let friendsLength = important_info.friendsLength;
let unfollowed = false;
let unfriended = false;
let userid = '';

//page setup

$('#profile-info-display').empty();

if(friends != "") {
  $('#profile-info-display').append(friends);
} else {
  $('#profile-info-display').append(`
    <div id="empty-area">
      <h2 id="empty-message">No friends found..</h2>
    </div>
  `)
}

setProfilePics('profile-info-display', friendsLength)

// click functions

$('#follow-user').click(function(){
  socket.emit('follow', {
    url : location.href,
    token : getCookie('session'),
    date : today,
    time : formatAMPM(new Date)
  })
})

socket.on('followed-successful', function(userReference) {
  followers = important_info.followers;
  if (!followers.includes(userReference.userid)) {
    followers = followers + `
      <a id="user" class="additionA0492" href="/profile/${userReference.userid}">
        <div id="user-picture"></div>
        <p id="name">${userReference.username}</p>
      </a>
    `
  }
  followersLength = parseInt(followersLength) + 1

  $('#option2').html(`Followers (${followersLength})`)
  $("#follow-user").html('Unfollow')
  unfollowed = false;
})

socket.on('unfollowed-successful', function(reference){
  followersLength > 0 ? followersLength = parseInt(followersLength) - 1 : ""
  
  $('#option2').html(`Followers (${followersLength})`)
  $("#follow-user").html('Follow')
  console.log(followers)
	userid = reference.userid;
  unfollowed = true;
})

$('#add-friend').click(function() {
  socket.emit('friend', {
    url : location.href,
    token : getCookie('session'),
    date : today,
    time : formatAMPM(new Date)
  })
})

$('#remove-friend').click(function() {
  socket.emit('remove-friend', {
    url : location.href,
    token : getCookie('session')
  })
})

socket.on("added-successfully", function() {
  $('#add-friend').html('Pending')
  $('#add-friend').attr('id', 'pending')
})

socket.on("remove-successful", function(reference) {
  userid = reference.userid
  $('#remove-friend').html('Add Friend')
  $('#remove-friend').attr('id', 'add-friend')
  
  friendsLength = parseInt(friendsLength) - 1

  $('#option1').html(`Friends (${friendsLength})`)
  unfriended = true;
  
  $('#add-friend').click(function() {
    socket.emit('friend', {
      url : location.href,
      token : getCookie('session'),
      date : today,
      time : formatAMPM(new Date)
    })
  });
})

// functions 

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

$('#option3').click(function(){
  $('#profile-info-display').empty();

  if(following != "") {
    $('#profile-info-display').append(following);
  } else {
    $('#profile-info-display').append(`
      <div id="empty-area">
        <h2 id="empty-message">${important_info.username} isn't following anyone..</h2>
      </div>
    `)
  }
  console.log("adding profile pictures")
  setProfilePics('profile-info-display', document.getElementById('profile-info-display').childElementCount)
})

$('#option2').click(function(){
  $('#profile-info-display').empty();

  if(unfollowed == false) {
    if(followers != "") {
      $('#profile-info-display').append(followers);
    } else {
      $('#profile-info-display').append(`
        <div id="empty-area">
          <h2 id="empty-message">No followers found..</h2>
        </div>
      `)
    }
   
  } else {
    if(followers != "") {
      $('#profile-info-display').append(followers);
    } 

    $('#profile-info-display').children(`a[href='/profile/${userid}']`).remove();
    
    if(followersLength == 0) {
      $('#profile-info-display').append(`
        <div id="empty-area">
          <h2 id="empty-message">No followers found..</h2>
        </div>
      `)
    }
  }

  setProfilePics('profile-info-display', document.getElementById('profile-info-display').childElementCount)
});

$('#option1').click(function(){
  $('#profile-info-display').empty();
    console.log("clicked")
   if(unfriended == false) {
    if(friends != "") {
      $('#profile-info-display').append(friends);
    } else {
      $('#profile-info-display').append(`
      <div id="empty-area">
        <h2 id="empty-message">No friends found..</h2>
      </div>
      `)
    }
  } else {
    $('#profile-info-display').append(friends);
    $('#profile-info-display').children(`a[href='/profile/${userid}']`).remove();
    if(friendsLength == 0) {
      $('#profile-info-display').append(`
        <div id="empty-area">
          <h2 id="empty-message">No friends found..</h2>
        </div>
      `)
    }
  }

  setProfilePics('profile-info-display', document.getElementById('profile-info-display').childElementCount)
})
