class Card{
	  constructor(image, title, creator, description){
			this.image = image;
			this.title = title; 
			this.creator = creator;
      this.description = description;
			this.element = this.makeElement();
		}
	  makeElement(){
			let card = document.createElement('div');
			card.classList.add('card');
			card.innerHTML = `
      <div class='img-container' style="background-image: url('${this.image}')"></div>
      <div class='bottom'>
				<p class='song-title'>${this.title}</p><p> by ${this.creator}</p> <p> ${this.description}</p>
	    </div>
	    `;
	    return card;
		}
}

var listing = new Card('https://ichef.bbci.co.uk/news/1024/cpsprodpb/67CF/production/_108857562_mediaitem108857561.jpg', "Birds", "Random person");
// console.log(card.element);

document.getElementById('content-container').appendChild(listing.element);

document.querySelector('#content-type').addEventListener("change", function() {
  if (this.value == "Games") {
    console.log(this.value);
    document.getElementById('main').innerHTML=`
      <div class="Dropdowns">
        <select id='content-type'>
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
     console.log(this.value);
     document.getElementById('main').innerHTML=`
      <div class="Dropdowns">
        <select id='content-type'>
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
      document.getElementById('main').innerHTML=`
      <div class="Dropdowns">
        <select id='content-type'>
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
  }else if(this.value == "Posts"){
      console.log(this.value);
      document.getElementById('main').innerHTML=`
      <div class="Dropdowns">
        <select id='content-type'>
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
});
