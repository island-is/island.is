import tracing from './lib/datadog-tracer'
export * from './lib/datadog-tracer' // must come before importing any instrumented module.
export default tracing
