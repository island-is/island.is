# Elasticsearch Search Development Server

## Dependencies

You must have `docker` and `docker compose` installed and running on you machine.  
**Docker must be given 4+ GiB of RAM**

## Start the server

```bash
yarn dev-services services-search-indexer
```

In about 30 seconds
You should have Elasticsearch running on `localhost:9200`  
And Kibana running on port `localhost:5601`

## Import data

**You must have access to Contentful for the indexer to work correctly**  
To import map templates, create indices and import data run

Required environment variables:

```bash
export CONTENTFUL_HOST=preview.contentful.com # Get from Contentful
export CONTENTFUL_ACCESS_TOKEN= # Get from Contentful or by running `yarn get-secrets api`
export ELASTIC_NODE=http://localhost:9200/
```

Then run:

```bash
yarn nx run services-search-indexer:build
yarn nx run services-search-indexer:migrate
```

## Nice to know

### Dictionaries

Dictionaries for Icelandic are pulled into the elastic docker container on build under `analyzers/`  
The index template is not imported automagically so you must insert them manually...for now  
There is no unseen functionality here, these Dockerfiles are **not used in production**,  
so if you add a plug to this docker file you must make sure it is also added to required deployments

### Local errors

In case you see a `TOO_MANY_REQUESTS/12/disk usage exceeded flood-stage watermark, index has read-only-allow-delete block` error in your local terminal, you can allow more disk usage with the following commands:

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_cluster/settings -d '{ "transient": { "cluster.routing.allocation.disk.threshold_enabled": false } }'
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": null}'
```

Source: [Stack Overflow](https://stackoverflow.com/questions/63880017/elasticsearch-docker-flood-stage-disk-watermark-95-exceeded#answer-63881121)
