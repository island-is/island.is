# Elasticsearch Search Dev Server

### Dependencies

Ensure you have `docker` and `docker compose` installed with Docker allocated 4GB+ RAM.

### Start the Server

```bash
yarn dev-services services-search-indexer
```

Wait approximately 30 seconds. Elasticsearch will run on `localhost:9200` and Kibana on `localhost:5601`.

### Import Data

**Access to Contentful is required for the indexer to function properly.**

Environment variables needed:

- `CONTENTFUL_HOST=preview.contentful.com`
- `CONTENTFUL_ACCESS_TOKEN=` (obtain from Contentful or via `yarn get-secrets api`)
- `ELASTIC_NODE=http://localhost:9200/`

To import map templates, create indices, and import data:

```bash
yarn nx run services-search-indexer:build
yarn nx run services-search-indexer:migrate
```

### Additional Information

#### Dictionaries

Icelandic dictionaries are pulled into the Elasticsearch Docker container under `analyzers/`. These Dockerfiles are for development only. Add any plugins to the Dockerfile and ensure they are included in required deployments.

#### Local Errors

If you encounter the error `TOO_MANY_REQUESTS/12/disk usage exceeded flood-stage watermark, index has read-only-allow-delete block`, use the following commands to allow more disk usage:

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_cluster/settings -d '{ "transient": { "cluster.routing.allocation.disk.threshold_enabled": false } }'
```

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": null}'
```

Source: [Stack Overflow](https://stackoverflow.com/questions/63880017/elasticsearch-docker-flood-stage-disk-watermark-95-exceeded#answer-63881121)