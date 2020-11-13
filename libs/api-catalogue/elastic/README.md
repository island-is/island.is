# Elastic

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `ng test api-catalogue-elastic` to execute the unit tests via [Jest](https://jestjs.io).

Local development uses a docker container for elasticsearch.
The `elastic.yml` sets up a docker container named `es01` and needs to be running.

For the initial setup the command: `docker-compose -f .\libs\api-catalogue\elastic\elastic.yml up` initiates the container which can then be managed through Docker.

After the `es01` is running it can be initialized with data from `initialData.json` using curl command:
`curl -H 'Content-Type: application/x-ndjson' -XPOST localhost:9200/_bulk --data-binary '@./libs/api-catalogue/elastic/initialData.txt'`

The curl command: `curl -XDELETE localhost:9200/apicatalogue` can be used to delete the index.
