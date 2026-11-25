import tracer from 'dd-trace'

/**
 * Puts the active trace's context on a request to the backend, so that the
 * backend's spans join the api's trace instead of starting one of their own.
 *
 * dd-trace does not do this for us. Its fetch instrumentation is switched off
 * on every service (`DD_TRACE_DISABLED_INSTRUMENTATIONS=fetch`, set in the
 * infra DSL because dd-trace 5.108 injected the headers twice and a WAF
 * rejected the result), and Node's global fetch does not go through the
 * `http` module that the remaining instrumentation hooks. So an outgoing
 * fetch carries no trace headers at all, and a GraphQL operation cannot be
 * followed to the case load it caused. With the instrumentation off this is
 * the only injection, so nothing is doubled.
 *
 * Without an active span, locally for instance, where the tracer is not
 * started, the options are returned untouched.
 */
export const withTraceContext = (options: RequestInit): RequestInit => {
  const span = tracer.scope().active()

  if (!span) {
    return options
  }

  const carrier: Record<string, string> = {}

  tracer.inject(span, 'http_headers', carrier)

  const headers = new Headers(options.headers)

  for (const [name, value] of Object.entries(carrier)) {
    headers.set(name, value)
  }

  return { ...options, headers }
}
