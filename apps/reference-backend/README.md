# Getting started

## Running local dev services

If your service or app needs external services like Postgres, ActiveMQ, etc. you can provision those using `docker-compose`. Your local dev setup should be in a file named `docker-compose.dev.yml`. If you are using those services as part of an integration or end-to-end tests you need to provide a file named `docker-compose.ci.yml`. Optionally if you need to share service setup between local dev and CI run you can do so by extracting the common parts in a file named `docker-compose.base.yml`.

## Running your tests

Running your tests should be doable using `yarn run test <service-name>`.

## Server entry point

Please use the `runServer` method of the `infra-express-server` to run your Express.js server. It is pre-configured with everything needed for telemetry and security. All you need is to provide your routes as per the example.

## Logging

Please use the `logging` library and _not_ `console.log`. We need a single place to control the log routing so if you deviate from that you might not have your log statements delivered correctly to our central storage. 
For using the correct logging levels please see the logging manual [here](https://github.com/island-is/handbook/logging.md)

## Metrics

We use Prometheus for collecting metrics. For more details about the different types of metrics please read [this](https://prometheus.io/docs/concepts/metric_types/).
If you use the `infra-express-server` it is already configured to collect metrics for all your routes and export metrics to be scraped.
For more details, please see the metrics manual [here](https://github.com/island-is/handbook/metrics.md)

## Tracing

If you use the `infra-express-server` it is already configured to provide support for tracing for HTTP/HTTPS API calls as well as support for your service to participate in tracing. We have not added support for tracing to Postgres as is but hope to take care of this soon enough. You do not need to do anything for this to work. It will start working automatically when we add this.
For more details, please see the tracing manual [here](https://github.com/island-is/handbook/tracing.md)

