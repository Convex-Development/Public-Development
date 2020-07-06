//functions

function renderPage(pageTitle, pageData) {
	$('#content-title').html(pageTitle);

	if (pageData[0] === false) {
		$('#empty-message').html(pageData[1]);
	} else {
		switch (pageTitle) {
			case 'Community':
				renderCommunityPage();
				break;
		}
	}
}

//click functions

$('#community-btn').click(function() {
	renderPage('Community', [false, `No community has been found..`]);
});

$('#friends-btn').click(function() {
	renderPage('Friends', [false, 'No friends just yet..']);
});

$('#following-btn').click(function() {
	renderPage('Following', [false, "You aren't following anyone.."]);
});

$('#followers-btn').click(function() {
	renderPage('Followers', [false, 'No followers yet..']);
});

/* functions */

function renderCommunityPage() {
	socket.emit('fetch-community', {
		token: getCookie('session'),
		limit: 10,
		filter: 'all'
	});

	$('#content-container').html(`
    <div class="user">
      <div class="user-photo">

      </div>
      <div class="userinfo">
        <p class="username">Bluestar3211231</p>
        <p class="relations">5 friends in common including Ian</p> 
      </div>
      
      <!-- <div id="empty-message">There is no community yet..</div> -->
    </div>
  `);
}

socket.on('catch-community', function(data) {
	let html = ``;

	for (user of data.users) {
		if (user[2] && user[2].length >= 1) {
			let friendsentece;
			if (user[2].length == 1) {
				friendsentece = `Friends with ${user[2][user[2].length - 1]}`;
			} else if (user[2].length > 1) {
				friendsentece = `${user[2].length} friends in common including ${
					user[2][user[2].length - 1]
				}`;
			}

			html += `
        <div class="user">
          <div class="user-photo">
            <img src="${user[0]}">
          </div>
          <div class="userinfo">
            <p class="username">${user[1]}</p>
            <p class="relations">${friendsentece}</p> 
          </div>
          
          <!-- <div id="empty-message">There is no community yet..</div> -->
        </div>
      `;
		} else {
			html += `
        <div class="user">
          <div class="user-photo">
            <img src="${user[0]}">
          </div>
          <div class="userinfo">
            <p class="username">${user[1]}</p>
          </div>
          
          <!-- <div id="empty-message">There is no community yet..</div> -->
        </div>
      `;
		}
	}
	$('#content-container').html(html);
});
