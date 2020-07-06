var onloadCallback = function() {
	console.log('Captcha Ready');
};
/*grecaptcha.ready(() => {
    grecaptcha.execute('6Lc5D-cUAAAAAG0C0p8yJXCSU-qdoEeEucxDxf8P', {action: 'login'}).then((token) => {
		let toSend = {
			token: token
		}
		let xhttp = new XMLHttpRequest();
		xhttp.open('POST', '/captcha');
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.onload = () => {
			if(xhttp.status === 200){
				let response = JSON.parse(xhttp.responseText);
				if(response.hasOwnProperty('error'))
					alert(response.error)
				if(response.hasOwnProperty('bot')){
					window.location = 'https://www.youtube.com/watch?v=oHg5SJYRHA0'
				}
				
			}
		}
		xhttp.send(JSON.stringify(toSend));
    });
});
*/
