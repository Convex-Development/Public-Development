class Card {
	constructor(image, title, creator, description) {
		this.image = image
		this.title = tile
		this.creator = creator
		this.description = description
		this.element = this.render()
	}
	render() {
		let card = document.createElement('div')
		card.className = 'card'
		card.innerHTML = 
		`
			<div class="img-container" style="background-image: url('${this.image}')"></div>
			<div class="bottom">
				<p class="song-title">${this.title}</p>
				<p>By ${this.creator}</p>
				<p>${this.description}</p>
			</div>
		`
		return card
	}
}

// console.log(card.element);

//document.getElementById('content-container').appendChild(listing.element);

//document.querySelector('#content-type').addEventListener("change", function() {

function onSelect(){
  value = document.getElementById('content-type').value;
  console.log(value);
	let universal = `
		<div class="Dropdowns">
        <select id='content-type' onchange="onSelect()">
          <option>Music</option>
          <option>Games</option>
          <option>Videos</option>
          <option>Posts</option>
        </select>
			  <select id='content-stats'>
				  <option>Most Popular</option>
				  <option>Trending</option>
				  <option>New</option>
				  <option>Most Original</option>
			  </select>
      </div>
	`
  if (this.value == "Games") {
    console.log("Games");
    document.getElementById('main').innerHTML= universal + `
      
      <h1>GAMES</h1>
      <div id='cards-container'></div>
		  <div class="containerfloat">
        <div class="progress" id="progress"></div>
			    <audio id="audio" src="https://www.freesound.org/data/previews/338/338825_1648170-lq.mp3"></audio>
			  	<input type="image" id="playbtn" src="https://media.discordapp.net/attachments/728653704168996866/730913406982553611/wLYpKKgKsLAFwAAAABJRU5ErkJggg.png?width=603&height=452" onclick="togglePlay()" class="togglePlay"/>
          <input type="image" id="stopbtn" src="https://media.discordapp.net/attachments/728653704168996866/730913424233463828/WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.png?width=603&height=452" onclick="stop()" class=""/>
	  	</div>
    <link rel="stylesheet" type='text/css' href='/styles/music.css'>
    <link rel="stylesheet" type='text/css' href='/styles/master.css'>
		<script src="/scripts/music2.js"></script>
		<script src="/scripts/music.js"></script>`;
  }else if (this.value == "Videos") {
    console.log("Videos");
     document.getElementById('main').innerHTML= universal + `
      <div id='cards-container'></div>
		  <div class="containerfloat">
        <div class="progress" id="progress"></div>
			    <audio id="audio" src="https://www.freesound.org/data/previews/338/338825_1648170-lq.mp3"></audio>
			  	<input type="image" id="playbtn" src="https://media.discordapp.net/attachments/728653704168996866/730913406982553611/wLYpKKgKsLAFwAAAABJRU5ErkJggg.png?width=603&height=452" onclick="togglePlay()" class="togglePlay"/>
          <input type="image" id="stopbtn" src="https://media.discordapp.net/attachments/728653704168996866/730913424233463828/WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.png?width=603&height=452" onclick="stop()" class=""/>
	  	</div>
    <link rel="stylesheet" type='text/css' href='/styles/music.css'>
    <link rel="stylesheet" type='text/css' href='/styles/master.css'>
		<script src="/scripts/music2.js"></script>
		<script src="/scripts/music.js"></script>`;
  }else if(this.value =="Music"){
    console.log("Music");
      document.getElementById('main').innerHTML= universal + `
      <div id='cards-container'></div>
		  <div class="containerfloat">
        <div class="progress" id="progress"></div>
			    <audio id="audio" src="https://www.freesound.org/data/previews/338/338825_1648170-lq.mp3"></audio>
			  	<input type="image" id="playbtn" src="https://media.discordapp.net/attachments/728653704168996866/730913406982553611/wLYpKKgKsLAFwAAAABJRU5ErkJggg.png?width=603&height=452" onclick="togglePlay()" class="togglePlay"/>
          <input type="image" id="stopbtn" src="https://media.discordapp.net/attachments/728653704168996866/730913424233463828/WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.png?width=603&height=452" onclick="stop()" class=""/>

          <button id="addSong" type="button" 
          onclick = "onSelectAdd();">+</button>

	  	</div>
    <link rel="stylesheet" type='text/css' href='/styles/music.css'>
    <link rel="stylesheet" type='text/css' href='/styles/master.css'>
		<script src="/scripts/music2.js"></script>
		<script src="/scripts/music.js"></script>`;
  }else if(this.value == "Posts"){
    console.log("Posts");
      document.getElementById('main').innerHTML= universal + `
      <div id='cards-container'></div>
		  <div class="containerfloat">
        <div class="progress" id="progress"></div>
			    <audio id="audio" src="https://www.freesound.org/data/previews/338/338825_1648170-lq.mp3"></audio>
			  	<input type="image" id="playbtn" src="https://media.discordapp.net/attachments/728653704168996866/730913406982553611/wLYpKKgKsLAFwAAAABJRU5ErkJggg.png?width=603&height=452" onclick="togglePlay()" class="togglePlay"/>
          <input type="image" id="stopbtn" src="https://media.discordapp.net/attachments/728653704168996866/730913424233463828/WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.png?width=603&height=452" onclick="stop()" class=""/>
	  	</div>
    <link rel="stylesheet" type='text/css' href='/styles/music.css'>
    <link rel="stylesheet" type='text/css' href='/styles/master.css'>
		<script src="/scripts/music2.js"></script>
		<script src="/scripts/music.js"></script>`;
  }
}
function onSelectAdd(){
    value = document.getElementById('addSong');
    
  }
//});
