# Metrics

Metric is one of the foundational pieces of telemetry we need to understand issues at runtime. It is therefore deemed one of the core responsibilities of developers to provide metrics in their services.

We use [StatsD](https://www.datadoghq.com/blog/statsd/) with extensions from DataDog.

## Levels of metrics

We are collecting metrics at three distinct levels:

- infrastructure
- runtime
- application

**Infrastructure** metrics are gathered from different layers of infrastructure - cloud, operating system, Kubernetes, Docker.

**Runtime** metrics are gathered from our application runtime - NodeJS. These are about the utilization of different types of heap, CPU, etc.

**Application** metrics are about the entities and operations performed on those that are in the domain of the application. Providing these metrics is a responsibility of the developers. It is important to have metrics for both successful as well as unsuccessful operations. For example: "application registration successful", application registration failed", etc. For an example, please take a look at this [file](https://github.com/island-is/island.is/blob/main/libs/infra-express-server/src/lib/infra-express-server.ts).

## Types of application metrics

We are collecting application metrics of two types:

- counters
- timers

**Counters** are used to count the number of times an event has occurred. For example: "number of successful HTTP requests", "number of failed HTTP requests", etc.

**Timers** are used to measure the time it takes to perform an operation in milliseconds. For example: "time it takes to generate a response", "time it takes to generate a PDF", etc.

### Naming metrics

Metrics should be named with ASCII letters, underscores and periods. Periods are used to create a hierarchy and should be passed into the metrics client. Following that there should be a prefix for the given service and more detailed name for the metric in question. Note that metrics always starts with `islandis.` (this is automatically provided by metrics client). See more in ["What best practices are recommended for naming metrics and tags?" from DataDog](https://docs.datadoghq.com/developers/guide/what-best-practices-are-recommended-for-naming-metrics-and-tags/).

### Example

```typescript
import { DogStatsD } from '@island.is/infra-metrics'

// Given this client (which will add `islandis.` prefix)
const metrics = new DogStatsD({ prefix: `my-service.` })

// increment a metric for a call to the service by 1 with tags
metrics.increment('request', { my: 'tag' })

// for timers there are static helpers to track duration
const start = DogStatsD.timer()
const success = callMyService()
// and return as milliseconds
metrics.timing('request.duration', DogStatsD.duration(start))

// it either is ok or there's an error and we can track that over time
if (success) {
  metrics.increment('request.ok', { my: 'tag' })
} else {
  metrics.increment('request.error', { my: 'tag' })
}
```

### Tags

Metrics can be tagged which can help categorizing and creating relevant filters in DataDog.

Beware that each new tag will incur extra cost so use existing tags or create tags that will be used.

## Local development and debugging

In our environments all metrics are sent to DataDog. In local development, we can use [`statsd-debug`](https://github.com/dasch/statsd-debug) to output all metrics to the console. If any projects are running that report metrics, they will by default send them to `localhost:8125`.`

To get this running via docker:

```bash
> docker run -p 8125:8125/udp dasch/statsd-debug
# Run some code that reports metrics
Counter `islandis.my-service.request' 1.0 my:tag
Timer `islandis.my-service.request.duration' 244.123
Counter `islandis.my-service.request.ok' 1.0 my:tag
Counter `islandis.my-service.request' 1.0 my:tag
Timer `islandis.my-service.request.duration' 912.345
Counter `islandis.my-service.request.error' 1.0 my:tag
```

## Examples

- [`withMetrics` middleware](https://github.com/island-is/island.is/blob/main/libs/clients/middlewares/src/lib/withMetrics.ts)
- [License service metrics](https://github.com/island-is/island.is/blob/main/libs/api/domains/license-service/src/lib/licenseService.service.ts)
