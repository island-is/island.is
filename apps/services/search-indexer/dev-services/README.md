# Elasticsearch search dev server

### Dependencies

You must have `docker` and `docker-compose` installed and running on you machine.

### Start the server

```bash
yarn dev-services services-search-indexer
```

In about 30 seconds  
You should have Elasticsearch running on `localhost:9200`  
And Kibana running on port `localhost:5601`

### Nice to know

Dictionaries for icelandic are pulled into the elastic docker container on build under `analyzers/`  
The index template is not imported automagically so you must insert them manually...for now
