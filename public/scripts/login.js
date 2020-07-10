var socket;
let currentForm = false; 


const submit = document.getElementsByTagName('button');

const main = document.querySelector('main');
const agree = document.getElementById('agree');

agree.onchange = function(){
	if(this.checked) submit[0].disabled = false;
}

window.addEventListener('keyup', e => {
	if (e.keyCode == 13) submitForm();
});

function switchForm(){
	let event = window.event;
	let _target= event.target ||event.srcElement;
	main.className = 'fadeOut';
	main.onanimationend = () => {
		main.className = 'fadeIn';

		if (currentForm){
			document.getElementById('signupbox').style.display = 'none';
			document.getElementById('loginbox').style.display = 'block';
			_target.innerHTML = "Don't have an account?<br>Sign Up"
		}
		else{
			document.getElementById('signupbox').style.display = 'flex';
			document.getElementById('loginbox').style.display = 'none';
			_target.innerHTML="Already have an account?<br>Login";
			if (agree.checked) submit[0].disabled = false;
		}

	}
	currentForm = !currentForm;
}