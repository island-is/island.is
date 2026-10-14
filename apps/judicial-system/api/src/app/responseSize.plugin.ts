import tracer from 'dd-trace'
import { ApolloServerPlugin } from '@apollo/server'

export const GRAPHQL_OPERATION_TAG = 'graphql.operation.name'
export const GRAPHQL_RESPONSE_BYTES_TAG = 'graphql.response.bytes'

/**
 * Tags the active span with the GraphQL operation name and the size of the
 * response body it is about to send, in bytes before compression.
 *
 * The case query is the heaviest thing the web app fetches, and the work to
 * slim it down is only provable if the bytes per operation are recorded
 * somewhere. The span tag can be turned into a metric in Datadog and split by
 * operation name.
 *
 * The span active here is Nest's router middleware span for the GraphQL
 * route, not the request entry span, so the tags sit one level below the
 * route and status code. Bytes per operation is all they are for, and that
 * reads fine off the middleware span.
 *
 * Telemetry must never fail a response, so the measurement is best effort:
 * nothing is recorded if there is no active span or the body cannot be
 * serialized.
 */
export const responseSizePlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ operation, request, response }) {
        if (response.body.kind !== 'single') {
          return
        }

        const span = tracer.scope().active()

        if (!span) {
          return
        }

        // The operation Apollo resolved is the authority on the name; the
        // request's operationName is client-supplied and may be left out
        // for a document with a single named operation. It is still the
        // only name there is when the request failed before an operation
        // was resolved.
        const operationName =
          operation?.name?.value ?? request.operationName ?? 'anonymous'

        try {
          span.addTags({
            [GRAPHQL_OPERATION_TAG]: operationName,
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
