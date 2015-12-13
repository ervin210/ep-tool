var express = require('express');
var app = express();

var mustacheExpress = require('mustache-express');


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
var hostUrl = process.env.HOST_URL || "http://localhost";
var serverPort = process.env.PORT || 3000;

app.get('/', function (req, res) {
   res.send('TODO this should link to the docs pages');
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
      scopes: ["read", "write", "delete"],
      modules: {
         jiraIssueTabPanels: [{
            url: "/panel/issue?issueId={issue.id}&issueKey={issue.key}",
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
            url: '/panel/project?projectId={project.id}&projectKey={project.key}',
            location: 'not-a-valid-location'
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
            url: '/panel/issue-type',
            location: 'element_options_section/issue_types_section',
            weight: 1000,
            tooltip: {
               value: 'Entity properties browser for issue types'
            },
            context: 'page'
         }, {
            key: 'workflow-entitiy-properties-web-item',
            name: {
               value: 'Entity properties'
            },
            url: '/panel/workflows',
            location: 'element_options_section/workflows_section',
            weight: 1000,
            tooltip: {
               value: 'Entity properties browser for workflows'
            },
            context: 'page'
         }, {
            key: 'user-entitiy-properties-web-item',
            name: {
               value: 'Entity properties'
            },
            url: '/panel/user',
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

var server = app.listen(serverPort, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
});
