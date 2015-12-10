var express = require('express');
var app = express();

app.use('/static', express.static('static'));

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
         jiraIssueTabPanels: [{
            url: "/panel/issue",
            weight: 100,
            key: "issue-entity-tab",
            name: {
               value: "Entity properties"
            },
            conditions: [{ condition: 'user_is_logged_in' }]
         }],
         webItems: [{
            key: 'project-entity-properties-web-item',
            name: {
               value: "Entity properties"
            },
            url: '/panel/project',
            location: 'jira.project.sidebar.navigation',
            weight: 1000,
            tooltip: {
               value: 'Project entity properties browser'
            },
            context: 'page',
            icon: {
               width: 16,
               height: 16,
               url: '/static/images/entity-properties-icon-16.png'
            }
         }]
      }
   });
})

var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});
