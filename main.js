var express = require('express');
var ExpressPinoLogger = require('express-pino-logger');
var app = express();

var mustacheExpress = require('mustache-express');

// JSON Logging
var obfuscate = [
    'req.headers.cookie',
    'req.headers.referer',
    'referer',
    'msg'
];

const pino = ExpressPinoLogger({
   redact: obfuscate
});

app.use(pino);

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
       case "staging":
          return zones.dog;

       case "prod":
          return zones.prod;

       case "dev":
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

var microsZone = zoneFromString(process.env.MICROS_ENVTYPE);

app.get('/', function (req, res) {
   res.redirect('/jira/atlassian-connect.json');
});

app.get('/jira/atlassian-connect.json', function(req, res) {
   var showCondition = [{
      condition: 'user_is_logged_in'
   }, {
      or: [{
         condition: 'entity_property_equal_to',
         invert: true,
         params: {
            entity: 'addon',
            propertyKey: 'ep-tool.disabled-for-all',
            value: 'true'
         }
      }, {
         condition: 'entity_property_equal_to',
         params: {
            entity: 'user',
            propertyKey: 'ep-tool.enabled-for-me',
            value: 'true'
         }
      }]
   }];

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
         configurePage: {
            "url": "/page/configuration",
            "icon": {
               "width": 80,
               "height": 80,
               "url": "/maps/icon.png"
            },
            "key": "configuration-page",
            "name": {
               "value": "Entity property tool configuration"
            }
         },
         jiraIssueTabPanels: [{
            url: "/panel/issue?issue_id={issue.id}&issue_key={issue.key}",
            weight: 100,
            key: "issue-entity-tab",
            name: {
               value: "Entity properties"
            },
            conditions: showCondition
         }],
         jiraProjectPages: [{
           key: 'project-entity-properties-general-page',
           name: {
             value: 'Entity properties'
           },
           url: '/panel/project?project_id={project.id}&project_key={project.key}',
           weight: 1000,
           tooltip: {
             value: 'Project entity properties browser'
           },
           iconUrl: '/static/images/entity-properties-icon.svg',
           conditions: showCondition
         }],
         generalPages: [{
            key: 'user-entity-properties-general-page',
            name: {
               value: 'User entity properties'
            },
            url: '/panel/user',
            location: 'not-a-valid-location'
         }, {
            key: 'issue-type-entity-properties-general-page',
            name: {
               value: 'Issue type entity properties'
            },
            url: '/panel/issue-type',
            location: 'not-a-valid-location'
         }],
         webItems: [{
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
            context: 'page',
            conditions: showCondition
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

app.get('/page/configuration', function(req, res) {
   res.render('configuration-page');
});

app.get('/rest/heartbeat', function(req, res) {
   res.sendStatus(200);
});

var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});
