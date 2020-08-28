const root = document.getElementById('root-main')
const render = (elem) => root.appendChild(elem)

class Modal {
	constructor(options) {
		this.options = options
		return this.createElement()
	}
	createElement() {
		let div = document.createElement('div')
		div.classList.add('modal-container')
		div.classList.add('fade-in')
		div.innerHTML = 
		`
			<div class="modal">
				<img src="${this.options.src}" />
				<div>
					<h1>${this.options.title}</h1>
					<p>Uploaded by ${this.options.artist}</p>
					<p>${this.options.description}</p>
					<div>
						<button>Play</button>
						<button>Save</button>				
					</div>
				</div>
				<span class="x">✕</span>
			</div>		
		`
		div.querySelector('span').addEventListener('click', () => {
			div.remove()
		})

		return div
	}
}
class Card {
	constructor(options) {
		this.options = options
		return this.createElement()
	}
	createElement() {
		let options = this.options
		let div = document.createElement('div')
		div.className = "song"
		div.innerHTML =
		`
			<div>
				<img src="${options.src}" alt="${options.title}"/>
				<p>${options.title}</p>
				<span>${options.artist}</span>
			</div>
			<div>
				<div></div>
			</div>
		`
		div.addEventListener('click', () => {
			render(new Modal(options))
		})
		return div
	}
}

const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

for(let i = 0; i < 10; i++) {
	render(new Card({
		src: 'https://static.scientificamerican.com/sciam/cache/file/7A715AD8-449D-4B5A-ABA2C5D92D9B5A21_source.png',
		title: random([
			'Song.mp4',
			'YOOOOO',
			'epic sauces',
			'beat drops',
			'zzzzzz',
			'eat food today reeeee'
		]),
		artist: random([
			'Ethan',
			'AdCharity',
			'Dark'
		]),
		description: 'blub blub blub'
	}))
}
// const cards_container = document.getElementById('cards-container')
//image, title, creator, description
// var card1 = new Song("https://www.freesound.org/data/previews/338/338825_1648170-lq.mp3",'https://ichef.bbci.co.uk/news/1024/cpsprodpb/67CF/production/_108857562_mediaitem108857561.jpg', "Test", "Another Bird").render(document.getElementById('cards-container'));
// console.log(card.element);
// console.log(card1.element);
// document.getElementById('cards-container').appendChild(card.element);
// document.getElementById('cards-container').appendChild(card1.element);

var timer;
var percent = 0;
var audio = document.getElementById("audio");


// audio.ontimeupdate = function(){
// 	var progress = document.getElementById("progress");
//   percent = 100 * audio.currentTime / audio.duration;
//   progress.style.width = percent+'%'

// }

audio.addEventListener("playing", function(_event) {
  var duration = _event.target.duration;
  advance(duration, audio);
});
audio.addEventListener("pause", function(_event) {
  clearTimeout(timer);
});
var advance = function(duration, element) {
  var progress = document.getElementById("progress");
  increment = 10/duration
  percent = Math.min(increment * element.currentTime * 10, 100);
  progress.style.width = percent+'%'
  startTimer(duration, element);
}
var startTimer = function(duration, element){ 
  if(percent < 100) {
    timer = setTimeout(function (){advance(duration, element)}, 100);
  }
}

function togglePlay (e) {
  e = e || window.event;
  var btn = e.target;
  if (!audio.paused) {
    btn.classList.remove('active');
    audio.pause();
    isPlaying = false;
    var image = document.getElementById("playbtn");
    image.src = "https://media.discordapp.net/attachments/728653704168996866/730913406982553611/wLYpKKgKsLAFwAAAABJRU5ErkJggg.png?width=603&height=452"
  } else {
    btn.classList.add('active');
    audio.play();
    isPlaying = true;
    var image = document.getElementById("playbtn");
    image.src = "https://media.discordapp.net/attachments/728653704168996866/730913386686054521/RawAwqMCgAr1GrwHAoMKgAvQavQYAgwqDCtBr9BoADCoMKtBr0GsAMKgwqECvQa8BwKDCoAK9Br0GwKACgwr0GvQagK4tz0fn3K8.png?width=603&height=452"
  }
}
function stop(){
	audio.pause();
	audio.currentTime = 0;
	document.getElementById("progress").style.width = 0;

	var image = document.getElementById("playbtn");
	image.src = "https://media.discordapp.net/attachments/728653704168996866/730913406982553611/wLYpKKgKsLAFwAAAABJRU5ErkJggg.png?width=603&height=452"
}