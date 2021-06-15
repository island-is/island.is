# Temporary Voter Registry

## About

**This service needs to be accessed by users through another service providing appropriate authentication for getting this data**
This service contains the temporary voter registry.
The data here is periodically updated manually and might not contain the most up to date representation of the temporary voter registry.

### Import voter registry

When updating the voter registry you must upload the entire registry as a single xlsx file  
The file must have three columns from left to right: "national id", "voter region number", "voter region name", where each row is a separate voter.
The first row is reserved for headers and is removed on import.

Run the following command inside the `temporary-voter-registry-api` folder:  
`npx sequelize-cli db:seed --seed voter-registry.js --region-file PATH_TO_SOURCE_FILE`
