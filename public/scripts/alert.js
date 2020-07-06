const alertStyles = document.createElement('style');
alertStyles.type = 'text/css'; 
alertStyles.innerHTML = `#alerts .alert{animation:onNotify 4s ease-in-out forwards;user-select:none;padding:20px;width:200px;height:auto;font-size:16px;text-align:left;border-radius:4px;margin-top:1em;opacity:0;word-break:break-word;position:relative}#alerts .alert-bad{background-color:#ff7f8a;color:#d8000c}#alerts .alert-good{background-color:#90ee90;color:#4f8a10}@keyframes onNotify{from{opacity:0;right:-200px}10%{opacity:1;right:0}50%{opacity:1;right:0}90%{opacity:1;right:1em}to{opacity:0;right:-200px;display:none}}`;

document.getElementsByTagName('head')[0].appendChild(alertStyles);

const alerts = document.createElement('div');
Object.assign(alerts.style,{
	position: 'fixed',
	bottom: '1em',
	right: '1em',
	padding: 0,
	zIndex: 500,
	pointerEvents: 'none'
});
alerts.id = 'alerts';
document.body.appendChild(alerts);

class Alert{
	constructor(message, type){
		this.id = Math.random();

		this.message = message;
		this.type = type;

		this.html = document.createElement('div');
		
		this.html.textContent = this.message;
		this.html.className = `alert alert-${this.type}`;
		this.html.id = this.id;

		this.render();
		setTimeout(() => {
			this.clear();
		}, 4000);
	}
	render(){
		alerts.appendChild(this.html);

	}
	clear(){
		document.getElementById(this.id).remove();
	}
}
