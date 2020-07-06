//functions

function renderPage(pageTitle, pageData) {
  $('#content-title').html(pageTitle)

  if(pageData[0] == false) {
    $('#empty-message').html(pageData[1])
  }
}

//click functions

$('#games-btn').click(function(){
  renderPage('Games', [false, "There are no games yet.."]);
});

$('#videos-btn').click(function(){
  renderPage('Videos', [false, "There are no videos yet.."]);
});

$('#music-btn').click(function(){
  renderPage('Music', [false, "There is no music yet.."]);
});

$('#posts-btn').click(function(){
  renderPage('Posts', [false, "There are no posts yet.."]);
});

$('#usercontent-btn').click(function(){
  renderPage('Your content', [false, "You haven't uploaded anything yet.."]);
});