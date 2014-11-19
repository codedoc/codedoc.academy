
var minstache = require('minstache');
var crypto = require('crypto');
var fs = require('fs');
var join = require('path').join;
var basepath = process.env.PWD;
var emails = {
  student: minstache.compile(fs.readFileSync(join(basepath, 'assets/emails/student.tmpl'), 'utf8')),
  collaborator: minstache.compile(fs.readFileSync(join(basepath, 'assets/emails/collaborator.tmpl'), 'utf8')),
  interested: minstache.compile(fs.readFileSync(join(basepath, 'assets/emails/interested.tmpl'), 'utf8'))
};

var loopback = require('loopback');
module.exports = function (Ping) {

  Ping.beforeCreate = function (next, ping) {
    // set active
    ping.active = true;

    // generate created timestamp
    ping.created = ping.created || new Date();

    // generate unsubscribe_code
    var token = ping.name + ping.created;
    var shasum = crypto.createHash('sha1');
    shasum.update(token);
    ping.unsubscribe_code = shasum.digest('hex');

    next();
  };

  Ping.afterCreate = function (next, ping) {
    var Gmail = loopback.getModel('Gmail');  
    console.log('Sending ' + this.sender + ' ack email to ' + this.email);
    // send an email
    Gmail.send({
      to: this.email,
      from: 'info@hackfaber.com',
      subject: 'Ciao, qui HACKFABER!',
      text: emails[this.sender](this),
    }, function(err, mail) {
      if (err) { console.log(err); return; }
      console.log('email sent!');
    });
    next();
  };

  Ping.unsubscribe = function (code, end) {
    Ping.findOne({where: {'unsubscribe_code': code}}, function (err, ping) {
      //hanle error
      ping.updateAttribute('active', false, function (err) {
        end(null, {ok: true});
      });
    });
  };
   
  Ping.remoteMethod('unsubscribe', {
    path: '/unsubscribe', 
    verb: 'post',
    accepts: {arg: 'code', type: 'string'},
    returns: {arg: 'ok', type: 'boolean'}
  });

};

