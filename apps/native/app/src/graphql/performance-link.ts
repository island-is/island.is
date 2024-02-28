import { ApolloLink } from '@apollo/client'
import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf'
import { OperationDefinitionNode } from 'graphql'

export const performanceLink = new ApolloLink((operation, forward) => {
  if (!forward) {
    return null
  }

  const perfObj = perf()

  if (!perfObj || !perfObj.isPerformanceCollectionEnabled) {
    return forward(operation)
  }

  let trace: FirebasePerformanceTypes.Trace | undefined

  try {
    const operationType = (
      operation?.query?.definitions?.[0] as OperationDefinitionNode
    )?.operation

    if (operationType !== 'subscription' && operation) {
      let traceName = `${operation.operationName ?? ''}`.trim()

      if (traceName.charAt(0) === '_') {
        traceName = traceName.substr(1, traceName.length - 1).trim()
      }

      if (traceName.charAt(traceName.length - 1) === '_') {
        traceName = traceName.substr(0, traceName.length - 1).trim()
      }

      if (traceName.length === 0 || traceName === '_') {
        traceName = 'unknown'
      }

      trace = perfObj.newTrace(`graphql:${traceName.substr(0, 24)}`)
      trace.start()
    }
  } catch (e) {
    // Swallow?
  }

  return forward(operation).map((result: any) => {
    if (trace !== undefined) {
      trace.stop()
      trace = undefined
    }
    return result
  })
})
