const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.email,
		pass: process.env.email_password
	}
})
const verification = (email, link) => {
	const mailOptions = {
		from: process.env.email,
		to: email,
		subject: 'Verify Your Chattr Account',
		html: `<img style="display: block; margin-left: auto; margin-right: auto; width: 95px; height: 104px "src="https://screen--mamamia5x.repl.co/c.png"/> <p style="text-align: center;font-family: Verdana, Geneva, sans-serif;">Your verification link is ${link}</h1>`,
	}
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) reject(error)
			else resolve(info.response)
		})
	})
	
}

module.exports = {
	verification
};