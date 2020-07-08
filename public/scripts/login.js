var socket;
let currentForm = false; 

// true = signup, false = login
const submit = document.getElementsByTagName('button')[0];
submit.addEventListener('click', submitForm);

const toggle = document.getElementById('switch');
toggle.addEventListener('click', switchForm);

const main = document.querySelector('main');

window.addEventListener('keyup', e => {
	if (e.keyCode == 13) submitForm();
})

function switchForm(event){
	let _target = event.target || event.srcElement;
	main.className = 'fadeOut'
	main.onanimationend = () => {
		main.className = 'fadeIn'

		if (currentForm){

			document.getElementById('signupbox').style.display = 'none';
			document.getElementById('loginbox').style.display = 'block';
			_target.innerHTML = "Don't have an account?<br>Sign Up"
			submit.textContent = 'Login';
		}
		else{
			document.getElementById('signupbox').style.display = 'flex';
			document.getElementById('loginbox').style.display = 'none';
			_target.innerHTML = "Already have an account?<br>Login";
			submit.textContent = 'Register'
		}

	}
	
	currentForm = !currentForm;
}

async function submitForm() {
	// signing up
	if (!currentForm){
		let box = document.getElementById('signupbox');

		let inputs = box.getElementsByTagName('input');
		for(let input of inputs) {
			if(!input.value) {
				new Alert(`Fill out ${input.placeholder}`, 'bad');				
				return;
			}
		}
	
		if (inputs[2].value != inputs[3].value){
			new Alert('Passwords do not match', 'bad');
			return;
		}
		
		let tosend = {
			username: inputs[0].value,
			email: inputs[1].value,
			password: inputs[2].value
		}
		console.log(tosend);
		let response = await fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(tosend)
		});
		console.log('response', response);

		let data = await response.json();
		console.log(data);

		if (data.hasOwnProperty('error')) new Alert(data.error, 'bad');
		else window.location.href = "/";
	}

	// logging in
	else{
		let box = document.getElementById('loginbox');
		// [username, password]
		
		let inputs = box.getElementsByTagName('input');
		for(let input of inputs) {
			if(!input.value) {
				new Alert(`Fill out ${input.placeholder}`, 'bad');				
				return;
			}
		}
		let tosend = {
			username: inputs[0].value, 
			password: inputs[1].value
		};
		let response = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(tosend)
		})
		let data = await response.json();
		console.log(data.token);
		if (data.hasOwnProperty('error')) new Alert(data.error, 'bad');
		else window.location.href = '/home';
	}
}

<script>

  function checkForm(form)
  {
    ...
    if(!form.terms.checked) {
      alert("Please indicate that you accept the Terms and Conditions");
      form.terms.focus();
      return false;
    }
    return true;
  }

</script>

