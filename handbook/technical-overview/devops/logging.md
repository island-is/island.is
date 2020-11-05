# Logging

Logging is one of the foundational pieces of telemetry we need to understand issues at runtime. It is therefore deemed one of the core responsibilities of developers to provide meaningful logs.

## Logging infrastructure

Developers should use the `logging` library that is part of the monorepo and is configured for local as well as production environments. Don't use other methods of logging since that could lead to log statements not getting delivered correctly to the central log store.

## Logging levels

The logging levels to be used are `error`, `warn`,`info` and `debug`. Everything from level `info` and up (that's `info`, `error` and `warn`) are delivered to the central log store. You can use all the levels of course but the logs with logging level lower than `info` will be discarded when deployed to one of the environments. We can change the logging level for a specific service to a lower level but that is a manual operation, to be used only as a last resort.

Example - [logging](https://github.com/island-is/island.is/blob/master/apps/reference-backend/src/app/modules/resource/resource.service.ts#L31-L33)

## Viewing logs

You can search for and view the logs from all environments at [https://app.datadoghq.eu/logs](https://app.datadoghq.eu/logs?env=dev).

## Best practices

Use `error` when you are reporting errors or exceptions.

Use `warn` when things are in 'suspicious' or potentially problematic state.

Use `info` when reaching important states - server started, user created, registration complete, etc. or anything worth knowing about

Use `debug` for additional info.

Avoid logging at level `info` inside unbounded loops.

Don't log the same exception/error multiple times.

Do not log full personal identifiable or other sensitive information. User database IDs are preferred to users' names for example.
