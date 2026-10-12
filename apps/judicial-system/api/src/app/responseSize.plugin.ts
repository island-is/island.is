import tracer from 'dd-trace'
import { ApolloServerPlugin } from '@apollo/server'

export const GRAPHQL_OPERATION_TAG = 'graphql.operation.name'
export const GRAPHQL_RESPONSE_BYTES_TAG = 'graphql.response.bytes'

/**
 * Tags the request span with the GraphQL operation name and the size of the
 * response body it is about to send, in bytes before compression.
 *
 * The case query is the heaviest thing the web app fetches, and the work to
 * slim it down is only provable if the bytes per operation are recorded
 * somewhere. The span tag can be turned into a metric in Datadog and split by
 * operation name.
 *
 * Telemetry must never fail a response, so the measurement is best effort:
 * nothing is recorded if there is no active span or the body cannot be
 * serialized.
 */
export const responseSizePlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ request, response }) {
        if (response.body.kind !== 'single') {
          return
        }

        const span = tracer.scope().active()

        if (!span) {
          return
        }

        try {
          span.addTags({
            [GRAPHQL_OPERATION_TAG]: request.operationName ?? 'anonymous',
            [GRAPHQL_RESPONSE_BYTES_TAG]: Buffer.byteLength(
              JSON.stringify(response.body.singleResult),
            ),
          })
        } catch {
          // A body that cannot be serialized is the response's problem to
          // report, not this plugin's.
        }
      },
    }
  },
}
