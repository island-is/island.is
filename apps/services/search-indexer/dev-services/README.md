# Elasticsearch Search Dev Server

### Dependencies

You must have `docker` and `docker-compose` installed and running on your machine.  
**Docker must be allocated 4GB or more of RAM.**

### Start the Server

```bash
yarn dev-services services-search-indexer
```

In about 30 seconds,  
Elasticsearch should be running on `localhost:9200`  
And Kibana should be running on `localhost:5601`

### Import Data

**You must have access to Contentful for the indexer to function properly.**  
To import map templates, create an index, and import data, run:

Required environment variables:

- `CONTENTFUL_HOST=preview.contentful.com` - Obtain from Contentful
- `CONTENTFUL_ACCESS_TOKEN=` - Obtain from Contentful or by running `yarn get-secrets api`
- `ELASTIC_NODE=http://localhost:9200/`

```bash
yarn nx run services-search-indexer:build
yarn nx run services-search-indexer:migrate
```

### Additional Information

#### Dictionaries

Dictionaries for Icelandic are pulled into the Elasticsearch Docker container during build under `analyzers/`.  
The index template is not imported automatically, so you must insert it manually for now.  
This Docker configuration is not used in production.  
If you add a plugin to this Docker file, ensure it is also added to the required deployments.

#### Local Errors

If you encounter a `TOO_MANY_REQUESTS/12/disk usage exceeded flood-stage watermark, index has read-only-allow-delete block` error in your local terminal, you can allow more disk usage with the following commands:

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_cluster/settings -d '{ "transient": { "cluster.routing.allocation.disk.threshold_enabled": false } }'
```

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": null}'
```

Source: [Stack Overflow](https://stackoverflow.com/questions/63880017/elasticsearch-docker-flood-stage-disk-watermark-95-exceeded#answer-63881121)