var path = require('path');
module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  // router.get('/', server.loopback.status());
  router.get('/', function (req, res) {
    res.sendfile(server.index_file_path);
  });
  server.use(router);
  server.dataSources.email.connector.transports[0].transporter.options.auth.pass = process.env.GMAIL_PASS;
};
