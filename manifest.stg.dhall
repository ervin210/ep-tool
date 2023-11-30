./manifest.dhall /\ {
  -- ONECLOUD-3512: In order for the install to succeed it needs to start with the prod key
  app.connect.key = "com.atlassian.connect.entity-property-tool.prod.dog"
}