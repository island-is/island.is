import tracer from 'dd-trace'

/**
 * Puts the active trace's context on an outgoing fetch to the backend so
 * backend spans join the digital-mailbox operation's trace.
 *
 * dd-trace fetch instrumentation is disabled in infra
 * (`DD_TRACE_DISABLED_INSTRUMENTATIONS=fetch`), and Node's global fetch does
 * not go through the `http` module hooks, so outgoing fetch otherwise carries
 * no trace headers.
 */
export const withTraceContext = (options: RequestInit): RequestInit => {
  const span = tracer.scope().active()

  if (!span) {
    return options
  }

  const carrier: Record<string, string> = {}

  tracer.inject(span, 'http_headers', carrier)

  // Plain-object headers (not Headers) so callers that spread into fetch keep
  // a simple Record and authorization is preserved alongside trace fields.
  const existing =
    options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : (options.headers as Record<string, string> | undefined) ?? {}

  return {
    ...options,
    headers: {
      ...existing,
      ...carrier,
    },
  }
}
