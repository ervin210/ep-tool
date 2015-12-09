var express = require('express');
var app = express();

var hostUrl = process.env.HOST_URL || "http://localhost";
var serverPort = process.env.PORT || 3000;

app.get('/', function (req, res) {
   res.send('Hello World!');
});

app.get('/jira/atlassian-connect.json', function(req, res) {
   res.json({
      name: 'Entity Property Tool',
      key: 'com.atlassian.connect.entity-property-tool',
      version: "1.0",
      description: 'An Atlassian Connect addon that allows every user to manipulate entity properties.',
      vendor: {
         name: 'Atlassian',
         url: 'http://www.atlassian.com'
      },
      baseUrl: hostUrl + ":" + serverPort,
      authentication: {
         type: "none"
      },
      scopes: ["read", "write"],
      modules: {
      }
   });
})

var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});
