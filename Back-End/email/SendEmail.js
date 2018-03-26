var nodemailer = require('nodemailer');

function sendEmail(receiver){

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'contact.studdybuddy@gmail.com',
      pass: 'lztpyboedgrqsael',
    }
});
  
var mailOptions = {
    from: 'contact.studdybuddy@gmail.com',
    to: receiver,
    subject: 'Study Buddy Team',
    html: 'Welcome to <b style="color:Tomato;">Study Buddy</b>!<br><br>  \
    <img src="Study Buddy.png"><br> \
    Should you ever encounter problems with your account or forget your password, we will contact you at this address.<br><br>  \
Enjoy!<br> \
Study Buddy Team' 
};
  
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
});
}
module.exports = sendEmail;