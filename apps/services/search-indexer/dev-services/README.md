# Elasticsearch Search Dev Server

## Dependencies

You must have `docker` and `docker-compose` installed and running on you machine.
**Docker must be given 4+ GB of ram**

## Start the server

```bash
yarn nx run services-search-indexer:dev:services
```

In about 30 seconds  
You should have Elasticsearch running on `localhost:9200`  
And Kibana running on port `localhost:5601`

## Import data

**You must have access to Contentful for the indexer to work correctly**  
To import map templates, create indices and import data run

Required environment variables:

- `CONTENTFUL_HOST=preview.contentful.com` - Get from Contentful
- `CONTENTFUL_ACCESS_TOKEN=` - Get from Contentful or by running
  `yarn get-secrets api`
- `ELASTIC_NODE=http://localhost:9200/`

```bash
yarn nx run services-search-indexer:build
yarn nx run services-search-indexer:migrate
```

## Nice to know

Dictionaries for Icelandic are pulled into the Elasticsearch docker container on
build under `analyzers/`. The index template is not imported automagically so you
must insert them manually...for now. There is no unseen functionality here, these
`Dockerfile`s are **not used in production**, so if you add a plug to this docker
file you must make sure it is also added to required deployments.
