# Logging (LOG)

Sources: [Log management policy](https://docs.devland.is/technical-overview/log-management-policy.md), [Developer guidelines](https://docs.devland.is/technical-overview/log-management-policy/developer-guidelines.md), [Logging how-to](https://docs.devland.is/development/devops/logging.md)

- **LOG-1** Never log personal data: national IDs (kennitala), names, emails, phone numbers, addresses, dates of birth, financial or health data. `maskNationalId` in `@island.is/logging` is a safety net, not permission.
- **LOG-2** Never log secrets: tokens, API keys, passwords, cookies, session IDs, authorization headers.
- **LOG-3** Don't log full request/response bodies, user objects, or large objects. Log identifiers that aren't personal (GUIDs, `traceSid`) and short messages.
- **LOG-4** Don't log raw error objects from external clients or DB drivers. Their messages, configs and `response.data` often carry personal data or tokens. Log a safe message plus non-personal fields (status code, error code). Use `cause` when rethrowing.
- **LOG-5** Use `@island.is/logging` (`LOGGER_PROVIDER` / `logger`). No `console.*` in server code.
- **LOG-6** Levels: network failures and 5xx → `error`; 4xx and expected failures → `warn`. Invalid user input is a 4xx response, not an error log. Only `info` and above reach Datadog in production.
- **LOG-7** Don't log the same failure twice (once where it's caught, again in middleware). Let unexpected errors bubble up to the global handler.
- **LOG-8** No `info` logs inside unbounded loops or per-item batch processing.
- **LOG-9** Server logs carry `context` (child logger or `withLoggingContext`). Correlate by `traceSid` or request ID, never by personal data.
