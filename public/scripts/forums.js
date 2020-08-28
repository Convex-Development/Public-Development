let output = document.getElementById('output');
let buttons = document.getElementsByClassName('tool--btn');
for (let btn of buttons) {
	btn.addEventListener('click', () => {
		let cmd = btn.dataset['command'];
		if(cmd === 'createlink') {
			let url = prompt("Enter the link here: ", "http:\/\/");
			document.execCommand(cmd, false, url);
		} else {
			document.execCommand(cmd, false, null);
		}
	})
}

function genMine(){
  path = document.getElementById('main-content').innerHTML +=`
    <h1 id="comingSoon">Functionality coming soon! Visit our beta version here https://texteditorbeta.convex.repl.co/</h1>
  
  
  
  `
}