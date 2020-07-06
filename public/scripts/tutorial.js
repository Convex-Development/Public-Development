(function() {

let page = 1

let pages = {
  page1 : `
    <div class="row-container">
      <div class="column-container">
        <p class="title" id="center">Hey ${username}, let's get started by setting your profile picture.</p>
        <div class="profile-picture"><img src="https://media.discordapp.net/attachments/651993623021355018/690969100519735326/unknown.png"></div>
      </div>
    </div>
  `,
  page2 : `
    <div class="row-container">
      <div class="column-container">
        <p class="title" id="center" font-size="small">Next, lets setup your profiles description - explain who you are, what your hobbies and skills are, and what you do on your free time in the box below!</p>
        <div class="user-description" contenteditable="true" data-text="Psst: I LOVE CHATTR!">I love Chattr!</div>
      </div>
    </div>
  `
}

function changePage(page) {
  for(i = 1; i <= 5; i++) {
    $('#circle-' + i).css('background', 'transparent')
  }

  switch(page) {
    case 1 :
      $('#circle-1').css('background', 'black')
      $('.welcome-box').html(pages.page1)
    break;
    case 2 :
      $('#circle-2').css('background', 'black')
      $('.welcome-box').html(pages.page2)
    break;
    case 3 :
      $('#circle-3').css('background', 'black')
      $('.welcome-box').html(pages.page3)
    break;
    case 4 :
      $('#circle-4').css('background', 'black')
      $('.welcome-box').html(pages.page4)
    break;
    case 5 :
      $('#circle-5').css('background', 'black')
      $('.welcome-box').html(pages.page5)
    break;
  }
}

// changePage(1)

$('#arrow-right').click(function() {

  if (page == 5) {
    page = window.location.href = "/home";
  } else {
    page += 1
  }
  changePage(page)
})

$('#arrow-left').click(function() {
  
  if (page == 1) {
    page = 5
  } else {
    page -= 1
  }
  changePage(page)
})

})()