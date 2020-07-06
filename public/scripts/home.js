const welcome = document.getElementById('welcome-message').querySelector('span')
const time = (new Date()).getHours()

if(time <= 24 && time < 12) welcome.textContent = 'Good morning'
else if(time >= 12 && time <= 12) welcome.textContent = 'Good afternoon'
else welcome.textContent = 'Good evening'