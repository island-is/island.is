import { trace } from '@opentelemetry/api'
import { B3Propagator } from '@opentelemetry/core'
import { NodeTracerProvider } from '@opentelemetry/node'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { SimpleSpanProcessor } from '@opentelemetry/tracing'
import { Tag } from '@opentelemetry/exporter-jaeger/build/src/types'

const provider = new NodeTracerProvider({
  plugins: {
    https: {
      enabled: true,
      path: '@opentelemetry/plugin-https',
      // https plugin options
    },
    http: {
      enabled: true,
      path: '@opentelemetry/plugin-http',
      // http plugin options
    },
    pg: {
      enabled: false,
      // we use newer version of pg module that is not yet supported by this plugin
    },
    'pg-pool': {
      enabled: false,
      // we use newer version of pg-pool that is not yet supported by this plugin
    },
    express: {
      enabled: true,
      path: '@opentelemetry/plugin-express',
    },
  },
})

const setupProvider = (serviceName: string) => {
  const options = {
    serviceName,
    tags: (process.env.TRACING_TAGS || '').split(',').map((tagPair) => {
      const [key, value] = tagPair.split('=')
      return { key, value } as Tag
    }), // optional
    host: process.env.TRACING_HOST || 'localhost', // optional
    port: parseInt(process.env.TRACING_PORT || '6832'), // optional
    maxPacketSize: 65000, // optional
  }

  const exporter = new JaegerExporter(options)
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
  provider.register({
    propagator: new B3Propagator(),
  })
}

let initiated = false

export const initTracing = (serviceName: string) => {
  if (initiated) {
    throw new Error('Tracing already initiated. Cannot do this again')
  }
  setupProvider(serviceName)
  initiated = true
}
