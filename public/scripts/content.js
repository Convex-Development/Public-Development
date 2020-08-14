class Card {
	constructor(image, title, creator, description) {
		this.image = image
		this.title = title
		this.creator = creator
		this.description = description
		this.element = this.createElement()
	}
	render(target){
		target.appendChild(this.element)
	}
	createElement() {
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
    document.getElementById('main').innerHTML= universal + `
      
      <h1 id="head">GAMES</h1>
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
     document.getElementById('main').innerHTML= universal + `
      <h1 id = "head">VIDEOS</h1>
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
      document.getElementById('main').innerHTML= universal + `
      <h1 id="head">MUSIC</h1>
      <div id="addContent"></div>
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
      document.getElementById('main').innerHTML= universal + `
      <h1 id = "head">POSTS</h1>
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
function saveData(){
      title = document.getElementById("title").value;
      console.log(title);

      author = document.getElementById("author").value;
      console.log(author);

      description = document.getElementById("description").value;
      console.log(description);
     
        }

function onSelectAdd(){
    value = document.getElementById('addSong');
    popup = document.getElementById('addContent');
    popup.innerHTML = `
    <div id="popup">

      <div id="getTitle">
        <h3>Name of song</h3>
        <form>
          Name of song: <input id="title" type="text" name = "name">
        </form>
      </div>
      
      <div id="pickFile">
        <h3>Select a file to upload</3>
        <form id = "musicFile"> 
          <input type="file" name="fileupload" value="fileupload" id="musicUpload"> <label for="fileupload"></label>
        </form>
      </div>

      <div id="bannerImage">
        <h3>Select a banner image</h3>
        <form id = "imgFile"> 
          <input type="file" name="fileupload" value="fileupload" id="imageUpload"> <label for="fileupload"></label> 
        </form>
      </div>

      <div id="getAuthor">
        <h3>Author of music</h3>
        <p>Please make sure that the music you upload is not copyrighted.</p>
        <form>
          Author name: <input id = "author" type = "text" name = "name">
        </form>
      </div>

      <div id="getDescription">
        <h3>Description</h3>
        <form>
          Description: <input id = "description" type = "text" name = "name">
        </form>
      </div>
      <input id = "submitForm" type="submit" value="submit" onclick='saveData();'> 
        
    </div>
    `;
}