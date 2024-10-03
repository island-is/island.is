# Elasticsearch Search Dev Server

### Dependencies

Ensure `docker` and `docker compose` are installed, with Docker allocated 4GB+ RAM.

### Start the Server

```bash
yarn dev-services services-search-indexer
```

Wait ~30 seconds. Elasticsearch: `localhost:9200`, Kibana: `localhost:5601`.

### Import Data

**Contentful access is required.**

Set environment variables:

- `CONTENTFUL_HOST=preview.contentful.com`
- `CONTENTFUL_ACCESS_TOKEN=` (obtain from Contentful or via `yarn get-secrets api`)
- `ELASTIC_NODE=http://localhost:9200/`

Run to create indices and import data:

```bash
yarn nx run services-search-indexer:build
yarn nx run services-search-indexer:migrate
```

### Additional Information

#### Dictionaries

Icelandic dictionaries are in the Elasticsearch Docker container under `analyzers/`. For development only. Add required plugins to the Dockerfile.

#### Local Errors

For the error `TOO_MANY_REQUESTS/12/disk usage exceeded flood-stage watermark, index has read-only-allow-delete block`, use:

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_cluster/settings -d '{ "transient": { "cluster.routing.allocation.disk.threshold_enabled": false } }'
```

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": null}'
```

Source: [Stack Overflow](https://stackoverflow.com/questions/63880017/elasticsearch-docker-flood-stage-disk-watermark-95-exceeded#answer-63881121)
