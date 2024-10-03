```markdown
# Elastic

This library was generated with [Nx](https://nx.dev).

## Running Unit Tests

To execute the unit tests using [Jest](https://jestjs.io), run the following command:

```bash
ng test api-catalogue-elastic
```

## Local Development with Elasticsearch

For local development, an Elasticsearch Docker container is recommended. The setup is defined in `elastic.yml`, which creates a Docker container named `es01`.

### Initial Setup

To start the container, run the following command:

```bash
docker compose -f ./libs/api-catalogue/elastic/elastic.yml up
```

Once the `es01` container is running, you can load initial data from `initialData.txt` with the following `curl` command:

```bash
curl -H 'Content-Type: application/x-ndjson' -XPOST localhost:9200/_bulk --data-binary '@./libs/api-catalogue/elastic/initialData.txt'
```

### Managing the Index

To delete the index, use the following `curl` command:

```bash
curl -XDELETE localhost:9200/apicatalogue
```
```