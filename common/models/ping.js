
var fs = require('fs');
var join = require('path').join;
var basepath = process.env.PWD;
var emails = {
  interested: fs.readFileSync(join(basepath, 'assets/emails/interested.tmpl')),
  collaborator: fs.readFileSync(join(basepath, 'assets/emails/collaborator.tmpl')),
  listener: fs.readFileSync(join(basepath, 'assets/emails/listener.tmpl'))
};

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
      html: emails[this.type],
    }, function(err, mail) {
      if (err) { console.log(err); return; }
      console.log('email sent!');
    });
    next();
  };

};

