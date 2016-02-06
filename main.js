var express = require('express');
var bunyan = require('express-bunyan-logger');
var app = express();

var mustacheExpress = require('mustache-express');

// JSON Logging
app.use(bunyan());
app.use(bunyan.errorLogger());

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Register static variables
app.use('/static/images', express.static('static/images'));
app.use('/static/js', express.static('static-js'));
app.use('/static/css', express.static('static-css'));
app.use('/static/ace', express.static('static/ace'));

// Variables for setting up this addon
var serverPort = process.env.PORT || 3000;
var hostUrl = process.env.HOST_URL || "http://localhost:" + serverPort;

var zones = {
   local: 0,
   dev: 1,
   dog: 2,
   prod: 3
};

var zoneFromString = function(zone) {
   switch(zone) {
      case "useast.staging.atlassian.io":
      case "uswest.staging.atlassian.io":
         return zones.dog;

      case "useast.atlassian.io":
      case "uswest.atlassian.io":
         return zones.prod;

      case "domain.dev.atlassian.io":
      case "application.dev.atlassian.io":
      case "platform.dev.atlassian.io":
         return zones.dev;
   }
   
   return zones.local;
};

var getKeySuffixFromZone = function(zone) {
   switch(zone) {
      case zones.local:
         return '.local';
      case zones.dev:
         return '.dev';
      case zones.dog:
         return '.dog';
      case zones.prod: 
         return '.prod';
   }

   return '';
};

var microsZone = zoneFromString(process.env.ZONE);

app.get('/', function (req, res) {
   res.send('TODO this should link to the docs pages');
});

app.get('/jira/atlassian-connect.json', function(req, res) {
   res.json({
      name: 'Entity Property Tool',
      key: 'com.atlassian.connect.entity-property-tool' + getKeySuffixFromZone(microsZone),
      version: "1.0",
      description: 'An Atlassian Connect addon that allows every user to manipulate entity properties.',
      vendor: {
         name: 'Atlassian',
         url: 'http://www.atlassian.com'
      },
      baseUrl: hostUrl,
      authentication: {
         type: "none"
      },
      scopes: ["read", "write", "delete", "project_admin", "admin"],
      modules: {
         jiraIssueTabPanels: [{
            url: "/panel/issue?issue_id={issue.id}&issue_key={issue.key}",
            weight: 100,
            key: "issue-entity-tab",
            name: {
               value: "Entity properties"
            },
            conditions: [{ condition: 'user_is_logged_in' }]
         }],
         generalPages: [{
            key: 'project-entity-properties-general-page',
            name: {
               value: 'Project entity properties'
            },
            url: '/panel/project?project_id={project.id}&project_key={project.key}',
            location: 'not-a-valid-location',
            conditions: [{ condition: 'user_is_logged_in' }]
         }, {
            key: 'user-entity-properties-general-page',
            name: {
               value: 'User entity properties'
            },
            url: '/panel/user',
            location: 'not-a-valid-location',
            conditions: [{ condition: 'user_is_logged_in' }]
         }, {
            key: 'issue-type-entity-properties-general-page',
            name: {
               value: 'Issue type entity properties'
            },
            url: '/panel/issue-type',
            location: 'not-a-valid-location',
            conditions: [{ condition: 'user_is_logged_in' }]
         }],
         webItems: [{
            key: 'project-entity-properties-web-item',
            name: {
               value: "Entity properties"
            },
            url: 'project-entity-properties-general-page',
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
         }, {
            key: 'issue-type-entitiy-properties-web-item',
            name: {
               value: 'Entity properties'
            },
            url: 'issue-type-entity-properties-general-page',
            location: 'element_options_section/issue_types_section',
            weight: 1000,
            tooltip: {
               value: 'Entity properties browser for issue types'
            },
            context: 'page'
         }, {
            key: 'user-entitiy-properties-web-item',
            name: {
               value: 'Entity properties'
            },
            url: 'user-entity-properties-general-page',
            location: 'system.user.options/personal',
            weight: 1000,
            tooltip: {
               value: 'Entity properties browser for you'
            },
            context: 'page'
         }]
      }
   });
})

app.get('/panel/issue', function(req, res) {
   res.render('view-issue-panel');
});

app.get('/panel/project', function(req, res) {
   res.render('view-project-panel');
});

app.get('/panel/user', function(req, res) {
   res.render('view-user-panel');
});

app.get('/panel/issue-type', function(req, res) {
   res.render('view-issue-type-panel');
});

app.get('/rest/heartbeat', function(req, res) {
   res.sendStatus(200);
});

var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});
