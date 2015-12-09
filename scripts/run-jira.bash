#!/bin/bash -e

# From: https://developer.atlassian.com/static/connect/docs/guides/getting-started.html

atlas-run-standalone --container tomcat7x --product jira --version 7.0.0-OD-08-005 --data-version 7.0.0-OD-08-005 --bundled-plugins com.atlassian.bundles:json-schema-validator-atlassian-bundle:1.0.4,com.atlassian.jwt:jwt-plugin:1.2.2,com.atlassian.upm:atlassian-universal-plugin-manager-plugin:2.20.1-D20150924T170115,com.atlassian.plugins:atlassian-connect-plugin:1.1.57 --jvmargs '-XX:MaxPermSize=2048M -Datlassian.upm.on.demand=true' $@
