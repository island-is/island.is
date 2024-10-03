# Elasticsearch Search Dev Server

### Dependencies

Ensure `docker` and `docker compose` are installed and running.  
**Allocate 4GB+ RAM to Docker.**

### Start the Server

```bash
yarn dev-services services-search-indexer
```

After ~30 seconds, Elasticsearch should be on `localhost:9200` and Kibana on `localhost:5601`.

### Import Data

**Contentful access is required for the indexer.**  
To create indices and import data, set:

Required environment variables:

- `CONTENTFUL_HOST=preview.contentful.com` (from Contentful)
- `CONTENTFUL_ACCESS_TOKEN=` (from Contentful or via `yarn get-secrets api`)
- `ELASTIC_NODE=http://localhost:9200/`

Run:

```bash
yarn nx run services-search-indexer:build
yarn nx run services-search-indexer:migrate
```

### Additional Information

#### Dictionaries

Icelandic dictionaries are included under `analyzers/` in the Elasticsearch Docker container during build. The index template must be inserted manually. Dockerfiles here are **not used in production**. Ensure any added plugins are included in required deployments.

#### Local Errors

For `TOO_MANY_REQUESTS/12/disk usage exceeded flood-stage watermark, index has read-only-allow-delete block` errors, increase disk usage limits with:

```bash
curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_cluster/settings -d '{ "transient": { "cluster.routing.allocation.disk.threshold_enabled": false } }'

curl -XPUT -H "Content-Type: application/json" http://localhost:9200/_all/_settings -d '{"index.blocks.read_only_allow_delete": null}'
```

Source: [Stack Overflow](https://stackoverflow.com/questions/63880017/elasticsearch-docker-flood-stage-disk-watermark-95-exceeded#answer-63881121)