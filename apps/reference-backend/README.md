```markdown
## Reference Backend Documentation

### Overview

This project serves as a reference for future backend projects.

### URLs

- Development: N/A
- Staging: N/A
- Production: N/A

### Running Local Development Services

To provision external services your app requires, such as Postgres or ActiveMQ, use the following command:

```bash
docker-compose up
```

Ensure your local development setup is defined in a file named `docker-compose.yml`. If you're incorporating these services into integration or end-to-end tests, include them in the CI scripts.

### Running Tests

Execute your tests using the following command:

```bash
yarn run test <service-name>
```

### Server Entry Point

Use the `runServer` method from the `infra-nest-server` to launch your Nest.js server. This method comes pre-configured with essentials like telemetry and security. Provide your main app module as demonstrated in the example documentation.

### Logging

Use the `logging` library instead of `console.log` for any logging operations. Ideally, leverage Nest.js dependency injection to inject a logging instance, which can be overridden and spied on during tests.

The `logging` library centralizes log routing, ensuring that log statements are correctly delivered to our central storage. For appropriate logging levels, refer to the logging manual [here](../../handbook/technical-overview/devops/logging.md).

### Metrics

Prometheus is used for metric collection. To understand the different types of metrics, consult [this documentation](https://prometheus.io/docs/concepts/metric_types/).

By using the `infra-nest-server`, metrics collection for all routes and metric export are automatically configured. For detailed guidance, view the metrics manual [here](../../handbook/technical-overview/devops/metrics.md).

### Tracing

The `infra-nest-server` is configured to support tracing for HTTP/HTTPS API calls and allows your service to integrate with tracing activities. Currently, support for tracing in Postgres is pending but will be available soon. Once added, tracing will activate automatically.

For more information, refer to the tracing manual [here](../../handbook/technical-overview/devops/observability#tracing).

### Code Owners and Maintainers

- [DevOps Team](https://github.com/orgs/island-is/teams/devops/members)
```