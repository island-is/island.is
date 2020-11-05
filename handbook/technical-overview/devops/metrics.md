# Metrics

Metric is one of the foundational pieces of telemetry we need to understand issues at runtime. It is theresfore deemed one of the core responsibilities of developers to provide metrics in their services.

## Metrics infrastructure

We are using [Prometheus](https://prometheus.io) for collecting, storing and querying metrics. To see the different metric types available please see [here](https://prometheus.io/docs/concepts/metric_types/). For more information on the naming of metrics, please see [here](https://prometheus.io/docs/practices/naming/).

If you are using the `infra-express-server` or `infra-next-server` libraries you already have the metrics infrastructure setup for you. Additionally, we already provide metrics for the routes you are creating.

## Types of metrics

We are collecting metrics at three distinct levels:

- infrastructure
- runtime
- application

**Infrastructure** metrics are gathered from different layers of infrastructure - cloud, operating system, Kubernetes, Docker.

**Runtime** metrics are gathered from our application runtime - NodeJS. These are about the utilization of different types of heap, CPU, etc.

**Application** metrics are about the entities and operations performed on those, that are in the domain of the application. Providing these metrics is a responsibility of the developers. It is important to have metrics for both successful as well as unsuccessful operations. For example: "application registration successful", application registration failed", etc. For an example, please take a look at this [file](https://github.com/island-is/island.is/blob/master/libs/infra-express-server/src/lib/infra-express-server.ts).
