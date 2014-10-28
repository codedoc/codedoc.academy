var loopback = require('loopback');
module.exports = function (Ping) {

	Ping.beforeCreate = function (next, ping) {
		ping.created = ping.created || new Date();
    next();
  };

  Ping.afterCreate = function (next, ping) {
  	var Gmail = loopback.getModel('Gmail');  
    console.log('Sending ack email to ' + this.email);
  	// send an email
    Gmail.send({
		  to: this.email,
		  from: 'info@codedoc.academy',
		  subject: 'this is a test',
		  text: 'test text',
		  html: '<em>this is</em> a test!'
		}, function(err, mail) {
			if (err) { console.log(err); return; }
		  console.log('email sent!');
		});
    next();
  };

};

