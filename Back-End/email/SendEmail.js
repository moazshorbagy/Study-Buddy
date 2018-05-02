var nodemailer = require('nodemailer');

function sendEmail(receiver, type, optionalObj){

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'contact.studdybuddy@gmail.com',
      pass: 'lztpyboedgrqsael',
    }
});

var message;
if(type == "welcome")
  message = 'Welcome to <b style="color:Tomato;">Study Buddy</b>!<br>  \
  Should you ever encounter problems with your account or forget your password, we will contact you at this address.<br><br>  \
Enjoy!<br> \
Study Buddy Team';

else if(type == "request")
  message = '<b style="color:Tomato;">Study Buddy</b>!<br> Greetings '+ optionalObj.myName +
  '<br><br>A request to obtain the '+optionalObj.type+' '+optionalObj.itemName+' from the user:'+
  optionalObj.hisName+'.<br>You can contact him via this email address: '+optionalObj.hisEmail+
'<br><br>Enjoy!<br> \
Study Buddy Team';
  
else if(type == "accept")
message = '<b style="color:Tomato;">Study Buddy</b>!<br> Greetings '+ optionalObj.hisName +
'<br><br>Your request to obtain the '+optionalObj.type+' '+optionalObj.itemName+' from the user:'+
optionalObj.myName+' has been'+optionalObj.state+'.<br>He will contact you on this email address'+
'<br><br>Enjoy!<br> \
Study Buddy Team';
var mailOptions = {
    from: 'contact.studdybuddy@gmail.com',
    to: receiver,
    subject: 'Study Buddy Team',
    html: message
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